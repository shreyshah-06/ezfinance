import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../assets/ezfinance.png";
import axiosInstance from "../helper/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setAnchorEl(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswords({ ...passwords, [field]: event.target.value });
  };

  const togglePasswordVisibility = (field) => () => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.patch(
        "/changepassword",
        {
          currentPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('heree')
        toast.success("Password changed successfully!"); // Success toast
        handleDialogClose();
      } else {
        toast.error(`Error: ${response.data.message}`); // Error toast
      }
    } catch (error) {
      toast.error("Server Error. Please try again later."); // Error toast
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(to right, #5a7962, #82a28b)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{
              height: "20px",
              marginRight: "15px",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{
              marginRight: "10px",
              "&:hover": {
                color: "#FFD700",
              },
            }}
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleDialogOpen}>Change Password</MenuItem>
          </Menu>

          <Button
            variant="contained"
            sx={{
              background: "#FF5252",
              color: "#FFFFFF",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Soft shadow
              "&:hover": {
                background: "#E53935",
              },
            }}
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Toolbar>

      {/* Change Password Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Old Password"
            type={showPassword.old ? "text" : "password"}
            fullWidth
            margin="normal"
            value={passwords.oldPassword}
            onChange={handlePasswordChange("oldPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility("old")}>
                    {showPassword.old ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            type={showPassword.new ? "text" : "password"}
            fullWidth
            margin="normal"
            value={passwords.newPassword}
            onChange={handlePasswordChange("newPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility("new")}>
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm New Password"
            type={showPassword.confirm ? "text" : "password"}
            fullWidth
            margin="normal"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange("confirmPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility("confirm")}>
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            color="primary"
            variant="contained"
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </AppBar>
  );
};

export default Navbar;
