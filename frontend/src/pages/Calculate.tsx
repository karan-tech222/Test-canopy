import React, { useState } from 'react';
import { Investor, ProrationInput, ProrationResult } from '../types';
import { calculateProration } from '../services/prorationService';
import { exportToExcel, exportToPDF, exportToWord, copyToClipboard } from '../utils/exportUtils';
import SampleDataButtons from '../components/SampleDataButtons';
import AllocationInput from '../components/AllocationInput';
import InvestorForm from '../components/InvestorForm';
import ActionButtons from '../components/ActionButtons';
import ResultsDisplay from '../components/ResultsDisplay';
import '../styles/Calculate.css';

/**
 * - SampleDataButtons: Quick test scenarios
 * - AllocationInput: Total allocation input
 * - InvestorForm: Investor management with InvestorCard components
 * - ActionButtons: Calculate and reset functionality
 * - ResultsDisplay: Results visualization and export
 */
const Calculate: React.FC = () => {
  const [allocationAmount, setAllocationAmount] = useState<string>('');
  const [investors, setInvestors] = useState<Investor[]>([
    { name: '', requested_amount: 0, average_amount: 0 }
  ]);
  const [results, setResults] = useState<ProrationResult | null>(null);
  const [inputData, setInputData] = useState<ProrationInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('');

  const handleAddInvestor = () => {
    setInvestors([...investors, { name: '', requested_amount: 0, average_amount: 0 }]);
  };

  const handleRemoveInvestor = (index: number) => {
    if (investors.length > 1) {
      setInvestors(investors.filter((_, i) => i !== index));
    }
  };

  const handleInvestorChange = (index: number, field: keyof Investor, value: string | number) => {
    const updated = [...investors];
    updated[index] = { ...updated[index], [field]: value };
    setInvestors(updated);
  };

  const handleCalculate = async () => {
    setError(null);
    setLoading(true);

    // Validation
    const allocation = parseFloat(allocationAmount);
    if (isNaN(allocation) || allocation <= 0) {
      setError('Please enter a valid allocation amount');
      setLoading(false);
      return;
    }

    const validInvestors = investors.filter(inv => inv.name.trim() !== '');
    if (validInvestors.length === 0) {
      setError('Please add at least one investor');
      setLoading(false);
      return;
    }

    for (const inv of validInvestors) {
      if (inv.requested_amount < 0 || inv.average_amount < 0) {
        setError(`Invalid amounts for investor "${inv.name}"`);
        setLoading(false);
        return;
      }
    }

    const input: ProrationInput = {
      allocation_amount: allocation,
      investor_amounts: validInvestors
    };

    try {
      const results = await calculateProration(input);
      setResults(results);
      setInputData(input);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAllocationAmount('');
    setInvestors([{ name: '', requested_amount: 0, average_amount: 0 }]);
    setResults(null);
    setInputData(null);
    setError(null);
  };

  const loadSampleData = (scenario: string) => {
    switch (scenario) {
      case 'simple1':
        setAllocationAmount('100');
        setInvestors([
          { name: 'Investor A', requested_amount: 100, average_amount: 100 },
          { name: 'Investor B', requested_amount: 25, average_amount: 25 }
        ]);
        break;
      case 'simple2':
        setAllocationAmount('200');
        setInvestors([
          { name: 'Investor A', requested_amount: 100, average_amount: 100 },
          { name: 'Investor B', requested_amount: 25, average_amount: 25 }
        ]);
        break;
      case 'complex1':
        setAllocationAmount('100');
        setInvestors([
          { name: 'Investor A', requested_amount: 100, average_amount: 95 },
          { name: 'Investor B', requested_amount: 2, average_amount: 1 },
          { name: 'Investor C', requested_amount: 1, average_amount: 4 }
        ]);
        break;
      case 'complex2':
        setAllocationAmount('100');
        setInvestors([
          { name: 'Investor A', requested_amount: 100, average_amount: 95 },
          { name: 'Investor B', requested_amount: 1, average_amount: 1 },
          { name: 'Investor C', requested_amount: 1, average_amount: 4 }
        ]);
        break;
    }
    setResults(null);
    setInputData(null);
    setError(null);
  };

  const handleExport = (format: string) => {
    if (!results || !inputData) return;

    const exportData = {
      data: results,
      input: inputData
    };

    try {
      switch (format) {
        case 'excel':
          exportToExcel(exportData);
          break;
        case 'pdf':
          exportToPDF(exportData);
          break;
        case 'word':
          exportToWord(exportData);
          break;
        case 'clipboard':
          copyToClipboard(exportData).then((success) => {
            setCopyStatus(success ? '✓ Copied!' : '✗ Failed');
            setTimeout(() => setCopyStatus(''), 2000);
          });
          break;
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const totalRequested = investors.reduce((sum, inv) => sum + (inv.requested_amount || 0), 0);

  return (
    <div className="calculate-container">
      <div className="calculate-layout">
        <div className="input-section">
          <SampleDataButtons onLoadSample={loadSampleData} />
          
          <AllocationInput 
            value={allocationAmount}
            onChange={setAllocationAmount}
          />

          <InvestorForm
            investors={investors}
            onAdd={handleAddInvestor}
            onRemove={handleRemoveInvestor}
            onChange={handleInvestorChange}
            totalRequested={totalRequested}
          />

          <ActionButtons
            onCalculate={handleCalculate}
            onReset={handleReset}
            loading={loading}
            error={error}
          />
        </div>
        
        <ResultsDisplay
          results={results}
          inputData={inputData}
          onExport={handleExport}
          copyStatus={copyStatus}
        />
      </div>
    </div>
  );
};

export default Calculate;
