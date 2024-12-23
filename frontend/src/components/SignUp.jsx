import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  IconButton,
  InputAdornment,
  Box,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLogo from "../assets/ezfinance.png";

const Signup = () => {
  const [signupData, setSignupData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    state: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(signupData.password)) {
      toast.error(
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        signupData
      );
      toast.success("Signup successful!");
      console.log("Signup response:", response.data);
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(90deg, #7a8771 0%, #76885b 29%, #627254 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        overflow: "hidden",
      }}
    >
      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />

      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card
          sx={{
            padding: 3,
            borderRadius: 3,
            boxShadow: 5,
            backgroundColor: "#fff",
            maxWidth: "100%",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <img
              src={AppLogo}
              alt="Company Logo"
              style={{ width: "90px", height: "auto" }}
            />
          </Box>


          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              background: "linear-gradient(90deg, #627254, #FBFADA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            Signup
          </Typography>
          {/* Tagline */}
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: "gray",
              fontStyle: "italic",
              marginBottom: 1,
            }}
          >
            Get your journey started with EzFinance!
          </Typography>

          {/* Form Fields */}
          <TextField
            label="Company Name"
            name="companyName"
            value={signupData.companyName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
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
            label="Email"
            name="email"
            type="email"
            value={signupData.email}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
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
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={signupData.password}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
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
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={signupData.confirmPassword}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
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
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="State"
            name="state"
            value={signupData.state}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
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

          {/* Signup Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#627254',
              color: '#FBFADA',
              fontWeight: 'bold',
              height: 40,
              fontSize: "0.9rem",
              textTransform: "none",
              transition: 'all 0.3s ease',
              ":hover": {
                backgroundColor: '#4b5e3f',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                transform: 'scale(1.05)',
              },
            }}
          >
            Signup
          </Button>

          {/* Login Link */}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
          >
            Already have an account?{' '}
            <Typography
              component="span"
              sx={{ color: "blue", cursor: "pointer" }}
            >
              Login
            </Typography>
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Signup;