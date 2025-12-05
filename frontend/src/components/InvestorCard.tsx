import React from 'react';
import { Investor } from '../types';
import '../styles/InvestorCard.css';

interface InvestorCardProps {
  investor: Investor;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (field: keyof Investor, value: string | number) => void;
}

// Displays and edits a single investor's information

const InvestorCard: React.FC<InvestorCardProps> = ({
  investor,
  index,
  canRemove,
  onRemove,
  onChange
}) => {
  return (
    <div className="investor-card">
      <div className="investor-header">
        <span className="investor-number">#{index + 1}</span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="remove-btn"
            title="Remove investor"
          >
            ✕
          </button>
        )}
      </div>

      <div className="form-group">
        <label>Investor Name</label>
        <input
          type="text"
          value={investor.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter investor name"
          className="input-field"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Requested Amount</label>
          <div className="input-with-icon">
            <span className="input-icon">$</span>
            <input
              type="number"
              value={investor.requested_amount || ''}
              onChange={(e) => onChange('requested_amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="input-field"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Average Amount</label>
          <div className="input-with-icon">
            <span className="input-icon">$</span>
            <input
              type="number"
              value={investor.average_amount || ''}
              onChange={(e) => onChange('average_amount', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorCard;
