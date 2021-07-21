import React ,{useEffect} from 'react';

import {Route, Redirect, Switch} from 'react-router-dom';
import openSocket from 'socket.io-client';


//our auth store
import { useAuthDispatch,LOGIN_SUCCESS,useAuthStore,LOGOUT,NOTIFICATION,
  INIT_NOTIFICATION,ERROR_OCCUR } from './store/authStore';

// For changing the notification states of doctor
import {getDoctor,getNotifications} from './utils/patientsHelper';

//pages to render
import Home from './components/HomePage';
import Layout from './containers/Layout';
import Logout from './components/Pages/Auth/Logout';
import Patient from './components/Pages/Patient';



//To lazyload pages 
import lazyLoad from './hoc/lazyLoad';


//load pages asynchronously
const LoginPage = lazyLoad(() => import('./components/Pages/Auth/Login'));
const SignUpPage = lazyLoad(() => import('./components/Pages/Auth/Signup'));
const AddPatient = lazyLoad(() => import('./components/Pages/AddPatient'));
const EncounterPatient = lazyLoad(() => import('./components/Pages/EncounterPatient'));
const NotificationsPage = lazyLoad(() => import('./components/Pages/Notifications'));
const NotificationPage = lazyLoad(() => import('./components/Pages/Notification'));




const App = () => {
  const dispatch = useAuthDispatch();
  const authStore = useAuthStore();
  //done so that if there already exist a token, it can be reused again
  useEffect(() => {
    if(localStorage.getItem('user Token')){
      let token = localStorage.getItem('user Token');
      let userId = localStorage.getItem('userId');
      let userType = localStorage.getItem('userType');
      let expiryDate = localStorage.getItem('expiryDate');
      
      if (new Date(expiryDate) <= new Date()) {
        dispatch({type:LOGOUT});
        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
        localStorage?.removeItem('userType');
        return;
      }
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
    const socket = openSocket('http://localhost:8080');
    socket.on('notifications',data => {
      //data sent from socket
      console.log(data);
      
      //This ensure that only the doctor to whom it is sent receive it
      if(data.to._id.toString() === authStore.token.toString())
      {
        getNotifications(authStore.token)
        .then(data => {
          dispatch({
            type:NOTIFICATION,
            notifications: data.notifications
          })
        })
        .catch(err => {
          console.log(err);
        })
      }
     
    })
  }
    //end of If check
    }//end if this is a doctor type
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