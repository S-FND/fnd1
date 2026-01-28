import { MeasurementFrequency } from '@/types/scope1-ghg';

export interface PeriodData {
  period: string;
  value: number;
}

// Generate CSV template based on frequency
export const generateCSVTemplate = (
  frequency: MeasurementFrequency,
  valueColumnName: string = 'Activity Value',
  unit: string = ''
): string => {
  let periods: string[] = [];
  
  switch (frequency) {
    case 'Quarterly':
      periods = ['Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)'];
      break;
    case 'Monthly':
      periods = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
      break;
    case 'Annually':
      periods = ['FY 2024-25'];
      break;
    case 'Weekly':
      // Generate 52 weeks
      periods = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
      break;
    case 'Daily':
      // Generate 365 days
      periods = Array.from({ length: 365 }, (_, i) => `Day ${i + 1}`);
      break;
    default:
      periods = [];
  }
  
  // Create CSV header
  const unitSuffix = unit ? ` (${unit})` : '';
  const header = `Period,${valueColumnName}${unitSuffix},Notes`;
  
  // Create CSV rows with empty values
  const rows = periods.map(period => `"${period}",,`);
  
  return [header, ...rows].join('\n');
};

// Parse CSV data into period array
export const parseCSVData = (csvText: string): PeriodData[] => {
  const lines = csvText.trim().split('\n');
  
  // Skip header
  const dataLines = lines.slice(1);
  
  const periodData: PeriodData[] = [];
  
  dataLines.forEach((line, index) => {
    // Handle quoted values
    const matches = line.match(/(?:"([^"]*?)"|([^,]+))(?:,|$)/g);
    if (!matches || matches.length < 2) return;
    
    const period = matches[0].replace(/[",]/g, '').trim();
    const valueStr = matches[1].replace(/[",]/g, '').trim();
    const value = parseFloat(valueStr);
    
    if (period && !isNaN(value)) {
      periodData.push({ period, value });
    }
  });
  
  return periodData;
};

// Export data to CSV
export const exportToCSV = (
  data: PeriodData[],
  valueColumnName: string = 'Activity Value',
  unit: string = '',
  filename: string = 'period-data.csv'
): void => {
  const unitSuffix = unit ? ` (${unit})` : '';
  const header = `Period,${valueColumnName}${unitSuffix}`;
  
  const rows = data.map(item => 
    `"${item.period}",${item.value}`
  );
  
  const csvContent = [header, ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Download CSV template
export const downloadCSVTemplate = (
  frequency: MeasurementFrequency,
  valueColumnName: string = 'Activity Value',
  unit: string = '',
  filename: string = 'template.csv'
): void => {
  const csvContent = generateCSVTemplate(frequency, valueColumnName, unit);
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Validate imported data matches expected frequency
export const validateFrequencyData = (
  data: PeriodData[],
  frequency: MeasurementFrequency
): { valid: boolean; message: string } => {
  const expectedCounts: Record<MeasurementFrequency, number> = {
    'Quarterly': 4,
    'Monthly': 12,
    'Annually': 1,
    'Weekly': 52,
    'Daily': 365,
  };
  
  const expected = expectedCounts[frequency];
  
  if (data.length === 0) {
    return { valid: false, message: 'No valid data found in CSV' };
  }
  
  if (data.length !== expected) {
    return { 
      valid: false, 
      message: `Expected ${expected} periods for ${frequency} frequency, but found ${data.length}` 
    };
  }
  
  // Check for negative values
  const hasNegative = data.some(item => item.value < 0);
  if (hasNegative) {
    return { valid: false, message: 'Activity values cannot be negative' };
  }
  
  return { valid: true, message: 'Data is valid' };
};