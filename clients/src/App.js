import React ,{useEffect} from 'react';

import {Route, Redirect, Switch} from 'react-router-dom';
import openSocket from 'socket.io-client';


//our auth store
import { useAuthDispatch,LOGIN_SUCCESS,useAuthStore,LOGOUT,NOTIFICATION,
  INIT_NOTIFICATION,ERROR_OCCUR,INIT_PATIENT,STATISTICS } from './store/authStore';

//our message store
import {UPDATE_MESSAGE,useMessageDispatch,INIT_MESSAGE} from './store/messageStore'

// For changing the notification states of doctor
import {getUserData,getNotifications,getMyMessage} from './utils/patientsHelper';

//pages to render
import Home from './components/HomePage';
import Layout from './containers/Layout';
import Logout from './components/Pages/Auth/Logout';
import Patient from './components/Pages/Patient';
import Record from './components/Pages/Record';



//To lazyload pages 
import lazyLoad from './hoc/lazyLoad';


//load pages asynchronously
const LoginPage = lazyLoad(() => import('./components/Pages/Auth/Login'));
const SignUpPage = lazyLoad(() => import('./components/Pages/Auth/Signup'));
const AddPatient = lazyLoad(() => import('./components/Pages/AddPatient'));
const EncounterPatient = lazyLoad(() => import('./components/Pages/EncounterPatient'));
const NotificationsPage = lazyLoad(() => import('./components/Pages/Notifications'));
const NotificationPage = lazyLoad(() => import('./components/Pages/Notification'));
const MessagesPage = lazyLoad(() => import('./components/Pages/Messages'));
const MessagePage = lazyLoad(() => import('./components/Pages/Message'));
const PatientStat = lazyLoad(() => import('./components/Pages/Statistics'));




const App = () => {
  const dispatch = useAuthDispatch();
  const authStore = useAuthStore();

  const messageDispatch = useMessageDispatch();
  //our connection to web socket
  const socket = openSocket('http://localhost:8080');
  //done so that if there already exist a token, it can be reused again
  useEffect(() => {
    let id;
    if(localStorage.getItem('user Token')){
      let token = localStorage.getItem('user Token');
      let userId = localStorage.getItem('userId');
      let userType = localStorage.getItem('userType');
      let expiryDate = localStorage.getItem('expiryDate');
      const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
      id = setTimeout(() => {
        dispatch({type:LOGOUT});
        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
        localStorage?.removeItem('userType');
        return;
      }, remainingMilliseconds);
    
      
      dispatch({
        type:LOGIN_SUCCESS,
        token: token,
        userId: userId,
        userType: userType
    })
   
    if(userType === 'doctor'){
    getNotifications(token)
    .then(not => {
      console.log(not);
      dispatch({
        type:INIT_NOTIFICATION,
        notifications: not.notifications
      })
      
    }).catch(err =>{
      dispatch({
        type:ERROR_OCCUR,
        error: err
      })
    })
  
    //check for notifications
    
    socket.on('notifications',data => {
      //data sent from socket
      console.log(data);
      
      //This ensure that only the doctor to whom it is sent receive it
      if(data.to._id.toString() === userId.toString())
      {
        getNotifications(token)
        .then(data => {
          dispatch({
            type:NOTIFICATION,
            notifications: data.notifications
          })
        })
        .catch(err => {
          console.log(err);
        })
      }//end of If check for notification
     
    })
    socket.on('statistics',stat => {
      dispatch({
        type:STATISTICS,
        statistics: stat
      })
    })

  }//end if this is a doctor type
else{
  //for cases where we have patient login
  getUserData(token).then(profile => {
    dispatch({
      type:INIT_PATIENT,
      profile:profile
    })

  })
  .catch(err => {
    dispatch({
      type:ERROR_OCCUR,
      error:err
    })
  }) 
}

    }//end of check to see whether you are login
    return () => {
      clearTimeout(id);
    }
  },[])
  
  //useEffect made for messages
  useEffect(() =>{
    if(localStorage.getItem('user Token')){
      let token = localStorage.getItem('user Token');
      let userId = localStorage.getItem('userId');
      let userType = localStorage.getItem('userType');
      getMyMessage(token,userId,userType)
      .then(messages => {
        console.log(messages);
        messageDispatch({
          type:INIT_MESSAGE,
          messages: messages
        })
        
      })
      .catch(err => {
        console.log(err);
      })
      
      //for socket connections
      
    socket.on('messages',data => {
      //data sent from socket
     
      //If the user is Me, then don't do any thing
      if(data.from._id.toString() === userId.toString())
      return;
      //This app does not allow patient to patient || doctor to doctor communication.
      if(data.fromType.toString() === userType.toString())
      return;
      //Then check if it is truely to me.
      if(data.to._id.toString() === userId.toString()){
        messageDispatch({
          type:UPDATE_MESSAGE,
          message: data
        })
      }
      
     
    })

    }
  },[])
  let routes = (
    
      <Switch>
      
      <Route path ='/auth/login'>
        <LoginPage />
      </Route>
      <Route path='/auth/create' >
        <SignUpPage />
      </Route>
      <Route path = '/'>
        <Home />
      </Route>
       <Redirect to='/' />
      </Switch>
      
)

if(authStore.authenticated && authStore.userType === 'doctor'){
  routes = (
    <Switch>
      <Route path='/user/all-patients'>
        <Patient />
      </Route>
      <Route path='/user/view-stat'>
        <PatientStat />
      </Route>
      <Route path='/user/messages'>
        <MessagesPage />
      </Route>
      <Route path='/user/message/:toId'>
        <MessagePage />
      </Route>

      <Route path='/user/add-patient'>
        <AddPatient />
      </Route>
      <Route path='/user/patients/:patientId'>
        <EncounterPatient />
      </Route>
      <Route path='/user/notifications'>
        <NotificationsPage />
      </Route>
      <Route path='/user/:userId/:notificationId' >
        <NotificationPage />
      </Route>
      <Route path='/auth/logout' >
        <Logout />
      </Route>
      <Route path = '/'>
        <Home />
      </Route>
       <Redirect to='/' />
    </Switch>
  )
}

if(authStore.authenticated && authStore.userType !== 'doctor'){
  routes =
  (
    <Switch>
      <Route path='/user/records'>
        <Record />
      </Route>
      <Route path='/user/messages'>
        <MessagesPage />
      </Route>
      <Route path='/user/message/:toId'>
        <MessagePage />
      </Route>
      <Route path='/auth/logout' >
        <Logout />
      </Route>
      
      <Route path = '/'>
        <Home />
      </Route>
      <Redirect to='/' />
    </Switch>
)
}           

  return (
            <Layout>
                {routes}
             </Layout>
  )
}

export default App;