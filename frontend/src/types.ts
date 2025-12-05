/**
 * TypeScript Type Definitions
 * 
 * Core types for the Allocation Proration application
 */

// Investor input type
export interface Investor {
  name: string;
  requested_amount: number;
  average_amount: number;
}

// Proration input type
export interface ProrationInput {
  allocation_amount: number;
  investor_amounts: Investor[];
}

// Proration result type
export interface ProrationResult {
  [investorName: string]: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

// History record type
export interface HistoryRecord {
  id: number;
  allocation_amount: number;
  total_allocated: number;
  investor_count: number;
  utilization_rate: number;
  input_data: ProrationInput;
  result_data: ProrationResult;
  created_at: string;
  notes?: string;
}

// Dashboard statistics type
export interface DashboardStats {
  total_calculations: number;
  total_allocation_processed: number;
  total_allocated_amount: number;
  avg_utilization_rate: number;
  last_calculation_date: string;
  recent_calculations: RecentCalculation[];
}

// Recent calculation for dashboard
export interface RecentCalculation {
  id: number;
  allocation_amount: number;
  investor_count: number;
  utilization_rate: number;
  created_at: string;
}

// History list response
export interface HistoryListResponse {
  data: HistoryRecord[];
  total: number;
  limit: number;
  offset: number;
}

// Chart data point
export interface ChartDataPoint {
  name: string;
  value: number;
}

// Navigation route
export interface Route {
  path: string;
  name: string;
  icon: string;
}
