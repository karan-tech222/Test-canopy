import React from 'react';
import { Investor } from '../types';
import InvestorCard from './InvestorCard';
import '../styles/InvestorForm.css';

interface InvestorFormProps {
  investors: Investor[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof Investor, value: string | number) => void;
  totalRequested: number;
}


// Manages the list of investors with add/remove functionality

const InvestorForm: React.FC<InvestorFormProps> = ({
  investors,
  onAdd,
  onRemove,
  onChange,
  totalRequested
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`;
  };

  return (
    <div className="investor-form-card">
      <div className="section-header">
        <h2 className="section-title">👥 Investors</h2>
        <button onClick={onAdd} className="add-btn">
          + Add Investor
        </button>
      </div>

      <div className="investors-list">
        {investors.map((investor, index) => (
          <InvestorCard
            key={index}
            investor={investor}
            index={index}
            canRemove={investors.length > 1}
            onRemove={() => onRemove(index)}
            onChange={(field, value) => onChange(index, field, value)}
          />
        ))}
      </div>

      <div className="summary-bar">
        <div className="summary-item">
          <span>Total Requested:</span>
          <strong>{formatCurrency(totalRequested)}</strong>
        </div>
      </div>
    </div>
  );
};

export default InvestorForm;
