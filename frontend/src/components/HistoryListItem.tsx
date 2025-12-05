import React from 'react';
import '../styles/HistoryListItem.css';

interface HistoryListItemProps {
  id: number;
  allocationAmount: number;
  investorCount: number;
  createdAt: string;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

// Individual record in the history list

const HistoryListItem: React.FC<HistoryListItemProps> = ({
  id,
  allocationAmount,
  investorCount,
  createdAt,
  isSelected,
  isDeleting,
  onSelect,
  onDelete,
  formatCurrency,
  formatDate
}) => {
  return (
    <div className={`history-item ${isSelected ? 'selected' : ''}`}>
      <div className="history-item-content" onClick={onSelect}>
        <div className="history-item-header">
          <span className="history-id">#{id}</span>
          <span className="history-date">{formatDate(createdAt)}</span>
        </div>
        <div className="history-item-details">
          <div className="detail-row">
            <span className="detail-label">💰 Allocation:</span>
            <span className="detail-value">{formatCurrency(allocationAmount)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">👥 Investors:</span>
            <span className="detail-value">{investorCount}</span>
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={isDeleting}
        className="delete-btn"
        title="Delete record"
      >
        {isDeleting ? '⏳' : '🗑️'}
      </button>
    </div>
  );
};

export default HistoryListItem;
