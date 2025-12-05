import axios from 'axios';
import { DashboardStats, ApiResponse } from '../types';

/**
 * @returns Dashboard statistics including calculations, allocations, and charts data
 */
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get<ApiResponse<DashboardStats>>('/api/dashboard/stats');
  return response.data.data;
};

export default {
  fetchDashboardStats
};
