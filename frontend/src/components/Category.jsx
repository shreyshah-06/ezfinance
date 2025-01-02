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
  Pagination,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { styled } from "@mui/system";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
import AddCategory from "./dialogbox/addcategory";
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

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.post("/category/getall", {});
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    try {
      await axiosInstance.post("/category/delete", { id: categoryId });
      const response = await axiosInstance.post("/category/getall", {});
      setCategories(response.data.categories);
      toast.success("Category Deleted Successfully", { autoClose: 2000 });
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddCategory = async (categoryName) => {
    try {
      await axiosInstance.post("/category/add", { name: categoryName });
      const response = await axiosInstance.post("/category/getall", {});
      setCategories(response.data.categories);
      setShowAddCategory(false);
      toast.success("Category Added Successfully", { autoClose: 2000 });
    } catch (error) {
      toast.error("Error Adding Category", { autoClose: 2000 });
      console.error("Error adding category:", error);
    }
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const filterCategories = () => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const paginatedCategories = filterCategories().slice(
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
            <Grid item xs={12} sm={8} md={8}>
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
                    fullWidth
                  label="Search by Category Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  sx={{
                    backgroundColor: "#e9efeb",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#030403",
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <Box
                sx={{
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowAddCategory(true)}
                  sx={{
                    borderRadius: "12px",
                    height: "58px",
                    width: "68%",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Add Category
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, borderRadius: "12px" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Categories
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Sr. No</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Category Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCategories.map((category, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedCategories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No categories found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(filterCategories().length / itemsPerPage)}
              page={currentPage}
              color="primary"
              onChange={handlePageChange}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
          </Paper>
        </Box>
      </GradientBackground>
      <AddCategory
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onAdd={handleAddCategory}
      />
      <ToastContainer />
    </>
  );
};

export default Category;
