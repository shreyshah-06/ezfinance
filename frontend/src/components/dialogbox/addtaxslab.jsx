import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

const AddTaxSlabDialog = ({ open, onClose, onAdd }) => {
  const [taxSlab, setTaxSlab] = useState({ name: "", rate: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaxSlab((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!taxSlab.name || !taxSlab.rate) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    onAdd(taxSlab);
    setTaxSlab({ name: "", rate: "" });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Tax Slab</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Tax Name"
            name="name"
            value={taxSlab.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Tax Rate (%)"
            name="rate"
            value={taxSlab.rate}
            onChange={handleChange}
            type="number"
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaxSlabDialog;
