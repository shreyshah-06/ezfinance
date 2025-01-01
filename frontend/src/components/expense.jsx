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
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { Add, Delete, AttachMoney } from "@mui/icons-material";
import { styled } from "@mui/system";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
import AddExpense from "./dialogbox/addexpense";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../helper/axios";

const GradientBackground = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  background: "linear-gradient(to right, #c4d3c8, #a8beae, #b1c5b7)",
  minHeight: "100vh",
  marginTop: "64px",
}));

const DataContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: "#ffffff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
}));

const TotalAmountBox = styled(Box)(({ theme }) => ({
  display: "flex",
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

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [specificDate, setSpecificDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("date");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.post("/expense/getall", {});
        setExpenses(response.data.expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to fetch expenses.");
      }
    };
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axiosInstance.post("/expense/delete", { id: expenseId });
      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      await axiosInstance.post("/expense/add", expense);
      const response = await axiosInstance.post("/expense/getall", {});
      setExpenses(response.data.expenses);
      setShowAddExpense(false);
      toast.success("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.");
    }
  };

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        expense.vendorName.toLowerCase().includes(searchText.toLowerCase()) ||
        expense.expenseName.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((expense) =>
      specificDate ? expense.date.split("T")[0] === specificDate : true
    )
    .sort((a, b) => {
      if (sortOption === "amount") {
        return b.totalAmount - a.totalAmount;
      } else if (sortOption === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.totalAmount),
    0
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
            {/* Filters Section */}
            <Grid item xs={12} sm={8} md={9}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <TextField
                  label="Search Expenses"
                  variant="outlined"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by vendor or name"
                  sx={{ flex: 2, backgroundColor: "#e9efeb" }}
                />
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  displayEmpty
                  sx={{ flex: 1, backgroundColor: "#e9efeb" }}
                >
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="amount">Total Expense</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </Select>

                <TextField
                  type="date"
                  label="Select Date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  sx={{ width: "25%", backgroundColor: "#fff" }}
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowAddExpense(true)}
                >
                  Add Expense
                </Button>
              </Box>
            </Grid>

            {/* Total Expense Section */}
            <Grid item xs={12} sm={4} md={3}>
              <TotalAmountBox>
                <IconWrapper>
                  <AttachMoney fontSize="medium" />
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Expenses
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4CAF50",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{totalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </TotalAmountBox>
            </Grid>
          </Grid>

          <AddExpense
            isOpen={showAddExpense}
            onClose={() => setShowAddExpense(false)}
            onAdd={handleAddExpense}
          />
          <DataContainer>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Expenses
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Sr. No</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Vendor Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Expense Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExpenses.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{expense.vendorName}</TableCell>
                      <TableCell>{expense.expenseName}</TableCell>
                      <TableCell>
                        {expense.date
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}
                      </TableCell>
                      <TableCell>₹{expense.totalAmount.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredExpenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No expenses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DataContainer>
        </Box>
      </GradientBackground>
      <ToastContainer />
    </>
  );
};

export default Expense;
