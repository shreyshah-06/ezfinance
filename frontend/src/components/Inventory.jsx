import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  IconButton,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { styled } from "@mui/system";
import axiosInstance from "../helper/axios";
import InventoryDetailsDialog from "./dialogbox/inventoryDetailsDialog";

const GradientBackground = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  background: "linear-gradient(to right, #c4d3c8, #a8beae, #b1c5b7)",
  minHeight: "100vh",
  marginTop: "64px",
}));

const InventoryContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: "#ffffff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
}));

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    serialNumber: "",
    model: "",
    categoryId: "",
    sellingPrice: "",
    taxId: "",
    supplierId: "",
    purchasePrice: "",
    quantity: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axiosInstance.get("/product/getAll", {});
        setInventory(response.data.products);
        setFilteredInventory(response.data.products);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);

  // const filterAndSortInventory = () => {
  //   let filtered = inventory.filter((item) => {
  //     const matchesSearch =
  //       item.model.toLowerCase().includes(filter.toLowerCase()) ||
  //       item.serialNumber.toLowerCase().includes(filter.toLowerCase());
  //     const matchesStock = showOutOfStock || item.quantity > 0;
  //     return matchesSearch && matchesStock;
  //   });

  //   if (sortBy) {
  //     filtered.sort((a, b) => {
  //       let valueA = a[sortBy];
  //       let valueB = b[sortBy];

  //       // Convert values to lowercase for string comparison
  //       if (typeof valueA === "string") valueA = valueA.toLowerCase();
  //       if (typeof valueB === "string") valueB = valueB.toLowerCase();

  //       if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
  //       if (sortOrder === "desc") return valueA < valueB ? 1 : -1;
  //       return 0;
  //     });
  //   }

  //   setFilteredInventory(filtered);
  // };

  useEffect(() => {
    let filtered = inventory.filter((item) => {
      const matchesSearch =
        item.model.toLowerCase().includes(filter.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(filter.toLowerCase());
      const matchesStock = showOutOfStock || item.quantity > 0;
      return matchesSearch && matchesStock;
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();

        if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
        if (sortOrder === "desc") return valueA < valueB ? 1 : -1;
        return 0;
      });
    }

    setFilteredInventory(filtered);
  }, [filter, showOutOfStock, sortBy, sortOrder, inventory]);

  const handleFilterChange = (event) => setFilter(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);
  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  const handleStockToggle = (event) => setShowOutOfStock(event.target.checked);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/product/delete/${itemToDelete.id}`);
      setInventory(inventory.filter((item) => item.id !== itemToDelete.id));
      setOpenDialog(false);
      setItemToDelete(null);
      setToast({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setToast({
        open: true,
        message: "Error deleting item",
        severity: "error",
      });
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setItemToDelete(null);
  };

  const handleDetailsClick = (item) => {
    setItemDetails(item);
    setOpenDetailsDialog(true);
  };

  const closeDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setItemDetails(null);
  };

  const exportData = () => {
    const csvContent = [
      ["Sr. No", "Model", "Serial Number", "Quantity Left"],
      ...filteredInventory.map((item, index) => [
        index + 1,
        item.model,
        item.serialNumber,
        item.quantity,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory.csv";
    link.click();
  };

  const handleAddProductClick = () => {
    setOpenAddDialog(true);
  };

  const handleAddProductClose = () => {
    setOpenAddDialog(false);
    setNewProduct({
      serialNumber: "",
      model: "",
      categoryId: "",
      sellingPrice: "",
      taxId: "",
      supplierId: "",
      purchasePrice: "",
      quantity: "",
    });
  };

  const handleAddProductSubmit = async () => {
    try {
      await axiosInstance.post("/api/product/add", newProduct);
      setInventory([...inventory, newProduct]);
      setOpenAddDialog(false);
      setToast({
        open: true,
        message: "Product added successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setToast({
        open: true,
        message: "Error adding product",
        severity: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <GradientBackground>
        {/* Sidebar */}
        <Box sx={{ flex: "0 0 250px" }}>
          <SideBar />
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* Filters */}
          <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <TextField
              label="Search by Model or Serial Number"
              variant="outlined"
              value={filter}
              onChange={handleFilterChange}
              sx={{
                flex: 2,
                "& .MuiInputBase-root": {
                  backgroundColor: "#e9efeb",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#030403",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  top: "-6px",
                },
              }}
            />
            <Select
              value={sortBy}
              onChange={handleSortChange}
              displayEmpty
              variant="outlined"
              sx={{
                flex: 1,
                backgroundColor: "#e9efeb",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#030403",
                },
              }}
            >
              <MenuItem value="">Sort By</MenuItem>
              <MenuItem value="model">Model</MenuItem>
              <MenuItem value="quantity">Quantity</MenuItem>
              <MenuItem value="serialNumber">Serial Number</MenuItem>
            </Select>
            <IconButton onClick={toggleSortOrder} sx={{ color: "#030403" }}>
              {sortOrder === "asc" ? (
                <ArrowUpwardIcon sx={{ color: "#030403" }} />
              ) : (
                <ArrowDownwardIcon sx={{ color: "#030403" }} />
              )}
            </IconButton>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOutOfStock}
                  onChange={handleStockToggle}
                  color="primary"
                />
              }
              label="Show Out-of-Stock Items"
            />
            <Button
              variant="outlined"
              onClick={exportData}
              startIcon={<FileDownloadIcon />}
              sx={{
                color: "#5F7E62",
                borderColor: "#5F7E62",
                backgroundColor: "#f0f8f4",
                "&:hover": {
                  backgroundColor: "#e0f2e0",
                  borderColor: "#4a6f48",
                },
                padding: "6px 10px",
                borderRadius: "6px",
              }}
            >
              Export Data
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProductClick}
              sx={{ padding: "6px 10px", borderRadius: "6px" }}
            >
              Add Product
            </Button>
          </Box>

          <InventoryContainer>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Inventory List
            </Typography>
            <Table>
              <TableHead sx={{ position: "sticky" }}>
                <TableRow>
                  <TableCell>
                    <strong>Sr. No</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Model</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Serial Number</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Quantity Left</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInventory.length > 0 ? (
                  paginatedInventory.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        backgroundColor:
                          item.quantity === 0 ? "#f8d7da" : "inherit",
                      }}
                      hover
                    >
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.serialNumber}</TableCell>
                      <TableCell>
                        {item.quantity > 0 ? item.quantity : "Out of Stock"}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleDetailsClick(item)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(item)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No inventory data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredInventory.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </InventoryContainer>
        </Box>
      </GradientBackground>

      {/* Add Product Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddProductClose} fullWidth>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Serial Number"
            type="text"
            fullWidth
            name="serialNumber"
            value={newProduct.serialNumber}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Model"
            type="text"
            fullWidth
            name="model"
            value={newProduct.model}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Category ID"
            type="text"
            fullWidth
            name="categoryId"
            value={newProduct.categoryId}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Selling Price"
            type="number"
            fullWidth
            name="sellingPrice"
            value={newProduct.sellingPrice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Tax ID"
            type="text"
            fullWidth
            name="taxId"
            value={newProduct.taxId}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Supplier ID"
            type="text"
            fullWidth
            name="supplierId"
            value={newProduct.supplierId}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Purchase Price"
            type="number"
            fullWidth
            name="purchasePrice"
            value={newProduct.purchasePrice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            name="quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddProductClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddProductSubmit} color="success">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Details Dialog */}
      {itemDetails && (
        <InventoryDetailsDialog
          open={openDetailsDialog}
          onClose={closeDetailsDialog}
          itemDetails={itemDetails}
        />
      )}

      {/* Snackbar for Toast Messages */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Inventory;
