import axios from 'axios';
import { HistoryRecord, ApiResponse } from '../types';

/**
 * @returns Array of history records
 */
export const fetchHistory = async (): Promise<HistoryRecord[]> => {
  const response = await axios.get<ApiResponse<HistoryRecord[]>>('/api/history');
  return response.data.data;
};

/**
 * @param id - History record ID
 * @returns Single history record
 */
export const fetchHistoryById = async (id: number): Promise<HistoryRecord> => {
  const response = await axios.get<ApiResponse<HistoryRecord>>(`/api/history/${id}`);
  return response.data.data;
};

/**
 * @param id - History record ID to delete
 */
export const deleteHistory = async (id: number): Promise<void> => {
  await axios.delete(`/api/history/${id}`);
};

export default {
  fetchHistory,
  fetchHistoryById,
  deleteHistory
};
