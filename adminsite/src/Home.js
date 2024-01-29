
import './Styles/Navigation.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

function Home() {
  // ... (existing code)

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/Login');
  };

  const buttonStyle = {
    float: 'right',
    // Add any other styles you may need
  };

  return (
    <div>
 <button style={{ ...buttonStyle, marginRight: '10px' }} onClick={logout}>
      Logout
    </button>
      <div className="navigation"> 
        <h1><Link to="/Home/ViewAll" className="nav-link">VIEW ALL BOOKS</Link></h1>
        <h1><Link to="/Home/Add" className="nav-link">ADD BOOK</Link></h1>
        <h1><Link to="/Home/Edit" className="nav-link">EDIT BOOK</Link></h1>
        <h1><Link to="/Home/Delete" className="nav-link">DELETE BOOK</Link></h1>
        <h1><Link to="/Home/OrderInformation" className="nav-link">ORDER INFORMATION</Link></h1>
        <h1><Link to="/Home/CustomerInformation" className="nav-link">CUSTOMER INFORMATION</Link></h1>
      </div>

      {/* Logout button positioned at the top right corner */}
      <div className="logout-container">
     
          <button className="logout-button" onClick={logout}>Logout</button>
  
      </div>
    </div>
  );
}

export default Home;
