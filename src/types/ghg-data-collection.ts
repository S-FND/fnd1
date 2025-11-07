// Types for GHG data collection system

export type MeasurementFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';

export type ActivityDataStatus = 'pending' | 'submitted' | 'verified' | 'approved';

export interface GHGSource {
  id: string;
  portfolio_company_id: string;
  facility_id?: string;
  
  // Source identification
  source_name: string;
  source_type: string;
  scope: string;
  category: string;
  description?: string;
  
  // Activity details
  activity_unit: string;
  measurement_frequency: MeasurementFrequency;
  
  // Emission factors
  emission_factor?: number;
  emission_factor_source?: string;
  emission_factor_unit?: string;
  
  // Calculation
  calculation_methodology?: string;
  
  // Assignment
  assigned_data_collectors?: string[];
  assigned_verifiers?: string[];
  
  // Status
  is_active: boolean;
  reporting_period: string;
  
  // Metadata
  created_by: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface GHGActivityData {
  id: string;
  source_id: string;
  portfolio_company_id: string;
  
  // Period information
  reporting_period: string;
  period_name: string;
  period_start_date?: string;
  period_end_date?: string;
  
  // Activity data
  activity_value: number;
  activity_unit: string;
  
  // Emissions calculation
  emission_factor: number;
  emission_factor_source?: string;
  calculated_emissions: number;
  calculated_emissions_tco2e?: number;
  
  // Status tracking
  status: ActivityDataStatus;
  data_collection_date?: string;
  
  // Assignment and verification
  collected_by?: string;
  verified_by?: string;
  verified_at?: string;
  
  // Additional info
  data_source?: string;
  evidence_urls?: string[];
  notes?: string;
  
  // Metadata
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PeriodDataEntry {
  period_name: string;
  activity_value: number;
  notes?: string;
}

export interface DataCollectionSchedule {
  source: GHGSource;
  periods: {
    period_name: string;
    status: ActivityDataStatus;
    activity_value?: number;
    data_entry_id?: string;
    is_due: boolean;
  }[];
  completion_percentage: number;
}

export interface BulkImportRow {
  source_id: string;
  period_name: string;
  activity_value: number;
  notes?: string;
}

// Helper function to generate period names based on frequency
export const generatePeriodNames = (frequency: MeasurementFrequency): string[] => {
  switch (frequency) {
    case 'Quarterly':
      return ['Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)'];
    case 'Monthly':
      return ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    case 'Annually':
      return ['FY 2024-25'];
    case 'Weekly':
      return Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
    case 'Daily':
      return Array.from({ length: 365 }, (_, i) => `Day ${i + 1}`);
    default:
      return [];
  }
};
