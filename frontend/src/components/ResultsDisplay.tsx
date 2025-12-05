import React from 'react';
import { ProrationInput, ProrationResult } from '../types';
import '../styles/ResultsDisplay.css';

interface ResultsDisplayProps {
  results: ProrationResult | null;
  inputData: ProrationInput | null;
  onExport: (format: string) => void;
  copyStatus: string;
}

// Shows calculation results with export options

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  inputData,
  onExport,
  copyStatus
}) => {
  if (!results || !inputData) {
    return (
      <div className="results-section">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Results Yet</h3>
          <p>Enter allocation details and click Calculate to see results</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`;
  };

  const totalAllocated = Object.values(results).reduce((sum, val) => sum + val, 0);
  const investorCount = Object.keys(results).length;

  return (
    <div className="results-section">
      <div className="results-card">
        <h2 className="section-title">📊 Results</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Allocated</div>
            <div className="stat-value">{formatCurrency(totalAllocated)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Investors</div>
            <div className="stat-value">{investorCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Utilization</div>
            <div className="stat-value">
              {((totalAllocated / inputData.allocation_amount) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="results-table-wrapper">
          <table className="results-table">
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
              {Object.entries(results).map(([name, allocated]) => {
                const investor = inputData.investor_amounts.find(inv => inv.name === name);
                if (!investor) return null;

                const fulfillment = (allocated / investor.requested_amount) * 100;
                const isFull = allocated >= investor.requested_amount;

                return (
                  <tr key={name}>
                    <td className="investor-name">{name}</td>
                    <td>{formatCurrency(investor.requested_amount)}</td>
                    <td>{formatCurrency(investor.average_amount)}</td>
                    <td className="allocated-amount">{formatCurrency(allocated)}</td>
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

        <div className="export-section">
          <div className="export-label">📥 Export Results:</div>
          <div className="export-buttons">
            <button onClick={() => onExport('excel')} className="export-btn excel">
              📊 Excel
            </button>
            <button onClick={() => onExport('pdf')} className="export-btn pdf">
              📄 PDF
            </button>
            <button onClick={() => onExport('word')} className="export-btn word">
              📝 Word
            </button>
            <button onClick={() => onExport('clipboard')} className="export-btn clipboard">
              {copyStatus || '📋 Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
