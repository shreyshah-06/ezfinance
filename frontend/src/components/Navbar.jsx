import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/ezfinance.png'
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ width: '100%' }}>
      <div className='py-2 px-4' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '6px', backgroundColor: '#D0D4CA',paddingLeft: '6px'}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={Logo} alt="Logo" style={{ marginRight: '20px', cursor: 'pointer' }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '1.1rem', color: '#222831', cursor: 'pointer' }}></div>
            <div style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '1.1rem', color: '#222831', cursor: 'pointer' }}></div>
            <div style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '1.1rem', color: '#222831', cursor: 'pointer' }}></div>
          </div>
        </div>
        <div style={{ flex: '1' }}></div>
        <div style={{ cursor: 'pointer', backgroundColor: '#FA7070', color: '#fff', padding: '8px 16px', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }} onClick={handleLogout}>
          Logout
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
