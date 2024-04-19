import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar'

const Signup = () => {
  const [signupData, setSignupData] = useState({ companyName: '', email: '', password: '', confirmPassword: '', State: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
  
    // Check if password meets requirements
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(signupData.password)) {
      alert('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.');
      return;
    }
  
    // Check if passwords match
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/register', signupData);
      console.log('Signup response:', response.data);
      // Handle successful signup, e.g., redirect to dashboard
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <>
      <section style={{}}>
      <Navbar />

    <div className="container-fluid gradient-form d-flex justify-content-center align-items-center"
    style={{ overflow: "hidden", position: "relative", width:"100%",height:"100vh" ,padding: '0px !important',background: "rgb(122,135,113)",
    background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)"}}>
      <div className="mb-5 d-flex justify-content-center align-items-center">
        <div className="d-flex flex-column p-4" style={{backgroundColor:'#EEEEEE',borderRadius:'0.5rem'}}>
          <div className="text-center">
            <h3>Signup</h3>
          </div>
          <input
            type="text"
            className="mt-2 p-2 input-field"
            style={{ height: "6vh", borderRadius: "6px",border:'2px solid #b6d1a4', outline: 'none' }}
            placeholder="Company Name"
            name="companyName"
            value={signupData.companyName}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            className="mt-2 p-2 input-field"
            style={{ height: "6vh", borderRadius: "6px",border:'2px solid #b6d1a4', outline: 'none' }}
            placeholder="Email"
            name="email"
            value={signupData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            className="mt-2 p-2 input-field"
            style={{ height: "6vh", borderRadius: "6px",border:'2px solid #b6d1a4', outline: 'none' }}
            placeholder="Password"
            name="password"
            value={signupData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            className="mt-2 p-2 input-field"
            style={{ height: "6vh", borderRadius: "6px",border:'2px solid #b6d1a4', outline: 'none' }}
            placeholder="Confirm Password"
            name="confirmPassword"
            value={signupData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            className="mt-2 p-2  input-field"
            style={{ height: "6vh", borderRadius: "6px",border:'2px solid #b6d1a4', outline: 'none' }}
            placeholder="State"
            name="State"
            value={signupData.State}
            onChange={handleInputChange}
            required
          />
          <div className="text-center pt-1 pb-1 mt-2 mb-2">
            <button
              type="button"
              className="btn w-50 align-items-center justify-content-center"
              style={{ color: "#FBFADA",backgroundColor:"#627254",fontSize:"1.1rem",fontWeight:'bold'}}
              onClick={handleSubmit}
              onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
            >
              Signup
            </button>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center pb-1 mb-1">
            <p className="mx-1">Already have an account?</p>
            <p className="signup-link" style={{ textDecoration: 'none', color: 'blue' }}>Login</p>
          </div>
        </div>
      </div>
    </div>
      </section>
    </>
  );
};

export default Signup;
