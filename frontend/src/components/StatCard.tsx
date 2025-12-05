import React from 'react';
import '../styles/StatCard.css';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

// Displays a single statistic with icon, value, and label

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
