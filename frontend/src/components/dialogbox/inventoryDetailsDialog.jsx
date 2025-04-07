import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const InventoryDetailsDialog = ({ open, onClose, itemDetails}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Item Details</DialogTitle>
      <DialogContent>
        {itemDetails ? (
          <>
            <DialogContentText>
              <strong>Model:</strong> {itemDetails.model}
            </DialogContentText>
            <DialogContentText>
              <strong>Serial Number:</strong> {itemDetails.serialNumber}
            </DialogContentText>
            <DialogContentText>
              <strong>Quantity:</strong>{" "}
              {itemDetails.quantity > 0 ? itemDetails.quantity : "Out of Stock"}
            </DialogContentText>
          </>
        ) : (
          <DialogContentText>No details available.</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDetailsDialog;