import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAY5h9ESLYQTgMtXHA-dgZdfnsyIH_spg8",
  authDomain: "jp-hacks-cospaapp.firebaseapp.com",
  databaseURL: "https://jp-hacks-cospaapp.firebaseio.com",
  projectId: "jp-hacks-cospaapp",
  storageBucket: "jp-hacks-cospaapp.appspot.com",
  messagingSenderId: "59884379435",
  appId: "1:59884379435:web:594515b32409539092796e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
