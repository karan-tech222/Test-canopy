import React, { useEffect, useState } from 'react';
import { DashboardStats } from '../types';
import { fetchDashboardStats as fetchStats } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import AllocationChart from '../components/AllocationChart';
import InvestorPieChart from '../components/InvestorPieChart';
import RecentCalculationsTable from '../components/RecentCalculationsTable';
import '../styles/Dashboard.css';

const COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f87171'];

/**
 * - StatCard: Overview statistics cards
 * - AllocationChart: Bar chart of recent allocations
 * - InvestorPieChart: Pie chart of investor distribution
 * - RecentCalculationsTable: Table of recent calculations
 */
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await fetchStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-error">
        <p>❌ {error || 'No data available'}</p>
        <button onClick={fetchDashboardStats} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }
  const recentChartData = stats.recent_calculations.map((calc, index) => ({
    name: `Calc ${index + 1}`,
    allocation: calc.allocation_amount,
    investors: calc.investor_count
  }));

  const investorPieData = stats.recent_calculations
    .slice(0, 5)
    .map((calc) => ({
      name: `Record ${calc.id}`,
      value: calc.investor_count
    }));

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <StatCard
          icon="📊"
          value={stats.total_calculations || 0}
          label="Total Calculations"
          color="blue"
        />
        <StatCard
          icon="💰"
          value={formatCurrency(stats.total_allocation_processed)}
          label="Total Processed"
          color="green"
        />
        <StatCard
          icon="👥"
          value={investorPieData.reduce((sum, item) => sum + item.value, 0)}
          label="Total Investors"
          color="orange"
        />
      </div>
      <div className="charts-grid">
        <AllocationChart data={recentChartData} />
        <InvestorPieChart data={investorPieData} colors={COLORS} />
      </div>
      <RecentCalculationsTable
        calculations={stats.recent_calculations}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Dashboard;
