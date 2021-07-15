import React from 'react';

import {Route, Redirect, Switch} from 'react-router-dom';


import Home from './components/HomePage';
import Layout from './containers/Layout';
import LoginPage from './components/Pages/Auth/Login';

//to check page we're currently in
// import {useAuthStore} from './store/authStore';

//To lazyload pages 
//import lazyLoad from './hoc/lazyLoad';

//load pages asynchronously
//const LoginPage = lazyLoad(() => import('./components/Pages/Auth/Login'));




const App = () => {
  
  
  
  let routes = (
    
      <Switch>
      
      <Route path ='/auth/login'>
        <LoginPage />
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