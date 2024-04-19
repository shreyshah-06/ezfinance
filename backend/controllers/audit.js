const Invoice = require('../models/invoice')
const Expense = require('../models/expense')
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const getAuditDataByUserId = async (req, res) => {
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
        const { fromDate, toDate } = req.query;
        // const fromDate1 = new Date(fromDate);
        // fromDate1.setUTCHours(0, 0, 0, 0);
        // const fromDateIST = new Date(fromDate1.valueOf() + 5.5 * 60 * 60 * 1000);
        // console.log(fromDateIST)
        const dateFilter = {};
        if (fromDate && toDate) {
            dateFilter.createdAt = {
                [Op.between]: [fromDate, toDate]
            };
        } else if (fromDate) {
            dateFilter.createdAt = {
                [Op.gte]: fromDate
            };
        } else if (toDate) {
            dateFilter.createdAt = {
                [Op.lte]: toDate
            };
        }

        const invoices = await Invoice.findAll({
            where: { userId,
                ...dateFilter },
            attributes: ['createdAt', 'invoiceNumber', 'totalAmount'],
            raw: true
        });

        const expenses = await Expense.findAll({
            where: { userId,
                ...dateFilter },
            attributes: ['createdAt', 'expenseId', 'totalAmount'],
            raw: true
        });

        let totalExpenses = 0;
        let totalInvoices = 0;

        invoices.forEach(invoice => {
            totalInvoices += invoice.totalAmount;
        });

        expenses.forEach(expense => {
            totalExpenses += expense.totalAmount;
        });

        const auditData = [];
        invoices.forEach(invoice => {
            auditData.push({
                type: 'Invoice',
                createdAt: invoice.createdAt,
                number: invoice.invoiceNumber,
                amount: invoice.totalAmount
            });
        });
        expenses.forEach(expense => {
            auditData.push({
                type: 'Expense',
                createdAt: expense.createdAt,
                number: expense.expenseId,
                amount: expense.totalAmount
            });
        });

        auditData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({ auditData ,totalExpenses,totalInvoices});
    } catch (error) {
        console.error("Error fetching audit data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getAuditDataByUserId };
