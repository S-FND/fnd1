export type PortfolioRole = 
  | 'portfolio_company_admin'
  | 'portfolio_team_editor' 
  | 'portfolio_team_viewer'
  | 'supplier'
  | 'stakeholder'
  | 'super_admin';

export interface PortfolioCompany {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
  is_approved?: boolean;
  approval_status?: string;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
  access_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  portfolio_company_id: string;
  role: PortfolioRole;
  email: string;
  full_name: string | null;
  is_active: boolean;
  invite_code: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  portfolio_company?: PortfolioCompany;
}

export interface AutosaveDraft {
  id: string;
  user_id: string;
  portfolio_company_id: string;
  entity_type: string;
  entity_id: string | null;
  form_data: Record<string, any>;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  portfolio_company_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  request_id: string | null;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role: PortfolioRole;
  resource: string;
  action: string;
  granted: boolean;
  created_at: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AutosaveState {
  status: SaveStatus;
  lastSaved: Date | null;
  error: string | null;
  isDirty: boolean;
}