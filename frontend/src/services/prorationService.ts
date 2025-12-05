import axios from 'axios';
import { ProrationInput, ProrationResult, ApiResponse } from '../types';

/**
 * @param input - Proration input data
 * @returns Proration results
 */
export const calculateProration = async (input: ProrationInput): Promise<ProrationResult> => {
  const response = await axios.post<ApiResponse<ProrationResult>>('/api/prorate', input);
  return response.data.data;
};

export default {
  calculateProration
};
