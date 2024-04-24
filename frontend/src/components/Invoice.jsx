import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from "react-router-dom";
import axiosInstance from '../helper/axios';
import Navbar from './Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import AddInvoice from './dialogbox/addinvoice'; // Assuming you have an AddInvoice component
import SideBar from './sidebar';
import './CSS/invoice.css';

const Invoice = () => {
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        const activePage = pathname.substring(1);
        document.getElementById(`${activePage}Button`).style.backgroundColor = '#3F4F31';
        document.getElementById(`${activePage}Button`).style.color = '#F3FDE8';
    }, [location]);

    const [invoices, setInvoices] = useState([]);
    const [totalInvoiceAmt, setTotalInvoiceAmt] = useState(0);
    const [totalTaxAmt, setTotalTaxAmt] = useState(0);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axiosInstance.post("/invoice/getall", {});
                setInvoices(response.data.invoices);
                setTotalInvoiceAmt(response.data.totalInvoiceAmt);
                setTotalTaxAmt(
                    response.data.invoices.reduce((totalTax, invoice) => totalTax + invoice.totalTax, 0)
                );
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };
        fetchInvoices();
    }, []);
    
    let navigate = useNavigate();
    const handleClick = (event) => {
        navigate('/addinvoice')
    };

    const handleDeleteInvoice = async (invoiceId) => {
        try {
            await axiosInstance.post('/invoice/delete', { id: invoiceId });
            const response = await axiosInstance.post("/invoice/getall", {});
            setInvoices(response.data.invoices);
            setTotalInvoiceAmt(response.data.totalInvoiceAmt);
            toast.success('Invoice Deleted Successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };
    const handleFileTax = () => {
        toast.success('GST Filed Successfully', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    return (
        <>
            <section style={{ background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)" }}>
                <Navbar />
            {/* <ToastContainer> */}
                <div className='row m-0 h-100'>
                    <SideBar />
                    <div className='col-md-10 invoice-container'>
                        <div className="add-invoice-container row">
                            <button className="add-invoice-button col-md-2 mx-3" onClick={handleClick} >Add Invoice</button>
                            <div className='col-md-5'></div>
                            <div className="total-invoice col-md-2 mx-2 d-flex align-items-center justify-content-center">Total: ₹{totalInvoiceAmt.toFixed(2)}</div>
                            <div className="total-tax-due col-md-2 d-flex align-items-center justify-content-center" onClick={handleFileTax}>Tax Due: ₹{totalTaxAmt.toFixed(2)}</div>
                        </div>
                        <div className="invoice-table-container">
                            <table className="invoice-table">
                                <thead>
                                    <tr>
                                        <th>Invoice Number</th>
                                        <th>Customer Name</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Tax Amount</th>
                                        <th>Total Amount</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice, index) => (
                                        <tr key={index}>
                                            <td>{invoice.invoiceNumber}</td>
                                            <td>{invoice.customerName}</td>
                                            <td>{invoice.date.split('T')[0].split('-').reverse().join('-')}</td>
                                            <td>₹{(invoice.totalAmount - invoice.totalTax).toFixed(2)}</td>
                                            <td>₹{invoice.totalTax.toFixed(2)}</td>
                                            <td>₹{invoice.totalAmount.toFixed(2)}</td>
                                            <td><button className='del-button px-1 align-items-center justify-content-center d-flex' onClick={() => handleDeleteInvoice(invoice.id)}>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <ToastContainer/>
            </section>
        </>
    )
}

export default Invoice;
