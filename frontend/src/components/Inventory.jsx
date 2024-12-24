import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: "#5F7E62",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#3E5641",
  },
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

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axiosInstance.post("/product/getAll", {});
        setInventory(response.data.products);
        setFilteredInventory(response.data.products);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);
  const filterAndSortInventory = () => {
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

        // Convert values to lowercase for string comparison
        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();

        if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
        if (sortOrder === "desc") return valueA < valueB ? 1 : -1;
        return 0;
      });
    }

    setFilteredInventory(filtered);
  };

  useEffect(() => {
    filterAndSortInventory();
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
    } catch (error) {
      console.error("Error deleting item:", error);
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
                {/* {filteredInventory.length > 0 ? (
                  filteredInventory.map((item, index) => (
                    <TableRow key={index} hover> */}
                {/* <TableCell>{index + 1}</TableCell> */}
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

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the item "{itemToDelete?.model}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <InventoryDetailsDialog
        open={openDetailsDialog}
        onClose={closeDetailsDialog}
        details={itemDetails}
      />
    </>
  );
};

export default Inventory;
