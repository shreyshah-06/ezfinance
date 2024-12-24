import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../assets/ezfinance.png';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar
  position="fixed"
  sx={{
    background: 'linear-gradient(to right, #5a7962, #82a28b)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  }}
>
  <Toolbar
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={() => navigate('/dashboard')}
    >
      <img
        src={Logo}
        alt="Logo"
        style={{
          height: '20px',
          marginRight: '15px',
          transition: 'transform 0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      />
    </div>

    <Button
      variant="contained"
      sx={{
        background: '#FF5252',
        color: '#FFFFFF',
        textTransform: 'none',
        fontWeight: 'bold',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow
        '&:hover': {
          background: '#E53935',
        },
      }}
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
    >
      Logout
    </Button>
  </Toolbar>
</AppBar>

  );
};

export default Navbar;