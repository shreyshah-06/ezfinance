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
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import Chart from "react-apexcharts";
import axiosInstance from "../helper/axios";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 500000,
    totalExpenses: 200000,
    totalTaxes: 50000,
    totalInventoryValue: 800000,
    outOfStockItems: 12,
    salesTrends: [10000, 15000, 20000, 18000, 30000, 25000],
    expenseTrends: [5000, 7000, 8000, 9000, 10000, 11000],
    months: ["July", "August", "September", "October", "November", "December"],
    recentTransactions: [
      { id: 1, name: "Invoice #101", amount: 15000, date: "2024-12-20" },
      { id: 2, name: "Invoice #102", amount: 20000, date: "2024-12-21" },
    ],
    topItems: [
      { name: "Product A", stock: 10 },
      { name: "Product B", stock: 15 },
      { name: "Product C", stock: 8 },
      { name: "Product D", stock: 20 },
      { name: "Product E", stock: 25 },
    ],
  });

  const [salesGoal, setSalesGoal] = useState(100000); // Default goal
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [newSalesGoal, setNewSalesGoal] = useState(salesGoal);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/summary");
        setDashboardData((prevData) => ({
          ...prevData,
          totalRevenue: response.data.totalRevenue || 0,
          totalExpenses: response.data.totalExpenses || 0,
          totalTaxes: response.data.totalTaxes || 0,
          profit: response.data.profit || 0,
        }));
      } catch (error) {
        console.error(error);
      }
    };
    // Fetch inventory summary
    const fetchInventorySummary = async () => {
      try {
        const response = await axiosInstance.get(
          "/dashboard/inventory/summary"
        );
        setDashboardData((prevData) => ({
          ...prevData,
          totalInventoryValue: response.data.totalInventoryValue || 0,
          outOfStockItems: response.data.outOfStockItems || 0,
          topItems: response.data.topItems || [],
        }));
      } catch (error) {
        console.error("Error fetching inventory summary:", error);
      }
    };

    const fetchTrendsData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/six-month-trends");
        setDashboardData((prevData) => ({
          ...prevData,
          salesTrends: response.data.salesTrends,
          expenseTrends: response.data.expenseTrends,
          months: response.data.months,
        }));
      } catch (error) {
        console.error("Error fetching trends data:", error);
      }
    };

    // Fetch recent transactions
    const fetchRecentTransactions = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/invoice/recent");
        setDashboardData((prevData) => ({
          ...prevData,
          recentTransactions: response.data.recentTransactions || [],
        }));
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      }
    };

    fetchDashboardData();
    fetchInventorySummary();
    // fetchTrendsData();
    fetchRecentTransactions();
  }, []);

  const handleGoalChange = (event) => {
    setNewSalesGoal(event.target.value);
  };

  const handleSaveGoal = () => {
    setSalesGoal(newSalesGoal);
    setOpenGoalDialog(false);
  };

  const handleCancelGoal = () => {
    setOpenGoalDialog(false);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          background: "linear-gradient(to right, #c4d3c8, #a8beae, #b1c5b7)",
        }}
      >
        {/* Sidebar */}
        <Box sx={{ flex: "0 0 250px" }}>
          <SideBar />
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, mt: 8, p: 4 }}>
          <Grid container spacing={3}>
            {/* Summary Cards */}
            {[
              {
                label: "Revenue (This Month)",
                value: `₹${dashboardData.totalRevenue.toFixed(2)}`,
              },
              {
                label: "Profit",
                value: `₹${(
                  dashboardData.totalRevenue - dashboardData.totalExpenses
                ).toFixed(2)}`,
              },
              {
                label: "Taxes Collected",
                value: `₹${dashboardData.totalTaxes.toFixed(2)}`,
              },
              {
                label: "Inventory Value",
                value: `₹${dashboardData.totalInventoryValue.toFixed(2)}`,
              },
            ].map(({ label, value }, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  sx={{ p: 2, textAlign: "center", borderRadius: "12px" }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {label}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mt: 1, fontWeight: "bold", color: "#4CAF50" }}
                  >
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Inventory Summary */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Inventory Overview
            </Typography>
            <Paper sx={{ p: 2, borderRadius: "12px" }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Out-of-Stock Items: {dashboardData.outOfStockItems}
              </Typography>
              <Chart
                options={{
                  chart: { type: "bar" },
                  xaxis: {
                    categories: dashboardData.topItems.map((item) => item.name), // Extract product names for x-axis
                  },
                  colors: ["#4CAF50"], // Bar color
                }}
                series={[
                  {
                    name: "Stock Levels",
                    data: dashboardData.topItems.map((item) => item.stock), // Extract stock quantities for the data
                  },
                ]}
                type="bar"
                height="300"
              />
            </Paper>
          </Box>

          {/* Sales Trends */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Sales Trends (Last 6 Months)
            </Typography>
            <Chart
              options={{
                chart: { type: "line" },
                xaxis: { categories: dashboardData.months },
                colors: ["#36A2EB"],
              }}
              series={[
                { name: "Sales", data: dashboardData.salesTrends },
                { name: "Expenses", data: dashboardData.expenseTrends },
              ]}
              type="line"
              height="300"
            />
          </Box>

          {/* Sales Goal Progress */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Sales Goal Progress
            </Typography>
            <Paper sx={{ p: 2, borderRadius: "12px" }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ₹{dashboardData.totalRevenue} / ₹{salesGoal}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      dashboardData.totalRevenue >= salesGoal
                        ? "#4CAF50"
                        : "#FF9800",
                  }}
                >
                  {" "}
                  ({((dashboardData.totalRevenue / salesGoal) * 100).toFixed(1)}
                  %)
                </span>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(dashboardData.totalRevenue / salesGoal) * 100}
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      dashboardData.totalRevenue >= salesGoal
                        ? "#4CAF50"
                        : "#FF9800",
                  },
                }}
              />
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => setOpenGoalDialog(true)}
              >
                Modify Goal
              </Button>
              {dashboardData.totalRevenue >= salesGoal && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    color: "#4CAF50",
                    textAlign: "center",
                  }}
                >
                  Better than expected! 🎉
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Recent Transactions */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Recent Transactions
            </Typography>
            <Paper sx={{ p: 2, borderRadius: "12px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Transaction</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{`Invoice #${transaction.id}`}</TableCell>{" "}
                      {/* Display Invoice # with the id */}
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell>₹{transaction.totalAmount}</TableCell>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>{" "}
                      {/* Format date */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Box>
        <Dialog open={openGoalDialog} onClose={handleCancelGoal}>
          <DialogTitle>Set/Modify Sales Goal</DialogTitle>
          <DialogContent>
            <TextField
              label="Sales Goal"
              variant="outlined"
              type="number"
              fullWidth
              value={newSalesGoal}
              onChange={handleGoalChange}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelGoal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveGoal} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
