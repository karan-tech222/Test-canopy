import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calculate from './pages/Calculate';
import History from './pages/History';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculate" element={<Calculate />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
