import About from './About';
import ViewAll from './ViewAll';
import Add from './Add';
import Edit from './Edit';
import OrderInformation from './OrderInformation';
import CustomerInformation from './CustomerInformation';
import Delete from './Delete';
import Header from './Header';
import Login from './Login';
import Footer from './Footer';

import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import React from 'react';

import Home from './Home';


const PrivateRoute = ({ element: Element, ...rest }) => {
  const isLoggedIn = localStorage.getItem('loggedIn');
  return isLoggedIn ? <Element {...rest} /> : <Navigate to="/Login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
         {/* Protected routes under /Home */}
        <Route path="/Home" element={<PrivateRoute element={Home} />} />
        <Route path="/Home/ViewAll" element={<PrivateRoute element={ViewAll} />} />
        <Route path="/Home/Add" element={<PrivateRoute element={Add} />} />
        <Route path="/Home/Edit" element={<PrivateRoute element={Edit} />} />
        <Route path="/Home/Delete" element={<PrivateRoute element={Delete} />} />
        <Route path="/Home/OrderInformation" element={<PrivateRoute element={OrderInformation} />} />
        <Route path="/Home/CustomerInformation" element={<PrivateRoute element={CustomerInformation} />} />
        <Route path="/" element={<Navigate to = "/Login" />}/>
      </Routes>
    </Router>
  );
}

export default App;