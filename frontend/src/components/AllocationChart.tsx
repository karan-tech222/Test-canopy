import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/AllocationChart.css';

interface ChartData {
  name: string;
  allocation: number;
  investors: number;
}

interface AllocationChartProps {
  data: ChartData[];
}

// Displays allocation amounts and investor counts

const AllocationChart: React.FC<AllocationChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">📊 Recent Allocations</h3>
        <div className="chart-empty">No data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">📊 Recent Allocations</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{ 
              background: 'white', 
              border: '2px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="allocation" fill="#60a5fa" name="Allocation ($)" />
          <Bar dataKey="investors" fill="#34d399" name="Investors" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AllocationChart;
