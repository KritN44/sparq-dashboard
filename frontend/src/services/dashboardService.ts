import api from './api';
import { DashboardMetrics } from '../types/project';

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const { data } = await api.get<DashboardMetrics>('/dashboard/metrics');
    return data;
  },
};
