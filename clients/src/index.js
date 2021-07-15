import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';


import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import ErrorBoundary from './hoc/ErrorBoundary';
import {AuthProvider} from './store/authStore';

const app = (
  <React.StrictMode>
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  </React.StrictMode>
);
ReactDOM.render(
  app,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
