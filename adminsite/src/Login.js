import React,{useEffect, useState} from 'react';
import './Styles/Login.css';
import Home from './Home';
import About from './About';
import ViewAll from './ViewAll';
import Add from './Add';
import OrderInformation from './OrderInformation';
import CustomerInformation from './CustomerInformation';
import Delete from './Delete';
import Header from './Header';
import Footer from './Footer';
//import { Router } from 'express';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';

function Login() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
const navigate = useNavigate();
  useEffect(() => {
    console.log(loggedIn);
    const storedData = localStorage.getItem('loggedIn');
    console.log('localStorage content in useEffect:', storedData);
    if (storedData) {
      setLoggedIn(true);
    }
  }, [loggedIn]);
  
const logIn = () => {
  console.log(loggedIn);
  if (username === 'admin' && password === 'password') {
    console.log('Before localStorage update:', localStorage.getItem('loggedIn'));
    localStorage.setItem('loggedIn', true);
    console.log('After localStorage update:', localStorage.getItem('loggedIn'));
    setLoggedIn(true);
    navigate('/Home');
  } else {
    setErrorMessage('Wrong credentials. Please try again.');
  }
};


  
  



    return (
    <div class="login"> 
<h1>LOGIN</h1>

<form>
<label><h2>Enter UserName:</h2></label>
<input type='text' placeholder='username' onChange={(event)=>setUsername(event.target.value)}/>
<label><h2>Enter password:</h2></label>
<input type='password' onChange={(event)=>setPassword(event.target.value)} />
</form>
<button onClick={logIn}>LOGIN</button>
{errorMessage && <h2  className="error-message">{errorMessage}</h2>}
   </div>

   
   
   )


}

export default Login;