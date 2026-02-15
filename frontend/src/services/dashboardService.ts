import api from './api';
import { DashboardMetrics } from '../types/project';

interface DateRange {
  start_date?: string;
  end_date?: string;
}

export const dashboardService = {
  async getMetrics(dateRange?: DateRange): Promise<DashboardMetrics> {
    const params = new URLSearchParams();
    if (dateRange?.start_date) params.append('start_date', dateRange.start_date);
    if (dateRange?.end_date) params.append('end_date', dateRange.end_date);
    const query = params.toString();
    const { data } = await api.get<DashboardMetrics>(`/dashboard/metrics${query ? `?${query}` : ''}`);
    return data;
  },
};
