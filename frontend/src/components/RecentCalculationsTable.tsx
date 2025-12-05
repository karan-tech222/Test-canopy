import React from 'react';
import '../styles/RecentCalculationsTable.css';

interface Calculation {
  id: number;
  allocation_amount: number;
  investor_count: number;
  created_at: string;
}

interface RecentCalculationsTableProps {
  calculations: Calculation[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

// Displays the most recent calculations in a table format

const RecentCalculationsTable: React.FC<RecentCalculationsTableProps> = ({
  calculations,
  formatCurrency,
  formatDate
}) => {
  if (calculations.length === 0) {
    return (
      <div className="recent-table-card">
        <h3 className="table-title">📋 Recent Calculations</h3>
        <div className="table-empty">No calculations yet</div>
      </div>
    );
  }

  return (
    <div className="recent-table-card">
      <h3 className="table-title">📋 Recent Calculations</h3>
      <div className="table-wrapper">
        <table className="recent-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Allocation</th>
              <th>Investors</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calc) => (
              <tr key={calc.id}>
                <td className="calc-id">#{calc.id}</td>
                <td className="calc-amount">{formatCurrency(calc.allocation_amount)}</td>
                <td className="calc-investors">{calc.investor_count}</td>
                <td className="calc-date">{formatDate(calc.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCalculationsTable;
