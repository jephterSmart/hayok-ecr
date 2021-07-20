import React ,{useEffect} from 'react';

import {Route, Redirect, Switch} from 'react-router-dom';

//our auth store
import { useAuthDispatch,LOGIN_SUCCESS,useAuthStore,LOGOUT } from './store/authStore';

//pages to render
import Home from './components/HomePage';
import Layout from './containers/Layout';
import Logout from './components/Pages/Auth/Logout';
import Patient from './components/Pages/Patient';

//to check page we're currently in
// import {useAuthStore} from './store/authStore';

//To lazyload pages 
import lazyLoad from './hoc/lazyLoad';


//load pages asynchronously
const LoginPage = lazyLoad(() => import('./components/Pages/Auth/Login'));
const SignUpPage = lazyLoad(() => import('./components/Pages/Auth/Signup'));
const AddPatient = lazyLoad(() => import('./components/Pages/AddPatient'));
const EncounterPatient = lazyLoad(() => import('./components/Pages/EncounterPatient'));




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
      <Route path='/user/add-patient'>
        <AddPatient />
      </Route>
      <Route path='/user/patients/:patientId'>
        <EncounterPatient />
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