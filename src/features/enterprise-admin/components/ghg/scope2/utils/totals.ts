
import { YearlyData } from '../types';
import { sumCategoryEmissions } from './calculations';

/**
 * Calculate total emissions for the selected month
 */
export const calculateMonthlyTotal = (
  formData: YearlyData,
  selectedMonth: string,
  selectedYear: string
): number => {
  let total = 0;
  
  const categories = formData?.[selectedYear]?.[selectedMonth] || {};
  Object.keys(categories).forEach(categoryId => {
    total += sumCategoryEmissions(categoryId, formData, selectedMonth, selectedYear);
  });
  
  return total;
};

/**
 * Calculate total emissions for the selected year
 */
export const calculateYearlyTotal = (
  formData: YearlyData,
  selectedYear: string
): number => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  let total = 0;
  months.forEach(month => {
    total += calculateMonthlyTotal(formData, month, selectedYear);
  });
  
  return total;
};
