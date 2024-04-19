import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation  } from "react-router-dom";
import axiosInstance from '../helper/axios';
import Navbar from './Navbar'
import AddCategory from './dialogbox/addcategory';
import SideBar from './sidebar';
import './CSS/category.css'
const Category = ()=>{

    let navigate = useNavigate(); 
    const location = useLocation();
    useEffect(() => {
        const pathname = location.pathname;
        const activePage = pathname.substring(1);
        document.getElementById(`${activePage}Button`).style.backgroundColor = '#3F4F31';
        document.getElementById(`${activePage}Button`).style.color = '#F3FDE8';
    }, [location]);
    const [inventory, setInventory] = useState([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axiosInstance.post("/category/getall",{})
                setInventory(response.data.categories);
                console.log(response.data.categories)
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchCategory();
    }, []);
    const handleClick = (event) => {
        const buttonId = event.target.id;
        const page = buttonId.slice(0, -6);
        navigate(`/${page}`)
    };
    const handleDelete = async (categoryId) => {
        try {
            await axiosInstance.post('/category/delete',{id:categoryId});
            const response = await axiosInstance.post("/category/getall", {})
            setInventory(response.data.categories);
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };
    const handleAddCategory = async (categoryName) => {
        try {
            await axiosInstance.post('/category/add', { name: categoryName });
            const response = await axiosInstance.post("/category/getall", {})
            setInventory(response.data.categories);
            setShowAddCategory(false); // Hide the modal after adding category
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };
    return(
        <>
            <section style={{minHeight:'100vh',background: "rgb(122,135,113)",
        background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)"}} >
                <Navbar/>
                <div className='row m-0 h-100'>
                   <SideBar/>
                    <div className='col-md-10 category-container'>
                          <div className="add-category-container">
                            <button className="add-category-button" onClick={() => setShowAddCategory(true)}>Add Category</button>
                        </div>
                        <AddCategory
                            isOpen={showAddCategory}
                            onClose={() => setShowAddCategory(false)}
                            onAdd={handleAddCategory}
                        />
                        <div className="category-table-container">
                            <table className="category-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Category Name</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td><button className='del-button px-1 align-items-center justify-content-center d-flex' onClick={() => handleDelete(item.id)} >Delete</button></td>
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

export default Category