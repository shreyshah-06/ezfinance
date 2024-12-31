import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axiosInstance from '../helper/axios';
import Navbar from './Navbar';
import AddExpense from './dialogbox/addexpense';
import SideBar from './sidebar';
import './CSS/expense.css';

const Expense = () => {

    const [expenses, setExpenses] = useState([]);
    const [showAddExpense, setShowAddExpense] = useState(false);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axiosInstance.post("/expense/getall", {});
                setExpenses(response.data.expenses);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };
        fetchExpenses();
    }, []);

    const handleDeleteExpense = async (expenseId) => {
        try {
            await axiosInstance.post('/expense/delete', { id: expenseId });
            const response = await axiosInstance.post("/expenses/delete", {});
            setExpenses(response.data.expenses);
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    let totalAmount = 0;
    const handleAddExpense = async (expense) => {
        try {
            await axiosInstance.post('/expense/add', expense);
            const response = await axiosInstance.post("/expense/getall", {});
            setExpenses(response.data.expenses);
            setShowAddExpense(false); // Hide the modal after adding expense
            // totalAmount=0;
            totalAmount+=expense.totalAmount
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    // Calculate total amount
    for (const expense of expenses) {
        totalAmount += parseFloat(expense.totalAmount);
    }

    return (
        <>
            <section style={{  background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)" }}>
                <Navbar />
                <div className='row m-0 h-100'>
                    <SideBar />
                    <div className='col-md-10 expense-container'>
                        <div className="add-expense-container row">
                            <button className="add-expense-button col-md-2 mx-3" onClick={() => setShowAddExpense(true)}>Add Expense</button>
                            <div className='col-md-7'></div>
                            <div className="total-expense col-md-2 d-flex align-items-center justify-content-center">Total: ₹{totalAmount.toFixed(2)}</div>
                        </div>
                        <AddExpense
                            isOpen={showAddExpense}
                            onClose={() => setShowAddExpense(false)}
                            onAdd={handleAddExpense}
                        />
                        <div className="expense-table-container">
                            <table className="expense-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Vendor Name</th>
                                        <th>Expense Name</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((expense, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{expense.vendorName}</td>
                                            <td>{expense.expenseName}</td>
                                            <td>{expense.date.split('T')[0].split('-').reverse().join('-')}</td>
                                            <td>₹{expense.totalAmount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Expense;
