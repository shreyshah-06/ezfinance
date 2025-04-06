const express = require("express");
const authRoutes = require("./auth");
const taxRoutes = require("./tax");
const categoryRoutes = require("./category");
const supplierRoutes = require("./supplier");
const customerRoutes = require("./customer");
const productRoutes = require("./product");
const invoiceRoutes = require("./invoice");
const salesRoutes = require("./sale");
const expenseRoutes = require("./expense");
const auditRoutes = require("./audit");
const gstRoutes = require("./gst");
const dashboardRoutes = require("./dashboard");
const otpRoutes = require("./otp");

const router = express.Router();

router.use("", authRoutes);
router.use("/tax", taxRoutes);
router.use("/category", categoryRoutes);
router.use("/supplier", supplierRoutes);
router.use("/customer", customerRoutes);
router.use("/product", productRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/sales", salesRoutes);
router.use("/expense", expenseRoutes);
router.use("/audit", auditRoutes);
router.use("/gst", gstRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/otp", otpRoutes);

module.exports = router;
