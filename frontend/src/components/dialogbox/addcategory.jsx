import React, { useState } from 'react';
import '../CSS/addcategory.css';

const AddCategory = ({ isOpen, onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = () => {
    onAdd(categoryName);
    setCategoryName('');
  };

  return (
    <>
      {isOpen &&
        <div className="modal-overlay">
            <div className='fw-bold' style={{fontWeight:"bold",fontSize:'1.5rem',padding:'0.5rem',marginBottom:'1.2rem'}}>Add New Category</div>
            <div>
                <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                />
                <div className="button-container">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="add-button" onClick={handleAddCategory}>Add</button>
                </div>
            </div>
          {/* </div> */}
        </div>
      }
    </>
  );
};

export default AddCategory;
