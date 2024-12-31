import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Pagination
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { styled } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
import AddTaxSlabDialog from "./dialogbox/addtaxslab";
import axiosInstance from "../helper/axios";

const GradientBackground = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  background: "linear-gradient(to right, #c4d3c8, #a8beae, #b1c5b7)",
  minHeight: "100vh",
  marginTop: "64px",
}));

const TaxContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: "#ffffff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
}));

const TaxSlab = () => {
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [showAddTaxSlab, setShowAddTaxSlab] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  useEffect(() => {
    const fetchTaxSlabs = async () => {
      try {
        const response = await axiosInstance.post("/tax/getall", {});
        setTaxSlabs(response.data.taxSlabs);
      } catch (error) {
        console.error("Error fetching tax slabs:", error);
      }
    };
    fetchTaxSlabs();
  }, []);

  const handleDelete = async (taxSlabId) => {
    try {
      await axiosInstance.post("/tax/delete", { id: taxSlabId });
      setTaxSlabs((prev) => prev.filter((slab) => slab.id !== taxSlabId));
      toast.success("Tax Slab Deleted Successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting tax slab:", error);
      toast.error("Failed to delete Tax Slab.");
    }
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const paginatedtaxSlabs = taxSlabs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleAddTaxSlab = async (taxSlab) => {
    try {
      await axiosInstance.post("/tax/add", taxSlab);
      const response = await axiosInstance.post("/tax/getall", {});
      setTaxSlabs(response.data.taxSlabs);
      setShowAddTaxSlab(false);
      toast.success("Tax Slab Added Successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error adding tax slab:", error);
      toast.error("Failed to add tax slab", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <GradientBackground>
        <Box sx={{ flex: "0 0 250px" }}>
          <SideBar />
        </Box>
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddTaxSlab(true)}
              sx={{ mb: 2 }}
            >
              Add Tax Slab
            </Button>
          </Box>
          <TaxContainer>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Tax Slabs
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Sr. No</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Rate (%)</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedtaxSlabs.length > 0 ? (
                  paginatedtaxSlabs.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell> {(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil(taxSlabs.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </TaxContainer>
        </Box>
      </GradientBackground>
      <AddTaxSlabDialog
        open={showAddTaxSlab}
        onClose={() => setShowAddTaxSlab(false)}
        onAdd={handleAddTaxSlab}
      />
      <ToastContainer />
    </>
  );
};

export default TaxSlab;
