import api from './api';
import { Project, ProjectCreateData, ProjectListResponse, ProjectUpdateData } from '../types/project';

interface ProjectFilters {
  page?: number;
  per_page?: number;
  region?: string;
  status?: string;
  category?: string;
  salesperson?: string;
  brand?: string;
}

export const projectService = {
  async getProjects(filters: ProjectFilters = {}): Promise<ProjectListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const { data } = await api.get<ProjectListResponse>(`/projects/?${params.toString()}`);
    return data;
  },

  async getProject(id: number): Promise<Project> {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },

  async createProject(projectData: ProjectCreateData): Promise<Project> {
    const { data } = await api.post<Project>('/projects/', projectData);
    return data;
  },

  async updateProject(id: number, projectData: ProjectUpdateData): Promise<Project> {
    const { data } = await api.put<Project>(`/projects/${id}`, projectData);
    return data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async exportCSV(): Promise<Blob> {
    const { data } = await api.get('/projects/export', { responseType: 'blob' });
    return data;
  },
};
