import React, { useState } from 'react';
import '../CSS/addtaxslab.css';

const AddExpense = ({ isOpen, onClose, onAdd }) => {
  const [expenseData, setExpenseData] = useState({
    vendorName: '',
    date: '',
    totalAmount: '',
    expenseName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddExpense = () => {
    onAdd(expenseData);
    setExpenseData({
        vendorName: '',
        date: '',
        totalAmount: '',
        expenseName: ''
    });
    onClose();
  };

  return (
    <>
      {isOpen &&
        <div className="modal-overlay">
            <div className='fw-bold' style={{ fontWeight: "bold", fontSize: '1.5rem', padding: '0.5rem', marginBottom: '1.2rem' }}>Add New Expense</div>
            <div>
                <input
                  type="text"
                  name="vendorName"
                  placeholder="Vendor Name"
                  value={expenseData.vendorName}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="date"
                  placeholder="Date"
                  value={expenseData.date}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="totalAmount"
                  placeholder="Total Amount"
                  value={expenseData.totalAmount}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="expenseName"
                  placeholder="Expense Name"
                  value={expenseData.expenseName}
                  onChange={handleChange}
                />
                <div className="button-container">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="add-button" onClick={handleAddExpense}>Add</button>
                </div>
            </div>
        </div>
      }
    </>
  );
};

export default AddExpense;
