import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './CSS/audit.css'; // Ensure you have the correct CSS file imported
import axiosInstance from '../helper/axios';
import SideBar from './sidebar';
import Navbar from './Navbar';

const Audit = () => {
    const location = useLocation();
    useEffect(() => {
        const pathname = location.pathname;
        const activePage = pathname.substring(1);
        document.getElementById(`${activePage}Button`).style.backgroundColor = '#3F4F31';
        document.getElementById(`${activePage}Button`).style.color = '#F3FDE8';
    }, [location]);

    const [auditData, setAuditData] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalInvoices, setTotalInvoices] = useState(0);

    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const response = await axiosInstance.post('/audit/getall', {}); // Adjust the API endpoint accordingly
                setAuditData(response.data.auditData);
                setTotalExpenses(response.data.totalExpenses);
                setTotalInvoices(response.data.totalInvoices);
            } catch (error) {
                console.error('Error fetching audit data:', error);
            }
        };
        fetchAuditData();
    }, []);

    return (
        <>
            <section
                style={{
                    minHeight: '100vh',
                    background:
                        'linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)',
                }}
            >
                <Navbar />
                <div className="row m-0 h-100">
                    <SideBar />
                    <div className="col-md-10 inventory-container">
                        <div className="audit-container row" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div className="total-sales-audit col-md-3 mx-3 d-flex align-items-center justify-content-center">Total Invoices: ₹{totalInvoices.toFixed(2)}</div>
                            <div className="total-sales-audit col-md-3 mx-2 d-flex align-items-center justify-content-center">Total Expenses: ₹{totalExpenses.toFixed(2)}</div>
                        </div>
                        <div className="audit-table-container">
                            <table className="audit-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditData.map((audit, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{audit.type}</td>
                                            <td>{new Date(audit.createdAt).toLocaleDateString()}</td>
                                            <td style={{ color: audit.type === 'Expense' ? '#e74c3c' : '#2ecc71' }}>₹{audit.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Audit;
