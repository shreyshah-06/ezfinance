import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helper/axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/addinvoice.css';

function AddInvoice() {
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [products, setProducts] = useState([{productId: '', productName: '', quantity: 0, discount: 0, tax: 0, total: 0 }]);
  const [inventory, setInventory] = useState([]);
  const [taxRates, setTaxRates] = useState({});

  const calculateTotal = (quantity, price, taxRate, discount) => {
    const totalBeforeTax = quantity * price;
    const discountAmount = (totalBeforeTax * discount) / 100;
    const totalWithDiscount = totalBeforeTax - discountAmount;
    const taxAmount = (totalWithDiscount * taxRate) / 100;
    const totalAmount = totalWithDiscount + taxAmount;
    return totalAmount;
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axiosInstance.post("/product/getAll", {});
        setInventory(response.data.products);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    const fetchTaxSlabs = async () => {
      try {
        const response = await axiosInstance.post("/tax/getall", {});
        setTaxRates(response.data.taxSlabs);
      } catch (error) {
        console.error("Error fetching tax slabs:", error);
      }
    };

    fetchInventory();
    fetchTaxSlabs();
  }, []);

  const handleProductNameChange = (index, value) => {
    const product = inventory.find(item => item.model === value);
    if (product) {
      const taxRateObj = taxRates.find(rate => rate.id === product.taxId);
      const taxRate = taxRateObj ? taxRateObj.rate : 0;
      const newProducts = [...products];
      newProducts[index].productId = product.id;
      newProducts[index].productName = value;
      newProducts[index].price = product.sellingPrice;
      newProducts[index].tax = taxRate;
      setProducts(newProducts);
    }
  };

  const handleQuantityChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].quantity = parseInt(value);
    newProducts[index].total = calculateTotal(
      parseInt(value),
      newProducts[index].price,
      newProducts[index].tax,
      newProducts[index].discountPercentage
    );
    setProducts(newProducts);
  };

  const handleDiscountChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].discountPercentage = parseFloat(value);
    newProducts[index].total = calculateTotal(
      newProducts[index].quantity,
      newProducts[index].price,
      newProducts[index].tax,
      parseFloat(value)
    );
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { productName: '', price: 0,  quantity: 0, discountPercentage: 0, tax: 0, total: 0 }]);
  };

  let navigate = useNavigate();
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      const invoiceData = {
        customerName,
        date,
        products: products.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
          discountPercentage: product.discountPercentage,
          taxPercentage: product.tax
        }))
      };
      console.log(invoiceData)
      const response = await axiosInstance.post('/invoice/add', invoiceData);
      navigate('/invoice')
      console.log('Invoice saved successfully:', response.data);
    } catch (error) {
      toast.error('Error Adding Invoice', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
      console.error('Error saving invoice:', error);
    }
  };

  const billAmount = products.reduce((acc, product) => acc + product.total, 0);

  return (
    <section className='add-invoice-dialog-container'>
      <div className='add-invoice-dialog-main'>
        <div className='py-3 d-flex align-items-center justify-content-center' style={{fontSize:'1.9rem', fontWeight:'bolder'}}>Add Invoice</div>
        <form className='add-invoice-dialog-form' onSubmit={handleSubmit}>
          <div className='d-flex align-items-center justify-content-center'>
            <div className='px-4 py-4'>
              <label htmlFor="customerName" className='fw-bold mx-2' >Customer Name:</label>
              <input type="text" id="customerName" className='' placeholder='Customer Name' style={{border:'2px solid black',color:'black',fontWeight:'700'}} value={customerName} onChange={(e) => setCustomerName(e.target.value)} required /><br /><br />
            </div>
            <div className='px-4 py-4'>
              <label htmlFor="date" className='fw-bold mx-2' >Date:</label>
              <input type="date" id="date"  style={{border:'2px solid black'}} value={date} onChange={(e) => setDate(e.target.value)} required /><br /><br />
            </div>
          </div>

          <table className='add-invoice-dialog-table'>
            <thead>
              <tr>
                <th className='p-1' style={{backgroundColor:'#76885B'}} >Product Name</th>
                <th className='p-1' style={{backgroundColor:'#76885B'}} >Price</th>
                <th className='p-1' style={{backgroundColor:'#76885B'}} >Quantity</th>
                <th className='p-1' style={{backgroundColor:'#76885B'}} >Discount (%)</th>
                <th className='p-1' style={{backgroundColor:'#76885B'}} >Tax Rate (%)</th>
                <th className='p-1' style={{backgroundColor:'#76885B'}} >Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className='py-1'>
                    <select style={{backgroundColor:'#DDDDDD',borderRadius:' 4px'}} className='mx-1' value={product.productName} onChange={(e) => handleProductNameChange(index, e.target.value)} required>
                      <option value="">Select Product</option>
                      {inventory.map(item => (
                        <option key={item.id} value={item.model}>{item.model}</option>
                      ))}
                    </select>
                  </td>
                  <td className='py-1'><input type="number" className='mx-1' value={product.price} style={{backgroundColor:'#DDDDDD'}} readOnly /></td>
                  <td className='py-1'><input type="number" className='mx-1' value={product.quantity}  style={{backgroundColor:'#DDDDDD'}} onChange={(e) => handleQuantityChange(index, e.target.value)} required /></td>
                  <td className='py-1'><input type="number" className='mx-1' value={product.discountPercentage} style={{backgroundColor:'#DDDDDD'}}  onChange={(e) => handleDiscountChange(index, e.target.value)} required /></td>
                  <td className='py-1'><input type="number" className='mx-1' value={product.tax}  style={{backgroundColor:'#DDDDDD'}} readOnly/></td>
                  <td className='py-1'><input type="number" className='mx-1' value={product.total} style={{backgroundColor:'#DDDDDD'}}  readOnly /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <button type="button" className='add-invoice-dialog-addproduct' onClick={addProduct}>Add Product</button>
          <br /><br />
          <div className='bill-amount'>
            <div className='fw-bold' style={{fontSize:'1.1rem'}}>Bill Amount: &nbsp;</div>
            <div className='billamt-div px-3'>{billAmount}</div>
          </div>
          <div className='mt-1' style={{display:'flex',justifyContent: 'flex-end'}}>
            <input type="submit" className='add-invoice-dialog-submit' value="Add Invoice" />
          </div>
        </form>
      </div>
      <ToastContainer/>
    </section>
  );
}

export default AddInvoice;
