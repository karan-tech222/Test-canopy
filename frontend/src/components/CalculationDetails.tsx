import React from 'react';
import '../styles/CalculationDetails.css';

interface Investor {
  name: string;
  requested_amount: number;
  average_amount: number;
}

interface Results {
  [key: string]: number;
}

interface CalculationDetailsProps {
  allocationAmount: number;
  investors: Investor[];
  results: Results;
  createdAt: string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

// Calculation Details Component

const CalculationDetails: React.FC<CalculationDetailsProps> = ({
  allocationAmount,
  investors,
  results,
  createdAt,
  formatCurrency,
  formatDate
}) => {
  const totalAllocated = Object.values(results).reduce((sum, val) => sum + val, 0);
  const utilization = (totalAllocated / allocationAmount) * 100;

  return (
    <div className="details-card">
      <h3 className="details-title">📋 Calculation Details</h3>
      
      {/* Summary */}
      <div className="details-summary">
        <div className="summary-row">
          <span className="summary-label">Date:</span>
          <span className="summary-value">{formatDate(createdAt)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Allocation:</span>
          <span className="summary-value allocation">{formatCurrency(allocationAmount)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Allocated:</span>
          <span className="summary-value allocated">{formatCurrency(totalAllocated)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Utilization:</span>
          <span className="summary-value utilization">{utilization.toFixed(1)}%</span>
        </div>
      </div>

      {/* Results Table */}
      <div className="details-section">
        <h4 className="section-subtitle">💰 Allocation Results</h4>
        <table className="details-table">
          <thead>
            <tr>
              <th>Investor</th>
              <th>Requested</th>
              <th>Average</th>
              <th>Allocated</th>
              <th>Fulfillment</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => {
              const allocated = results[investor.name] || 0;
              const fulfillment = (allocated / investor.requested_amount) * 100;
              const isFull = allocated >= investor.requested_amount;

              return (
                <tr key={investor.name}>
                  <td className="investor-name">{investor.name}</td>
                  <td>{formatCurrency(investor.requested_amount)}</td>
                  <td>{formatCurrency(investor.average_amount)}</td>
                  <td className="allocated-value">{formatCurrency(allocated)}</td>
                  <td>
                    <span className={`fulfillment-badge ${isFull ? 'full' : 'prorated'}`}>
                      {fulfillment.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalculationDetails;
