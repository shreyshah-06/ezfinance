import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', loginData); 
      console.log('Login response:', response.data);
      if (typeof response.data.token !== "undefined") {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  <style>{`

  .input-field:focus {
    border: 2px solid red !important;
    outline: none;
  }
  `}</style>
  return (
    <>
    <div className=" container-fluid gradient-form d-flex justify-content-center align-items-center"
    style={{ overflow: "hidden", position: "relative", width:"100%",height:"100vh" ,padding: '0px !important',background: "rgb(122,135,113)",
    background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)"}}>
          <div className="mb-5 d-flex justify-content-center align-items-center">
          <div className="d-flex flex-column p-4" style={{backgroundColor:'#EEEEEE',borderRadius:'0.5rem'}}>
            <div className="text-center">
              <h3>Login</h3>
            </div>
            <input
              type="email"
              className="mt-4 p-2 mb-2 input-field:"
              style={{ height: "6vh", borderRadius: "6px",border:'2px solid #b6d1a4', outline: 'none' }}
              placeholder="Email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="Password"
              className="my-2 p-2 input-field:"
              style={{ height: "6vh", borderRadius: "6px",border:'none',border:'2px solid #b6d1a4' , outline: 'none'  }}
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              required
            />
            <div className="text-center pt-1 mb-3 pb-1 mt-1">
              <button
                type="button"
                className="btn w-50 align-items-center justify-content-center"
                style={{ color: "#FBFADA",backgroundColor:"#627254",fontSize:"1.1rem",fontWeight:'bold'}}
                onClick={handleSubmit}
                onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)"; }}
                onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
              >
                Login
              </button>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mx-1">Don't have an account?</p>
              <p className="signup-link" style={{ textDecoration: 'none', color: 'blue' }}>Sign Up</p>
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default Login;

