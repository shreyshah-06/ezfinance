const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const taxRoutes = require('./routes/tax')
const categoryRoutes = require('./routes/category')
const supplierRoutes = require('./routes/supplier')
const customerRoutes = require('./routes/customer')
const productRoutes = require('./routes/product')
const invoiceRoutes = require('./routes/invoice')
const salesRoutes = require('./routes/sale')
const expenseRoutes = require('./routes/expense')
const auditRoutes = require('./routes/audit')
const gstRoutes = require('./routes/gst')

require('dotenv').config()
const db = require('./config/database')

const PORT  = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/api",authRoutes)
app.use("/api",taxRoutes)
app.use("/api",categoryRoutes)
app.use("/api",supplierRoutes)
app.use("/api",customerRoutes)
app.use("/api",productRoutes)
app.use("/api",invoiceRoutes)
app.use("/api",salesRoutes)
app.use("/api",expenseRoutes)
app.use("/api",auditRoutes)
app.use("/api",gstRoutes)

const serverStart = async()=>{
    try {
        await db.authenticate();
        console.log("Connected to DB")
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
}
serverStart();