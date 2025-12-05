import React from 'react';
import '../styles/SampleDataButtons.css';

interface SampleDataButtonsProps {
  onLoadSample: (scenario: string) => void;
}

// Quick test scenario buttons for loading predefined data

const SampleDataButtons: React.FC<SampleDataButtonsProps> = ({ onLoadSample }) => {
  const scenarios = [
    { id: 'simple1', label: 'Simple 1', description: 'Basic proration with limited allocation' },
    { id: 'simple2', label: 'Simple 2', description: 'Sufficient allocation for all requests' },
    { id: 'complex1', label: 'Complex 1', description: 'Mixed request/average ratios with caps' },
    { id: 'complex2', label: 'Complex 2', description: 'Edge case with small requests' }
  ];

  return (
    <div className="sample-data-section">
      <label className="sample-label">Quick Test Scenarios:</label>
      <div className="sample-buttons">
        {scenarios.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => onLoadSample(scenario.id)}
            className="sample-btn"
            title={scenario.description}
          >
            {scenario.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleDataButtons;
