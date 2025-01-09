import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AppLogo from '../assets/ezfinance.png';
import axiosInstance from "../helper/axios";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/login', loginData);
      if (typeof response.data.token !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      toast.error('Bad Credentials', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: '100vh',
          position: 'relative',
          background: 'linear-gradient(90deg, #7a8771 0%, #76885b 29%, #627254 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Background animation */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(98,114,84,0.3) 10%, transparent 80%)',
            animation: 'float 20s ease-in-out infinite',
            zIndex: 1,
          }}
        ></Box>

        <Grid
          item
          xs={10}
          sm={8}
          md={5}
          lg={4}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '1rem',
            p: 4,
            boxShadow: 4,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Logo */}
          <Box textAlign="center" mb={2}>
            <img
              src={AppLogo} // Replace with the actual logo path
              alt="App Logo"
              style={{ maxWidth: '150px', height: 'auto' }}
            />
          </Box>

          <Typography
            variant="h4"
            align="center"
            mb={3}
            sx={{
              background: 'linear-gradient(90deg, #627254, #FBFADA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Login
          </Typography>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#b6d1a4',
                },
                '&:hover fieldset': {
                  borderColor: '#627254',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#b6d1a4',
                },
                '&:hover fieldset': {
                  borderColor: '#627254',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Forgot Password */}
          <Box textAlign="right" mb={2}>
            <Link href="/forgot-password" underline="hover" color="primary">
              Forgot Password?
            </Link>
          </Box>
          <Box textAlign="center" mb={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#627254',
                color: '#FBFADA',
                fontWeight: 'bold',
                px: 4,
                py: 1,
                transition: 'all 0.3s ease',
                ':hover': {
                  backgroundColor: '#5c6e4b',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                  transform: 'scale(1.05)',
                },
              }}
              onClick={handleSubmit}
            >
              Login
            </Button>
          </Box>
          <Typography align="center">
            Don't have an account?{' '}
            <Link href="/signup" underline="hover" color="primary">
              Sign Up
            </Link>
          </Typography>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default Login;
