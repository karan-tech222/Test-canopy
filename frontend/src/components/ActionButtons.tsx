import React from 'react';
import '../styles/ActionButtons.css';

interface ActionButtonsProps {
  onCalculate: () => void;
  onReset: () => void;
  loading: boolean;
  error: string | null;
}

// Calculate and Reset buttons with error display

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCalculate,
  onReset,
  loading,
  error
}) => {
  return (
    <div className="action-section">
      <div className="action-buttons">
        <button
          onClick={onCalculate}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Calculating...' : 'Calculate Proration'}
        </button>
        <button onClick={onReset} className="btn-secondary">
          Reset
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
