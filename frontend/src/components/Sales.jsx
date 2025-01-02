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
  Grid,
  TextField,
  MenuItem,
  Select,
  Pagination,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { styled } from "@mui/system";
import Navbar from "./Navbar";
import SideBar from "./sidebar";
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

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("kmp");
  const [sortOrder, setSortOrder] = useState("asc");
  const [productFilter, setProductFilter] = useState("");
  const [productMap, setProductMap] = useState(new Map());

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axiosInstance.post("/sales/getall", {});
        setSales(response.data.sales);
        setFilteredSales(response.data.sales);
      } catch (error) {
        console.error("Error fetching sales:", error);
        toast.error("Failed to fetch sales data.");
      }
    };
    fetchSales();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.post("/product/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch product data.");
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    const productMap = new Map(
      products.map((product) => [product.id, product.model])
    );
    setProductMap(productMap);
  }, [products]);

  const filterAndSortSales = () => {
    let filtered = sales;

    if (searchText) {
      filtered = filtered.filter((sale) =>
        sale.customerName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (productFilter) {
      filtered = filtered.filter(
        (sale) => sale.productId === parseInt(productFilter, 10)
      );
    }
    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        let valueA = a[sortOption];
        let valueB = b[sortOption];

        if (sortOption === "date") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }
        if (sortOption === "productId") {
          valueA = productMap.get(a.productId);
          valueB = productMap.get(b.productId);
        }

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredSales(filtered);
  };
  useEffect(() => {
    filterAndSortSales();
  }, [searchText, sortOption, sortOrder, productFilter, sales]);

  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalSalesAmount = sales.reduce(
    (sum, sale) => sum + parseFloat(sale.total || 0),
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
                  label="Search Sales"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{
                    flex: 2,
                    backgroundColor: "#e9efeb",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#030403",
                    },
                  }}
                />
                <Select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  displayEmpty
                  sx={{
                    backgroundColor: "#e9efeb",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#030403",
                    },
                  }}
                >
                  <MenuItem value="">Filter by Product</MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.model}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  sx={{
                    backgroundColor: "#e9efeb",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#030403",
                    },
                  }}
                >
                  <MenuItem value="kmp">Sort By</MenuItem>
                  <MenuItem value="total">Total Amount</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </Select>
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TotalAmountBox>
                <IconWrapper>
                  <Typography sx={{ fontSize: "20px" }}>₹</Typography>
                </IconWrapper>
                <Box>
                  <Typography variant="subtitle2">Total Sales</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4CAF50",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{totalSalesAmount.toFixed(2)}
                  </Typography>
                </Box>
              </TotalAmountBox>
            </Grid>
          </Grid>

          <DataContainer>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Sales
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Sr. No</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Invoice Number</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Product Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Discount Percentage</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSales.map((sale, index) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{sale.invoiceNumber}</TableCell>
                      <TableCell>
                        {productMap.get(sale.productId) || "Unknown"}
                      </TableCell>
                      <TableCell>{sale.discountPercentage}%</TableCell>
                      <TableCell>₹{sale.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(filteredSales.length / itemsPerPage)}
              page={currentPage}
              color="primary"
              onChange={(e, value) => setCurrentPage(value)}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
          </DataContainer>
        </Box>
      </GradientBackground>
      <ToastContainer />
    </>
  );
};

export default Sales;
