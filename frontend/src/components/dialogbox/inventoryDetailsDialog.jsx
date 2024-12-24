import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const InventoryDetailsDialog = ({ open, onClose, details }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Item Details</DialogTitle>
      <DialogContent>
        {details ? (
          <>
            <DialogContentText>
              <strong>Model:</strong> {details.model}
            </DialogContentText>
            <DialogContentText>
              <strong>Serial Number:</strong> {details.serialNumber}
            </DialogContentText>
            <DialogContentText>
              <strong>Quantity:</strong>{" "}
              {details.quantity > 0 ? details.quantity : "Out of Stock"}
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