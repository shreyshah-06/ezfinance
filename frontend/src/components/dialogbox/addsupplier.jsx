import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';

const AddSupplier = ({ isOpen, onClose, onAdd }) => {
  const [supplierData, setSupplierData] = useState({
    name: '',
    contact: '',
    address: '',
    details: '',
    previousCreditBalance: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSupplier = () => {
    onAdd(supplierData);
    setSupplierData({
      name: '',
      contact: '',
      address: '',
      details: '',
      previousCreditBalance: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Add New Supplier
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ mt: 1 }}
        >
          <TextField
            label="Name"
            name="name"
            value={supplierData.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Contact"
            name="contact"
            value={supplierData.contact}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Address"
            name="address"
            value={supplierData.address}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Details"
            name="details"
            value={supplierData.details}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Previous Credit Balance"
            name="previousCreditBalance"
            type="number"
            value={supplierData.previousCreditBalance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddSupplier}
          variant="contained"
          color="primary"
          sx={{ textTransform: 'none' }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSupplier;
