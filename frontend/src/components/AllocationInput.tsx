import React from 'react';
import '../styles/AllocationInput.css';

interface AllocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

// Handles the total allocation amount input

const AllocationInput: React.FC<AllocationInputProps> = ({ value, onChange }) => {
  return (
    <div className="allocation-input-card">
      <h2 className="section-title">💰 Allocation Amount</h2>
      <div className="form-group">
        <label>Total Allocation</label>
        <div className="input-with-icon">
          <span className="input-icon">$</span>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter total allocation amount"
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
};

export default AllocationInput;
