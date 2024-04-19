import React from 'react';
import { useNavigate  } from "react-router-dom";
const SideBar = ()=>{
    let navigate = useNavigate();
    const handleClick = (event) => {
        const buttonId = event.target.id;
        const page = buttonId.slice(0, -6);
        if(page==="overview"){
            navigate('/dashboard');
            
        }
        else navigate(`/${page}`)
    };
    return(
        <div className='col-md-2 ' style={{backgroundColor:'#ADBC9F',minHeight:'100vh'}}>
            <div className='py-1 mt-3 ms-1 px-2 mb-3' id='overviewButton' onClick={handleClick}  style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Overview</div>
            <div className='py-1 px-2 ms-1 mb-3' id='inventoryButton' onClick={handleClick}  style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Inventory</div>
            <div className='py-1 px-2 ms-1 mb-3' id='taxButton' onClick={handleClick}  style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Tax</div>
            <div className='py-1 px-2 ms-1 mb-3' id='invoiceButton' onClick={handleClick}  style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Invoice</div>
            <div className='py-1 px-2 ms-1 mb-3' id='expenseButton'  onClick={handleClick} style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Expense</div>
            <div className='py-1 px-2 ms-1 mb-3' id='salesButton' onClick={handleClick}  style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Sales</div>
            <div className='py-1 px-2 ms-1 mb-3' id='auditButton'  onClick={handleClick} style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Audit Logs</div>
            <div className='py-1 px-2 ms-1 mb-3' id='supplierButton'  onClick={handleClick} style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Supplier</div>
            <div className='py-1 px-2 ms-1 mb-3' id='categoryButton'  onClick={handleClick}  style={{borderRadius:'0.7rem',backgroundColor:'#4F6F52',color:'#D2E3C8',fontWeight:'bold',fontSize:'1.1rem'}} > Category</div>
        </div>
    );
}

export default SideBar;