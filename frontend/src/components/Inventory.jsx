import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation  } from "react-router-dom";
import './CSS/inventory.css'
import axiosInstance from '../helper/axios';
import SideBar from './sidebar';
import Navbar from './Navbar'

const Inventory = ()=>{

    const location = useLocation();
    useEffect(() => {
        const pathname = location.pathname;
        const activePage = pathname.substring(1);
        document.getElementById(`${activePage}Button`).style.backgroundColor = '#3F4F31';
        document.getElementById(`${activePage}Button`).style.color = '#F3FDE8';
    }, [location]);
    const [inventory, setInventory] = useState([]);
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axiosInstance.post("/product/getAll",{})
                setInventory(response.data.products);
                console.log(response.data.products)
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchInventory();
    }, []);
    
    return(
        <>
            <section style={{minHeight:'100vh',background: "rgb(122,135,113)",
        background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)"}} >
                <Navbar/>
                <div className='row m-0 h-100'>
                   <SideBar/>
                    <div className='col-md-10 inventory-container'>
                        <div className="add-inventory-container">
                            <button className="add-inventory-button">Add Inventory</button>
                        </div>
                        <div className="inventory-table-container">
                            <table className="inventory-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Model</th>
                                        <th>Serial Number</th>
                                        <th>Quantity Left</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.model}</td>
                                            <td>{item.serialNumber}</td>
                                            <td>{item.quantity}</td>
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

export default Inventory