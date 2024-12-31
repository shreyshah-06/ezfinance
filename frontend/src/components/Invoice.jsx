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
  Pagination
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.post("/invoice/getall", {});
        setInvoices(response.data.invoices);
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

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setViewOpen(true);
  };

  const closeViewDetails = () => {
    setSelectedInvoice(null);
    setViewOpen(false);
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const paginatedInvoices = invoices.slice(
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
            {/* Data Display Boxes: Invoice Amount and Tax Due in a single row */}
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
            {/* Buttons: Add Invoice and File Tax */}
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
                  count={Math.ceil(invoices.length / itemsPerPage)}
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
