import React, { useState, useEffect } from 'react';
import './CSS/sale.css';
import axiosInstance from '../helper/axios';
import SideBar from './sidebar';
import Navbar from './Navbar';

const Sales = () => {

    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axiosInstance.post('/sales/getall', {}); 
                console.log(response)
                setTotalSales(response.data.totalSales);
                setSales(response.data.sales);
                console.log(response.data.sales); 
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.post('/product/getAll', {}); // Adjust the API endpoint accordingly
                setProducts(response.data.products);
                console.log(response.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchSales();
        fetchProducts();
        
    }, []);
    const getProductById = (productId) => {
        const product = products.find((product) => product.id === productId);
        return product ? product.model : '';
    };

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
                    <div className="sales-container row" style={{display:'flex',justifyContent:'flex-end'}}>                        
                        <div className="total-sales col-md-3 d-flex align-items-center justify-content-center">Total Sales: ₹{totalSales.toFixed(2)}</div>
                    </div>
                        <div className="sales-table-container">
                            <table className="sales-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Invoice Number</th>
                                        <th>Product Name</th>
                                        <th>Discount Percentage</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale, index) => (
                                        <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{sale.invoiceNumber}</td>
                                        <td>{getProductById(sale.productId)}</td>
                                        <td>{sale.discountPercentage}</td>
                                        <td>{sale.total}</td>
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

export default Sales;
