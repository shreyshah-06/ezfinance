import React, { useState } from 'react';
import '../CSS/addsupplier.css';

const AddSupplier = ({ isOpen, onClose, onAdd }) => {
  const [supplierData, setSupplierData] = useState({
    name: '',
    contact: '',
    address: '',
    details: '',
    previousCreditBalance: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddSupplier = () => {
    onAdd(supplierData);
    setSupplierData({
      name: '',
      contact: '',
      address: '',
      details: '',
      previousCreditBalance: ''
    });
  };

  return (
    <>
      {isOpen &&
        <div className="modal-overlay">
            <div className='fw-bold' style={{ fontWeight: "bold", fontSize: '1.5rem', padding: '0.5rem', marginBottom: '1.2rem' }}>Add New Supplier</div>
            <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={supplierData.name}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact"
                  value={supplierData.contact}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={supplierData.address}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="details"
                  placeholder="Details"
                  value={supplierData.details}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="previousCreditBalance"
                  placeholder="Previous Credit Balance"
                  value={supplierData.previousCreditBalance}
                  onChange={handleChange}
                />
                <div className="button-container">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="add-button" onClick={handleAddSupplier}>Add</button>
                </div>
            </div>
        </div>
      }
    </>
  );
};

export default AddSupplier;
