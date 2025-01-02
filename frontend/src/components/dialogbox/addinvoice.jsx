import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helper/axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  IconButton,
  Box,
  Paper
} from '@mui/material';
import { Delete } from '@mui/icons-material';

function AddInvoice() {
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [products, setProducts] = useState([
    { productId: '', productName: '', quantity: 0, discountPercentage: 0, tax: 0, total: 0 }
  ]);
  const [inventory, setInventory] = useState([]);
  const [taxRates, setTaxRates] = useState([]);

  const calculateTotal = (quantity, price, taxRate, discount) => {
    const totalBeforeTax = quantity * price;
    const discountAmount = (totalBeforeTax * discount) / 100;
    const totalWithDiscount = totalBeforeTax - discountAmount;
    const taxAmount = (totalWithDiscount * taxRate) / 100;
    return totalWithDiscount + taxAmount;
  };
  

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axiosInstance.post("/product/getAll", {});
        setInventory(response.data.products);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    const fetchTaxSlabs = async () => {
      try {
        const response = await axiosInstance.post("/tax/getall", {});
        setTaxRates(response.data.taxSlabs);
      } catch (error) {
        console.error("Error fetching tax slabs:", error);
      }
    };

    fetchInventory();
    fetchTaxSlabs();
  }, []);

  const handleProductNameChange = (index, value) => {
    const product = inventory.find(item => item.model === value);
    if (product) {
      const taxRateObj = taxRates.find(rate => rate.id === product.taxId);
      const taxRate = taxRateObj ? taxRateObj.rate : 0;
      const newProducts = [...products];
      newProducts[index] = {
        ...newProducts[index],
        productId: product.id,
        productName: value,
        price: product.sellingPrice,
        tax: taxRate,
        total: calculateTotal(
          newProducts[index].quantity,
          product.sellingPrice,
          taxRate,
          newProducts[index].discountPercentage
        ),
      };
      setProducts(newProducts);
    }
  };
  
  const handleQuantityChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].quantity = parseInt(value) || 0;
    newProducts[index].total = calculateTotal(
      newProducts[index].quantity,
      newProducts[index].price,
      newProducts[index].tax,
      newProducts[index].discountPercentage
    );
    setProducts(newProducts);
  };

  const handleDiscountChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].discountPercentage = parseFloat(value) || 0;
    newProducts[index].total = calculateTotal(
      newProducts[index].quantity,
      newProducts[index].price,
      newProducts[index].tax,
      newProducts[index].discountPercentage
    );
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { productId: '', productName: '', quantity: 0, discountPercentage: 0, tax: 0, total: 0 }
    ]);
  };

  const deleteProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const invoiceData = {
        customerName,
        date,
        products: products.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
          discountPercentage: product.discountPercentage,
          taxPercentage: product.tax
        }))
      };
      const response = await axiosInstance.post('/invoice/add', invoiceData);
      navigate('/invoice');
      console.log('Invoice saved successfully:', response.data);
    } catch (error) {
      toast.error('Error Adding Invoice', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error saving invoice:', error);
    }
  };

  const billAmount = products.reduce((acc, product) => acc + product.total, 0);

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to right, #c4d3c8, #a8beae, #b1c5b7)', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: '1200px' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
          Add Invoice
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              fullWidth
              sx={{ mr: 2 }}
            />
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Discount (%)</TableCell>
                <TableCell>Tax Rate (%)</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      value={product.productName}
                      onChange={(e) => handleProductNameChange(index, e.target.value)}
                      fullWidth
                      required
                    >
                      <MenuItem value="">Select Product</MenuItem>
                      {inventory.map(item => (
                        <MenuItem key={item.id} value={item.model}>{item.model}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField value={product.price} InputProps={{ readOnly: true }} fullWidth />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={product.discountPercentage}
                      onChange={(e) => handleDiscountChange(index, e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField value={product.tax} InputProps={{ readOnly: true }} fullWidth />
                  </TableCell>
                  <TableCell>
                    <TextField value={product.total} InputProps={{ readOnly: true }} fullWidth />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => deleteProduct(index)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color="primary" onClick={addProduct}>
              Add Product
            </Button>
            <Typography variant="h6">
              Bill Amount: ₹{billAmount.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" color="success">
              Save Invoice
            </Button>
          </Box>
        </form>
      </Paper>
      <ToastContainer />
    </Box>
  );
}

export default AddInvoice;
