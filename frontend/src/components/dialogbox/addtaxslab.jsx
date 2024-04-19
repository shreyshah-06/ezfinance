import React, { useState } from 'react';
import '../CSS/addtaxslab.css';

const AddTaxSlab = ({ isOpen, onClose, onAdd }) => {
  const [taxRate, setTaxRate] = useState('');
  const [taxSlabName, setTaxSlabName] = useState('');

  const handleAddTaxSlab = () => {
    const taxSlab = {
      name: taxSlabName,
      rate: taxRate
    };
    onAdd(taxSlab);
    setTaxRate('');
    setTaxSlabName('');
  };

  return (
    <>
      {isOpen &&
        <div className="modal-overlay">
            <div className='fw-bold' style={{ fontWeight: "bold", fontSize: '1.5rem', padding: '0.5rem', marginBottom: '1.2rem' }}>Add New Category</div>
            <div>
                <input
                  type="text"
                  placeholder="Tax Slab Name"
                  value={taxSlabName}
                  onChange={(e) => setTaxSlabName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Tax Rate (%)"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
                <div className="button-container">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="add-button" onClick={handleAddTaxSlab}>Add</button>
                </div>
            </div>
        </div>
      }
    </>
  );
};

export default AddTaxSlab;
