import React, { useState,useEffect } from 'react';
import { useLocation  } from "react-router-dom";
import axiosInstance from '../helper/axios';
import Navbar from './Navbar'
import AddTaxSlab from './dialogbox/addtaxslab';
import SideBar from './sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/taxslab.css'
const TaxSlab = ()=>{

    
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        const activePage = pathname.substring(1);
        document.getElementById(`${activePage}Button`).style.backgroundColor = '#3F4F31';
        document.getElementById(`${activePage}Button`).style.color = '#F3FDE8';
    }, [location]);

    const [taxSlabs, setTaxSlabs] = useState([]);
    const [showAddTaxSlab, setShowAddTaxSlab] = useState(false);

    useEffect(() => {
        const fetchTaxSlabs = async () => {
            try {
                const response = await axiosInstance.post("/tax/getall", {})
                setTaxSlabs(response.data.taxSlabs);
            } catch (error) {
                console.error("Error fetching tax slabs:", error);
            }
        };
        fetchTaxSlabs();
    }, []);

    const handleDelete = async (taxSlabId) => {
        try {
            await axiosInstance.post('/tax/delete', { id: taxSlabId });
            const response = await axiosInstance.post("/tax/getall", {})
            setTaxSlabs(response.data.taxSlabs);
            toast.success('Tax Slab Deleted Successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error deleting tax slab:", error);
        }
    };

    const handleAddTaxSlab = async (taxSlab) => {
        try {
            await axiosInstance.post('/tax/add', taxSlab);
            const response = await axiosInstance.post("/tax/getall", {})
            setTaxSlabs(response.data.taxSlabs);
            setShowAddTaxSlab(false); // Hide the modal after adding tax slab
            toast.success('Tax Slab Added Successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error adding tax slab:", error);
        }
    };
    return(
        <>
            <section style={{minHeight:'100vh',background: "rgb(122,135,113)",
        background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)"}} >
                <Navbar/>
                <div className='row m-0 h-100'>
                    <SideBar/>
                    <div className='col-md-10 tax-slab-container'>
                        <div className="add-tax-slab-container">
                            <button className="add-tax-slab-button" onClick={() => setShowAddTaxSlab(true)}>Add Tax Slab</button>
                        </div>
                        <AddTaxSlab
                            isOpen={showAddTaxSlab}
                            onClose={() => setShowAddTaxSlab(false)}
                            onAdd={handleAddTaxSlab}
                        />
                        <div className="tax-slab-table-container">
                            <table className="tax-slab-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Name</th>
                                        <th>Rate (%)</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taxSlabs.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.rate}</td>
                                            <td><button className='del-button px-1 align-items-center justify-content-center d-flex' onClick={() => handleDelete(item.id)} >Delete</button></td>
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

export default TaxSlab