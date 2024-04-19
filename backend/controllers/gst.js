const Invoice = require('../models/invoice')
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const getGstAmtandBills = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        let userId;
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            userId = decodedToken.id; 
            console.log(userId); 
        }
        });
        const{fromDate,toDate,sortBy,sortOrder} = req.query
        let whereCondition = { userId };
        if (fromDate && toDate) {
            // const fromDate Obj = new Date(fromDate);
            // const toDateObj = new Date(toDate);
            whereCondition.date = {
                [Op.between]: [fromDate, toDate]
            };
        }
        const invoices = await Invoice.findAll({
            where: whereCondition,
            order: sortBy && sortOrder ? [[sortBy, sortOrder === 'asc' ? 'ASC' : 'DESC']] : null
        });

        let totalTaxAmt = 0;
        for (const invoice of invoices) {
            totalTaxAmt += invoice.totalTax;
        }
        res.status(200).json({ invoices, totalTaxAmt });
    } catch (error) {
        console.error('Error fetching GST amount and invoices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {getGstAmtandBills}