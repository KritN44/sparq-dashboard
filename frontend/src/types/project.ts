export type Region = 'TN' | 'Kerala' | 'AP' | 'Telangana' | 'Gujarat' | 'Delhi' | 'Mumbai';

export type Category = 'FMCG' | 'Industrial Goods';

export type ProjectStatus =
  | 'Brand description generated'
  | 'Deck in progress'
  | 'Deck Shared'
  | 'Client approved'
  | 'Client rejected'
  | 'Video production in progress'
  | 'Video submitted for review'
  | 'Video approved'
  | 'Campaign signed up';

export interface Project {
  id: number;
  user_id: number;
  region: Region;
  city: string;
  salesperson_name: string;
  brand_name: string;
  category: Category;
  status: ProjectStatus;
  created_at: string;
  updated_at: string | null;
}

export interface ProjectCreateData {
  region: Region;
  city: string;
  salesperson_name: string;
  brand_name: string;
  category: Category;
  status?: ProjectStatus;
}

export interface ProjectUpdateData {
  region?: Region;
  city?: string;
  salesperson_name?: string;
  brand_name?: string;
  category?: Category;
  status?: ProjectStatus;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  per_page: number;
}

export interface RegionCount {
  region: string;
  count: number;
}

export interface DashboardMetrics {
  total_projects: number;
  clients_by_region: RegionCount[];
  briefs_approved: number;
  videos_generated: number;
  videos_approved: number;
  campaigns_completed: number;
}

export const REGIONS: Region[] = ['TN', 'Kerala', 'AP', 'Telangana', 'Gujarat', 'Delhi', 'Mumbai'];

export const CATEGORIES: Category[] = ['FMCG', 'Industrial Goods'];

export const PROJECT_STATUSES: ProjectStatus[] = [
  'Brand description generated',
  'Deck in progress',
  'Deck Shared',
  'Client approved',
  'Client rejected',
  'Video production in progress',
  'Video submitted for review',
  'Video approved',
  'Campaign signed up',
];
