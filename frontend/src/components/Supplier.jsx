import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  TextField,
  MenuItem,
  Pagination,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Delete, Add } from "@mui/icons-material";
import { styled } from "@mui/system";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
import AddSupplier from "./dialogbox/addsupplier";
import axiosInstance from "../helper/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GradientBackground = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  background: "linear-gradient(to right, #c4d3c8, #a8beae, #b1c5b7)",
  minHeight: "100vh",
  marginTop: "64px",
}));

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.post("/supplier/getall", {});
        setSuppliers(response.data.suppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async (supplierId) => {
    try {
      await axiosInstance.post("/supplier/delete", { id: supplierId });
      const response = await axiosInstance.post("/supplier/getall", {});
      setSuppliers(response.data.suppliers);
      toast.success("Supplier Deleted Successfully", { autoClose: 2000 });
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleAddSupplier = async (supplier) => {
    try {
      await axiosInstance.post("/supplier/add", supplier);
      const response = await axiosInstance.post("/supplier/getall", {});
      setSuppliers(response.data.suppliers);
      setShowAddSupplier(false);
      toast.success("Supplier Added Successfully", { autoClose: 2000 });
    } catch (error) {
      toast.error("Error Adding Supplier", { autoClose: 2000 });
      console.error("Error adding supplier:", error);
    }
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const filterAndSortSuppliers = () => {
    let filtered = suppliers.filter((supplier) =>
      [supplier.name, supplier.contact].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (sortOption) {
      filtered.sort((a, b) => {
        let valueA = a[sortOption];
        let valueB = b[sortOption];

        if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
        if (sortOrder === "desc") return valueA < valueB ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const paginatedSuppliers = filterAndSortSuppliers().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Navbar />
      <GradientBackground>
        <Box sx={{ flex: "0 0 250px" }}>
          <SideBar />
        </Box>
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={8} md={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <TextField
                  label="Search by Name or Phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  sx={{
                    backgroundColor: "#e9efeb",
                    width: "35%",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#030403",
                    },
                  }}
                />
                <TextField
                  select
                  label="Sort By"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  sx={{
                    backgroundColor: "#e9efeb",
                    width: "30%",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#030403",
                    },
                  }}
                >
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="previousCreditBalance">
                    Credit Balance
                  </MenuItem>
                </TextField>
                <Box sx={{ cursor: "pointer" }} onClick={toggleSortOrder}>
                  {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowAddSupplier(true)}
                >
                  Add Supplier
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, borderRadius: "12px" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Suppliers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Sr. No</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Contact</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Address</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Credit Balance</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSuppliers.map((supplier, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          supplier.previousCreditBalance < 0
                            ? "#f8d7da"
                            : "inherit",
                      }}
                      hover
                    >
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                      <TableCell>{supplier.previousCreditBalance}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedSuppliers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No suppliers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(filterAndSortSuppliers().length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
          </Paper>
        </Box>
      </GradientBackground>
      <AddSupplier
        isOpen={showAddSupplier}
        onClose={() => setShowAddSupplier(false)}
        onAdd={handleAddSupplier}
      />
      <ToastContainer />
    </>
  );
};

export default Supplier;
