import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
} from "@mui/material";

const AddCategory = ({ isOpen, onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      onAdd(categoryName);
      setCategoryName("");
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "400px" },
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Add New Category
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            variant="outlined"
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              sx={{ px: 4 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
              sx={{ px: 4 }}
              disabled={!categoryName.trim()}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCategory;
