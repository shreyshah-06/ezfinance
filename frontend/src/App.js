import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Category from "./components/Category";
import TaxSlab from "./components/TaxSlab";
import Supplier from "./components/Supplier";
import Expense from "./components/expense";
import Invoice from "./components/Invoice";
import AddInvoice from "./components/dialogbox/addinvoice";
import Sales from "./components/Sales";
import Audit from "./components/Audit";
import "./App.css";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Returns true if a token exists in localStorage
};

// Protected route wrapper
const PrivateRoute = ({ element, redirectTo = "/login" }) => {
  return isAuthenticated() ? element : <Navigate to={redirectTo} />;
};

ReactGA.initialize("G-HCQEWR8XM7");

function App() {
  const location = useLocation();

  useEffect(() => {
    // Send page view to Google Analytics on route change
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Public Routes */}
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route
          path="/inventory"
          element={<PrivateRoute element={<Inventory />} />}
        />
        <Route
          path="/category"
          element={<PrivateRoute element={<Category />} />}
        />
        <Route path="/tax" element={<PrivateRoute element={<TaxSlab />} />} />
        <Route
          path="/supplier"
          element={<PrivateRoute element={<Supplier />} />}
        />
        <Route
          path="/expense"
          element={<PrivateRoute element={<Expense />} />}
        />
        <Route
          path="/invoice"
          element={<PrivateRoute element={<Invoice />} />}
        />
        <Route
          path="/addinvoice"
          element={<PrivateRoute element={<AddInvoice />} />}
        />
        <Route path="/sales" element={<PrivateRoute element={<Sales />} />} />
        <Route path="/audit" element={<PrivateRoute element={<Audit />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
