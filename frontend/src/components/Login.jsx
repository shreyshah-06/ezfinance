import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Lottie from "lottie-react";
import AppLogo from "../assets/ezfinance.png";
import HiAnimation from "../assets/hiAnimation.json"; 
import LoginAnimation from "../assets/loginAnimation.json"; 
import axiosInstance from "../helper/axios";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state to true
    setIsLoading(true);
    
    try {
      const response = await axiosInstance.post("/login", loginData);
      if (typeof response.data.token !== "undefined") {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("Bad Credentials", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      // Set loading state back to false regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        height: "100vh",
        background:
          "linear-gradient(90deg, #7a8771 0%, #76885b 29%, #627254 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Fullscreen Overlay Loader */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(98, 114, 84, 0.7)',
          position: 'absolute',
        }}
        open={isLoading}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ color: '#FBFADA' }}
          />
         <Typography variant="h6" color="#FBFADA" fontWeight="bold">
            Logging in... please be patient — our free server is doing its best!
          </Typography>
        </Box>
      </Backdrop>

      {/* Left-Side Animation */}
      <Grid
        item
        xs={12}
        sm={4}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "2rem",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "1.5rem",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.2)",
            padding: "2rem",
            maxWidth: "450px",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* Lottie Animation */}
          <Lottie
            animationData={LoginAnimation}
            autoplay
            loop
            style={{
              height: "80%",
              width: "100%",
              maxWidth: "100%",
            }}
          />
        </Box>
      </Grid>

      {/* Login Form */}
      <Grid
        item
        xs={12}
        sm={6}
        md={5}
        lg={4}
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "2rem",
          p: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          marginLeft: { sm: "auto" },
          marginRight: { xs: "2rem", sm: "3rem", md: "5rem" }, 
        }}
      >
        {/* Logo */}
        <Box textAlign="center" mb={2}>
          <img
            src={AppLogo}
            alt="App Logo"
            style={{ maxWidth: "150px", height: "auto" }}
          />
        </Box>
        {/* Lottie Animation Greeting */}
        <Box textAlign="center" mb={2}>
          <Lottie
            animationData={HiAnimation}
            style={{ height: "120px", width: "120px", margin: "0 auto" }}
            autoplay
            loop
          />
        </Box>

        <Typography
          variant="h4"
          align="center"
          mb={3}
          sx={{
            background: "linear-gradient(90deg, #627254, #FBFADA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
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
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#b6d1a4",
              },
              "&:hover fieldset": {
                borderColor: "#627254",
              },
            },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          name="password"
          value={loginData.password}
          onChange={handleInputChange}
          sx={{
            mb: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#b6d1a4",
              },
              "&:hover fieldset": {
                borderColor: "#627254",
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
              backgroundColor: "#627254",
              color: "#FBFADA",
              fontWeight: "bold",
              px: 4,
              py: 1,
              transition: "all 0.3s ease",
              ":hover": {
                backgroundColor: "#5c6e4b",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                transform: "scale(1.05)",
              },
            }}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </Box>

        <Typography align="center">
          Don't have an account?{" "}
          <Link href="/signup" underline="hover" color="primary">
            Sign Up
          </Link>
        </Typography>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default Login;