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
  IconButton,
  Grid,
  TextField,
  MenuItem,
  Pagination,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { styled } from "@mui/system";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
import axiosInstance from "../helper/axios";

const GradientBackground = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  background: "linear-gradient(to right, #c4d3c8, #a8beae, #b1c5b7)",
  minHeight: "100vh",
  marginTop: "64px",
}));

const TotalAmountBox = styled(Box)(({ theme }) => ({
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
}));

const Audit = () => {
  const [auditData, setAuditData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [filteredAuditData, setFilteredAuditData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await axiosInstance.get("/audit/getall", {});
        setAuditData(response.data.auditData);
        setFilteredAuditData(response.data.auditData);
        setTotalExpenses(response.data.totalExpenses);
        setTotalInvoices(response.data.totalInvoices);
      } catch (error) {
        console.error("Error fetching audit data:", error);
      }
    };
    fetchAuditData();
  }, []);

  const filterAndSortAudit = () => {
    let filtered = auditData.filter((audit) => {
      if (sortOption === "Invoice") {
        return audit.type === "Invoice";
      } else if (sortOption === "Expense") {
        return audit.type === "Expense";
      }
      return true;
    });

    if (sortOption) {
      filtered.sort((a, b) => {
        let valueA = a[sortOption];
        let valueB = b[sortOption];

        if (sortOption === "date") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
        if (sortOrder === "desc") return valueA < valueB ? 1 : -1;
        return 0;
      });
    }

    setFilteredAuditData(filtered);
  };

  useEffect(() => {
    filterAndSortAudit();
  }, [sortOption, sortOrder, auditData]);

  const paginatedAuditData = filteredAuditData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => setCurrentPage(value);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <>
      <Navbar />
      <GradientBackground>
        <Box sx={{ flex: "0 0 250px" }}>
          <SideBar />
        </Box>
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* Top Row */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={8} md={4}>
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
                  select
                  fullWidth
                  label="Sort By"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  sx={{
                    backgroundColor: "#e9efeb",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#030403",
                    },
                  }}
                >
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="Invoice">Invoice</MenuItem>
                  <MenuItem value="Expense">Expense</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                </TextField>
                <Box sx={{ cursor: "pointer" }} onClick={toggleSortOrder}>
                  {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <TotalAmountBox>
                <IconWrapper>
                  <Typography sx={{ fontSize: "20px" }}>₹</Typography>
                </IconWrapper>
                <Typography>Total Expenses:</Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FF6F61",
                    fontWeight: "bold",
                  }}
                >
                  ₹{totalExpenses.toFixed(2)}
                </Typography>
              </TotalAmountBox>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <TotalAmountBox>
                <IconWrapper>
                  <Typography sx={{ fontSize: "20px" }}>₹</Typography>
                </IconWrapper>
                <Typography>Total Invoices</Typography>
                <Typography
                  color="#4CAF50"
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                >
                  ₹{totalInvoices.toFixed(2)}
                </Typography>
              </TotalAmountBox>
            </Grid>
          </Grid>

          {/* Table Section */}
          <Paper
            sx={{
              p: 3,
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Logs
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Sr. No</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAuditData.map((audit, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{audit.type}</TableCell>
                      <TableCell>
                        {new Date(audit.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            audit.type === "Expense" ? "#e74c3c" : "#2ecc71",
                        }}
                      >
                        ₹{audit.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAuditData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No audit records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(filteredAuditData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
          </Paper>
        </Box>
      </GradientBackground>
    </>
  );
};

export default Audit;
