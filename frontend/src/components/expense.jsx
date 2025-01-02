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
  Pagination,
} from "@mui/material";
import { Add, Delete, AttachMoney, ArrowUpward, ArrowDownward } from "@mui/icons-material";
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
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [specificDate, setSpecificDate] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axiosInstance.post("/expense/getall", {});
        setExpenses(response.data.expenses);
        setFilteredExpenses(response.data.expenses); // Initialize filteredExpenses
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (expenseId) => {
    try {
      const token = localStorage.getItem('token');
      console.log(expenseId)
      await axiosInstance.delete(`/expense/delete/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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

  const filterAndSortExpenses = () => {
    let filtered = expenses.filter((expense) => {
      const matchesSearch =
        expense.vendorName.toLowerCase().includes(searchText.toLowerCase()) ||
        expense.expenseName.toLowerCase().includes(searchText.toLowerCase());

      return matchesSearch;
    });

    if (sortOption) {
      filtered.sort((a, b) => {
        let valueA = a[sortOption];
        let valueB = b[sortOption];

        if (sortOption === "date") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        } else if (sortOption === "totalAmount") {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
        if (sortOrder === "desc") return valueA < valueB ? 1 : -1;
        return 0;
      });
    }

    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    filterAndSortExpenses();
  }, [searchText, sortOption, sortOrder, expenses]);

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => setCurrentPage(value);
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };
  
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
          {/* Filters Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={8} md={9}>
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
                  sx={{backgroundColor: "#e9efeb" }}
                >
                  <MenuItem value="">Sort By</MenuItem>
                  <MenuItem value="totalAmount">Total Expense</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </Select>
                <IconButton onClick={toggleSortOrder}>
                  {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                </IconButton>

                <TextField
                  type="date"
                  label="Select Date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  sx={{ width: "21%", backgroundColor: "#fff" }}
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
                  {paginatedExpenses.map((expense, index) => (
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
            <Pagination
              count={Math.ceil(filteredExpenses.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
          </DataContainer>
        </Box>
      </GradientBackground>
      <ToastContainer />
    </>
  );
};

export default Expense;
