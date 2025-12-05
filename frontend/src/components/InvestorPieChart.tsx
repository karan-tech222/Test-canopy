import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../styles/InvestorPieChart.css';

interface PieData {
  name: string;
  value: number;
}

interface InvestorPieChartProps {
  data: PieData[];
  colors: string[];
}

// Displays investor breakdown in pie chart format
const InvestorPieChart: React.FC<InvestorPieChartProps> = ({ data, colors }) => {
  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">🥧 Investor Distribution</h3>
        <div className="chart-empty">No data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">🥧 Investor Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestorPieChart;
