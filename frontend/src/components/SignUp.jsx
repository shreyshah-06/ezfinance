import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Box,
  Grid,
  Link,
  Autocomplete,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import AppLogo from "../assets/ezfinance.png";
import welcomeAnimation from "../assets/welcomeAnimation.json";
import signupAnimation from "../assets/singupAnimation.json";
import axiosInstance from "../helper/axios";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [isStateTouched, setIsStateTouched] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  useEffect(() => {
    // Check if all fields are filled and valid
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // password validation
    const isValid =
      signupData.companyName.trim() !== "" &&
      signupData.email.trim() !== "" &&
      passwordRegex.test(signupData.password) &&
      signupData.password === signupData.confirmPassword &&
      signupData.state !== "";

    setIsFormValid(isValid);
  }, [signupData]);
  const passwordCheck = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // password validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await axiosInstance.post("/register", signupData);
      toast.success("Signup successful!");
      console.log("Signup response:", response.data);
    } catch (error) {
      toast.error("Signup failed. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
      console.error("Signup error:", error);
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
      }}
    >
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
            animationData={signupAnimation}
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
        <Box textAlign="center">
          <img
            src={AppLogo}
            alt="App Logo"
            style={{ maxWidth: "150px", height: "auto" }}
          />
        </Box>
        {/* Lottie Animation Greeting */}
        <Box textAlign="center">
          <Lottie
            animationData={welcomeAnimation}
            style={{ height: "90px", width: "120px", margin: "0 auto" }}
            autoplay
            loop
          />
        </Box>

        <Typography
          variant="h4"
          align="center"
          mb={1}
          sx={{
            background: "linear-gradient(90deg, #627254, #FBFADA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Signup
        </Typography>
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
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#b6d1a4",
              },
              "&:hover fieldset": {
                borderColor: "#627254",
              },
            },
          }}
          error={
            !passwordCheck.test(signupData.password) &&
            signupData.password !== ""
          }
          helperText={
            !passwordCheck.test(signupData.password) &&
            signupData.password !== ""
              ? "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number."
              : ""
          }
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
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#b6d1a4",
              },
              "&:hover fieldset": {
                borderColor: "#627254",
              },
            },
          }}
          error={
            signupData.confirmPassword !== signupData.password &&
            signupData.confirmPassword !== ""
          }
          helperText={
            signupData.confirmPassword !== signupData.password &&
            signupData.confirmPassword !== ""
              ? "Passwords do not match."
              : ""
          }
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
        <Autocomplete
          options={indianStates}
          value={signupData.state || null}
          onChange={(event, newValue) => {
            setSignupData((prev) => ({ ...prev, state: newValue || "" }));
            setIsStateTouched(true);
          }}
          onBlur={() => setIsStateTouched(true)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              fullWidth
              variant="outlined"
              size="small"
              required
              error={!signupData.state.trim() && isStateTouched}
              helperText={
                !signupData.state.trim() && isStateTouched
                  ? "State is required"
                  : ""
              }
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor:
                      !signupData.state.trim() && isStateTouched
                        ? "red"
                        : "#b6d1a4",
                  },
                  "&:hover fieldset": {
                    borderColor:
                      !signupData.state.trim() && isStateTouched
                        ? "red"
                        : "#627254",
                  },
                },
              }}
            />
          )}
        />

        <Box textAlign="center" mb={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!isFormValid}
            sx={{
              backgroundColor: "#627254",
              color: "#FBFADA",
              fontWeight: "bold",
              height: 40,
              fontSize: "0.9rem",
              textTransform: "none",
              transition: "all 0.3s ease",
              ":hover": {
                backgroundColor: "#4b5e3f",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                transform: "scale(1.05)",
              },
            }}
          >
            Signup
          </Button>
        </Box>

        <Typography align="center">
          Already have an account?{" "}
          <Link href="/login" underline="hover" color="primary">
            Login
          </Link>
        </Typography>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default Signup;
