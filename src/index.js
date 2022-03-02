import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
axios.defaults.baseURL = "http://192.168.1.80:3050/"
// axios.defaults.baseURL = "https://fervent-carver.185-106-208-198.plesk.page/"
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


/*

var con = mysql.createConnection({
  host: "localhost",
  user: "emirix",
  password: "2776810eaEA@",
  database:"emirtanir_mini"

});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

*/
