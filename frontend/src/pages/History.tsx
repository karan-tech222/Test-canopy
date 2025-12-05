import React, { useEffect, useState } from 'react';
import { HistoryRecord } from '../types';
import { fetchHistory, deleteHistory } from '../services/historyService';
import HistoryListItem from '../components/HistoryListItem';
import CalculationDetails from '../components/CalculationDetails';
import '../styles/History.css';

/** 
 * - HistoryListItem: Individual history
 * - CalculationDetails: Detailed view of selected calculation
 */
const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchHistory();
      setHistory(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch history:', err);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      setDeleting(id);
      await deleteHistory(id);
      setHistory(history.filter(record => record.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    } catch (err: any) {
      console.error('Failed to delete:', err);
      alert('Failed to delete record');
    } finally {
      setDeleting(null);
    }
  };

  const handleViewDetails = (record: HistoryRecord) => {
    setSelectedRecord(record);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="history-loading">
        <div className="loading-spinner"></div>
        <p>Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-error">
        <p>❌ {error}</p>
        <button onClick={loadHistory} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-layout">
        {/* History List - Component Based */}
        <div className="history-list-section">
          <div className="section-header">
            <h2>📜 Calculation History</h2>
            <span className="record-count">{history.length} records</span>
          </div>

          {history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No History Yet</h3>
              <p>Your calculation history will appear here</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((record) => (
                <HistoryListItem
                  key={record.id}
                  id={record.id}
                  allocationAmount={record.allocation_amount}
                  investorCount={record.investor_count}
                  createdAt={record.created_at}
                  isSelected={selectedRecord?.id === record.id}
                  isDeleting={deleting === record.id}
                  onSelect={() => handleViewDetails(record)}
                  onDelete={() => handleDelete(record.id)}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Panel - Component Based (Only Show Details) */}
        {selectedRecord ? (
          <CalculationDetails
            allocationAmount={selectedRecord.allocation_amount}
            investors={selectedRecord.input_data.investor_amounts}
            results={selectedRecord.result_data}
            createdAt={selectedRecord.created_at}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        ) : (
          <div className="details-placeholder">
            <div className="placeholder-icon">📋</div>
            <h3>Select a Record</h3>
            <p>Click on a history item to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
