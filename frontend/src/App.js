import React from 'react'
import {BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import Login from './components/Login';
import Signup from './components/SignUp';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Category from './components/Category';
import TaxSlab from './components/TaxSlab';
import Supplier from './components/Supplier';
import Expense from './components/expense';
import Invoice from './components/Invoice';
import AddInvoice from './components/dialogbox/addinvoice';
import Sales from './components/Sales';
import Audit from './components/Audit';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route
          path="/"
          element={<Navigate to="/dashboard" />}
        />
        <Route exact path='/login' element={<Login/>} ></Route>
        <Route exact path='/signup' element={<Signup/>} ></Route>
        <Route exact path='/dashboard' element={<Dashboard/>} ></Route>
        <Route exact path='/inventory' element={<Inventory/>} ></Route>
        <Route exact path='/category' element={<Category/>} ></Route>
        <Route exact path='/tax' element={<TaxSlab/>} ></Route>
        <Route exact path='/supplier' element={<Supplier/>} ></Route>
        <Route exact path='/expense' element={<Expense/>} ></Route>
        <Route exact path='/invoice' element={<Invoice/>} ></Route>
        <Route exact path='/addinvoice' element={<AddInvoice/>} ></Route>
        <Route exact path='/sales' element={<Sales/>} ></Route>
        <Route exact path='/audit' element={<Audit/>} ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
