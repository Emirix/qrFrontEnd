import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
axios.defaults.baseURL = "http://192.168.1.80:3050/"
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

