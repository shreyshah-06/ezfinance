import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from '../helper/axios';
import Navbar from './Navbar';
import AddSupplier from './dialogbox/addsupplier';
import SideBar from './sidebar';
import './CSS/supplier.css';

const Supplier = () => {
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        const activePage = pathname.substring(1);
        document.getElementById(`${activePage}Button`).style.backgroundColor = '#3F4F31';
        document.getElementById(`${activePage}Button`).style.color = '#F3FDE8';
    }, [location]);

    const [suppliers, setSuppliers] = useState([]);
    const [showAddSupplier, setShowAddSupplier] = useState(false);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axiosInstance.post("/supplier/getall", {})
                setSuppliers(response.data.suppliers);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };
        fetchSuppliers();
    }, []);

    const handleDelete = async (supplierId) => {
        try {
            await axiosInstance.post('/supplier/delete', { id: supplierId });
            const response = await axiosInstance.post("/supplier/getall", {})
            setSuppliers(response.data.suppliers);
        } catch (error) {
            console.error("Error deleting supplier:", error);
        }
    };

    const handleAddSupplier = async (supplier) => {
        try {
            await axiosInstance.post('/supplier/add', supplier);
            const response = await axiosInstance.post("/supplier/getall", {})
            setSuppliers(response.data.suppliers);
            setShowAddSupplier(false); // Hide the modal after adding supplier
        } catch (error) {
            console.error("Error adding supplier:", error);
        }
    };

    return (
        <>
            <section style={{minHeight:'100vh', background: "rgb(122,135,113)", background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)" }} >
                <Navbar />
                <div className='row m-0 h-100'>
                    <SideBar/>
                    <div className='col-md-10 supplier-container'>
                        <div className="add-supplier-container">
                            <button className="add-supplier-button" onClick={() => setShowAddSupplier(true)}>Add Supplier</button>
                        </div>
                        <AddSupplier
                            isOpen={showAddSupplier}
                            onClose={() => setShowAddSupplier(false)}
                            onAdd={handleAddSupplier}
                        />
                        <div className="supplier-table-container">
                            <table className="supplier-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Address</th>
                                        <th>Previous Credit Balance</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map((supplier, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{supplier.name}</td>
                                            <td>{supplier.contact}</td>
                                            <td>{supplier.address}</td>
                                            <td>{supplier.previousCreditBalance}</td>
                                            <td><button className='del-button px-1 align-items-center justify-content-center d-flex' onClick={() => handleDelete(supplier.id)} >Delete</button></td>
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

export default Supplier;
