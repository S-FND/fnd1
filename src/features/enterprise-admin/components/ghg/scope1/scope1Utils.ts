
import { scope1Categories } from '../mockData';
import { YearlyData } from './types';

// Calculate emissions for a specific item
export const calculateEmissions = (
  categoryId: string, 
  itemId: string, 
  formData: YearlyData, 
  selectedMonth: string,
  selectedYear: string
): number => {
  if (!formData[selectedYear]?.[selectedMonth]?.[itemId]) {
    return 0;
  }
  
  const item = scope1Categories
    .find(cat => cat.id === categoryId)
    ?.items.find(i => i.id === itemId);
  
  if (!item) return 0;
  
  return formData[selectedYear][selectedMonth][itemId] * item.emissionFactor;
};

// Calculate total for a specific category in a month
export const calculateCategoryTotal = (
  year: string, 
  month: string, 
  categoryId: string,
  formData: YearlyData
): number => {
  if (!formData[year] || !formData[year][month]) return 0;

  let total = 0;
  const categoryItems = scope1Categories.find(cat => cat.id === categoryId)?.items || [];
  
  categoryItems.forEach(item => {
    if (formData[year][month][item.id]) {
      total += formData[year][month][item.id] * item.emissionFactor;
    }
  });
  
  return total;
};

// Calculate total for all categories in a year
export const calculateYearTotal = (year: string, formData: YearlyData): number => {
  if (!formData[year]) return 0;
  
  let total = 0;
  
  Object.keys(formData[year]).forEach(month => {
    Object.keys(formData[year][month]).forEach(itemId => {
      // Find the emission factor for this item
      for (const category of scope1Categories) {
        const item = category.items.find(i => i.id === itemId);
        if (item) {
          total += formData[year][month][itemId] * item.emissionFactor;
          break;
        }
      }
    });
  });
  
  return total;
};

// Calculate total for all categories in the current month
export const calculateMonthlyTotalForAllCategories = (
  selectedYear: string,
  selectedMonth: string,
  formData: YearlyData
): number => {
  if (!formData[selectedYear] || !formData[selectedYear][selectedMonth]) return 0;
  
  let total = 0;
  
  Object.keys(formData[selectedYear][selectedMonth]).forEach(itemId => {
    // Find the emission factor for this item
    for (const category of scope1Categories) {
      const item = category.items.find(i => i.id === itemId);
      if (item) {
        total += formData[selectedYear][selectedMonth][itemId] * item.emissionFactor;
        break;
      }
    }
  });
  
  return total;
};
