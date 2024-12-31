import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Grid,
  Pagination,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import {
  Add,
  Delete,
  AttachMoney,
  AccountBalance,
  Visibility,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../helper/axios";
import InvoiceDetails from "../components/dialogbox/invoiceDetails";

const GradientBackground = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  background: "linear-gradient(to right, #c4d3c8, #a8beae, #b1c5b7)",
  minHeight: "100vh",
  marginTop: "64px",
}));

const InvoiceContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: "#ffffff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
}));

const InfoBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "12px",
  background: "#ffffff",
  height: "80px",
  width: "100%",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f0f0f0",
  borderRadius: "50%",
  height: "40px",
  width: "40px",
  marginRight: theme.spacing(2),
}));

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [totalInvoiceAmt, setTotalInvoiceAmt] = useState(0);
  const [totalTaxAmt, setTotalTaxAmt] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filteredInvoice, setFilteredInvoice] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [specificDate, setSpecificDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.post("/invoice/getall", {});
        setInvoices(response.data.invoices);
        setFilteredInvoice(response.data.invoices);
        setTotalInvoiceAmt(response.data.totalInvoiceAmt);
        setTotalTaxAmt(
          response.data.invoices.reduce(
            (totalTax, invoice) => totalTax + invoice.totalTax,
            0
          )
        );
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  const handleAddInvoice = () => navigate("/addinvoice");

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await axiosInstance.post("/invoice/delete", { id: invoiceId });
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
      toast.success("Invoice Deleted Successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };

  const handleFileTax = () => {
    toast.success("Tax Filed Successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const filterAndSortInvoices = () => {
    let filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.customerName
          .toLowerCase()
          .includes(String(filter).toLowerCase()) ||
        String(invoice.invoiceNumber)
          .toLowerCase()
          .includes(String(filter).toLowerCase());

      const matchesDate =
        !specificDate ||
        new Date(invoice.date).toDateString() ===
          new Date(specificDate).toDateString();

      return matchesSearch && matchesDate;
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (sortBy === "date") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        if (sortBy === "totalAmount" || sortBy === "taxAmount") {
          valueA = parseFloat(valueA) || 0;
          valueB = parseFloat(valueB) || 0;
        }

        if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
        if (sortOrder === "desc") return valueA < valueB ? 1 : -1;
        return 0;
      });
    }

    setFilteredInvoice(filtered);
  };

  useEffect(() => {
    filterAndSortInvoices();
  }, [filter, specificDate, sortBy, sortOrder, invoices]);

  // Handlers
  const handleFilterChange = (event) => setFilter(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);
  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  const handleSpecificDateChange = (event) =>
    setSpecificDate(event.target.value);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setViewOpen(true);
  };

  const closeViewDetails = () => {
    setSelectedInvoice(null);
    setViewOpen(false);
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const paginatedInvoices = filteredInvoice.slice(
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
            {/* Top Row: Invoice Amount and Tax Due */}
            <Grid item xs={12} sm={6} md={4}>
              <InfoBox>
                <IconWrapper>
                  <AttachMoney fontSize="medium" />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Invoice Amount
                  </Typography>
                  <Typography variant="h6" color="green">
                    ₹{totalInvoiceAmt.toFixed(2)}
                  </Typography>
                </Box>
              </InfoBox>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoBox>
                <IconWrapper>
                  <AccountBalance fontSize="medium" />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Tax Due
                  </Typography>
                  <Typography variant="h6" color="red">
                    ₹{totalTaxAmt.toFixed(2)}
                  </Typography>
                </Box>
              </InfoBox>
            </Grid>
            {/* Action Buttons */}
            <Grid item xs={12} sm={6} md={4}>
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
                  color="secondary"
                  onClick={handleFileTax}
                  sx={{
                    borderRadius: "12px",
                    height: "48px",
                    width: "48%",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  File Tax
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddInvoice}
                  sx={{
                    borderRadius: "12px",
                    height: "48px",
                    width: "48%",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Add Invoice
                </Button>
              </Box>
            </Grid>

            {/* Filter and Sorting Row */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                  padding: "16px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Search Field */}
                <TextField
                  label="Search by Customer Name or Invoice Number"
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

                {/* Sort By Dropdown */}
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
                  <MenuItem value="totalAmount">Total Amount</MenuItem>
                  <MenuItem value="taxAmount">Tax Amount</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </Select>

                {/* Sort Order Toggle */}
                <IconButton onClick={toggleSortOrder} sx={{ color: "#030403" }}>
                  {sortOrder === "asc" ? (
                    <ArrowUpwardIcon sx={{ color: "#030403" }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ color: "#030403" }} />
                  )}
                </IconButton>

                {/* Date Filter */}
                <TextField
                  type="date"
                  value={specificDate}
                  onChange={handleSpecificDateChange}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    "& .MuiInputBase-root": {
                      backgroundColor: "#e9efeb",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#030403",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <InvoiceContainer>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Invoices
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Invoice Number</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Customer Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tax Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Total Amount</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedInvoices.length > 0 ? (
                    paginatedInvoices.map((invoice) => (
                      <TableRow key={invoice.id} hover>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell>{invoice.date.split("T")[0]}</TableCell>
                        <TableCell>
                          ₹{(invoice.totalAmount - invoice.totalTax).toFixed(2)}
                        </TableCell>
                        <TableCell>₹{invoice.totalTax.toFixed(2)}</TableCell>
                        <TableCell>₹{invoice.totalAmount.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleViewDetails(invoice)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={Math.ceil(filteredInvoice.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </TableContainer>
          </InvoiceContainer>
        </Box>
      </GradientBackground>
      <InvoiceDetails
        open={viewOpen}
        onClose={closeViewDetails}
        invoice={selectedInvoice}
      />
      <ToastContainer />
    </>
  );
};

export default Invoice;
