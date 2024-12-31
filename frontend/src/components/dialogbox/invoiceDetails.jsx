import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axiosInstance from "../../helper/axios";

const InvoiceDetails = ({ open, onClose, invoice }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && invoice) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axiosInstance.get(`/invoice/${invoice.invoiceNumber}/items`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProducts(response.data.sales);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [open, invoice]);

  const handleDownload = () => {
    if (invoice) {
      const doc = new jsPDF();
  
      doc.setFontSize(16);
      doc.text("Invoice Summary", 10, 10);
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 10, 20);
      doc.text(`Date: ${invoice.date.split("T")[0]}`, 10, 30);
      doc.text(`Customer Name: ${invoice.customerName}`, 10, 40);
  
      const tableData = products.map((product, index) => {
        const taxAmount = (product.price * product.quantity * product.Product.Tax.rate) / 100;
        return [
          index + 1,
          product.Product.model,
          product.quantity,
          `₹${product.price.toFixed(2)}`,
          `₹${taxAmount.toFixed(2)}`,
          `₹${product.total.toFixed(2)}`,
        ];
      });
  
      doc.autoTable({
        startY: 50,
        head: [["#", "Product", "Quantity", "Price", "Tax Amount", "Total"]],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 10,
        },
      });
  
      const finalY = doc.previousAutoTable.finalY || 60;
  
      doc.text(`Subtotal: ₹${(invoice.totalAmount - invoice.totalTax).toFixed(2)}`, 10, finalY + 10);
      doc.text(`Tax: ₹${invoice.totalTax.toFixed(2)}`, 10, finalY + 20);
      doc.text(`Total: ₹${invoice.totalAmount.toFixed(2)}`, 10, finalY + 30);
  
      doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <IconButton onClick={onClose} sx={{ marginLeft: "auto"}}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
                Invoice Summary
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Invoice Number:</strong> {invoice.invoiceNumber}
              </Typography>
              <Typography>
                <strong>Date:</strong> {invoice.date.split("T")[0]}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Customer Name:</strong> {invoice.customerName}
              </Typography>
              <Typography>
                <strong>Total Amount:</strong> ₹{invoice.totalAmount.toFixed(2)}
              </Typography>
              <Typography>
                <strong>Total Tax:</strong> ₹{invoice.totalTax.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Products
            </Typography>
            {loading ? (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <CircularProgress />
              </Box>
            ) : products.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>#</strong></TableCell>
                      <TableCell><strong>Product</strong></TableCell>
                      <TableCell><strong>Quantity</strong></TableCell>
                      <TableCell><strong>Price</strong></TableCell>
                      <TableCell><strong>Tax Amount</strong></TableCell>
                      <TableCell><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product, index) => {
                      const taxAmount = (product.price * product.quantity * product.Product.Tax.rate) / 100;
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{product.Product.model}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>₹{product.price.toFixed(2)}</TableCell>
                          <TableCell>₹{taxAmount.toFixed(2)}</TableCell>
                          <TableCell>₹{product.total.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No products found for this invoice.</Typography>
            )}
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Download Invoice
            </Button>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetails;
