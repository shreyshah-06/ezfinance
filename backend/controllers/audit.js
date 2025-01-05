const Invoice = require('../models/invoice');
const Expense = require('../models/expense');
const { Op } = require('sequelize');

const getAuditDataByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fromDate, toDate } = req.query;

        // date filter
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

        const [invoices, expenses] = await Promise.all([
            Invoice.findAll({
                where: { userId, ...dateFilter },
                attributes: ['createdAt', 'invoiceNumber', 'totalAmount'],
                raw: true,
                order: [['createdAt', 'DESC']]
            }),
            Expense.findAll({
                where: { userId, ...dateFilter },
                attributes: ['createdAt', 'expenseId', 'totalAmount'],
                raw: true,
                order: [['createdAt', 'DESC']]
            })
        ]);

        const totalInvoices = invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
        const totalExpenses = expenses.reduce((acc, expense) => acc + expense.totalAmount, 0);

        // Create audit data by merging invoices and expenses
        const auditData = [
            ...invoices.map(invoice => ({
                type: 'Invoice',
                createdAt: invoice.createdAt,
                number: invoice.invoiceNumber,
                amount: invoice.totalAmount
            })),
            ...expenses.map(expense => ({
                type: 'Expense',
                createdAt: expense.createdAt,
                number: expense.expenseId,
                amount: expense.totalAmount
            }))
        ];

        // Sorting the merged data by date in descending order
        auditData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({ auditData, totalExpenses, totalInvoices });
    } catch (error) {
        console.error("Error fetching audit data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getAuditDataByUserId };
