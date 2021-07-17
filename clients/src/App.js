import React ,{useEffect} from 'react';

import {Route, Redirect, Switch} from 'react-router-dom';

//our auth store
import { useAuthDispatch,LOGIN_SUCCESS } from './store/authStore';


import Home from './components/HomePage';
import Layout from './containers/Layout';
import Logout from './components/Pages/Auth/Logout';
// import LoginPage from './components/Pages/Auth/Login';

//to check page we're currently in
// import {useAuthStore} from './store/authStore';

//To lazyload pages 
import lazyLoad from './hoc/lazyLoad';


//load pages asynchronously
const LoginPage = lazyLoad(() => import('./components/Pages/Auth/Login'));
const SignUpPage = lazyLoad(() => import('./components/Pages/Auth/Signup'));




const App = () => {
  const dispatch = useAuthDispatch();
  //done so that if there already exist a token, it can be reused again
  useEffect(() => {
    if(localStorage.getItem('user Token')){
      let token = localStorage.getItem('user Token');
      let userId = localStorage.getItem('userId');
      let userType = localStorage.getItem('userType')
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
      <Route path='/auth/logout' >
        <Logout />
      </Route>
      <Route path = '/'>
        <Home />
      </Route>
       <Redirect to='/' />
      </Switch>
      
)


             

  return (
            <Layout>
                {routes}
             </Layout>
  )
}

export default App;