
import { scope2Categories } from '../mockData';
import { EmissionCalculationProps, YearlyData } from './types';
import { months } from '@/data/ghg/calculator';

export const calculateEmissions = (
  categoryId: string,
  itemId: string,
  formData: YearlyData,
  selectedMonth: string,
  selectedYear: string
): number => {
  if (!formData[selectedYear]?.[selectedMonth]?.[categoryId] || 
      formData[selectedYear][selectedMonth][categoryId][itemId] === undefined) {
    return 0;
  }
  
  const item = scope2Categories
    .find(cat => cat.id === categoryId)
    ?.items.find(i => i.id === itemId);
  
  if (!item) return 0;
  
  const value = formData[selectedYear][selectedMonth][categoryId][itemId];
  return (value * item.emissionFactor) / 1000; // Convert from kg to tonnes
};

export const calculateCategoryTotal = (
  year: string,
  month: string,
  categoryId: string,
  formData: YearlyData
): number => {
  if (!formData[year]?.[month]) return 0;
  
  let total = 0;
  const categoryData = formData[year][month];
  
  const category = scope2Categories.find(cat => cat.id === categoryId);
  if (!category) return 0;
  
  category.items.forEach(item => {
    total += calculateEmissions(categoryId, item.id, formData, month, year) * 1000; // Keep in kg for intermediate calculation
  });
  
  return total;
};

export const calculateMonthlyTotalForAllCategories = (
  year: string, 
  month: string, 
  formData: YearlyData
): number => {
  let total = 0;
  
  scope2Categories.forEach(category => {
    total += calculateCategoryTotal(year, month, category.id, formData);
  });
  
  return total;
};

export const calculateYearTotal = (
  year: string,
  formData: YearlyData
): number => {
  let total = 0;
  
  months.forEach(month => {
    total += calculateMonthlyTotalForAllCategories(year, month, formData);
  });
  
  return total;
};

// Generate trend data for charts
export const generateMonthlyTrendData = (
  selectedYear: string | number,
  selectedCategory: string,
  formData: YearlyData
) => {
  return months.map(month => ({
    name: month,
    value: calculateCategoryTotal(selectedYear.toString(), month, selectedCategory, formData) / 1000, // Convert kg to tonnes
  }));
};

export const generateYearlyTrendData = (
  formData: YearlyData
) => {
  return Object.keys(formData).map(year => ({
    name: year,
    value: calculateYearTotal(year, formData) / 1000, // Convert kg to tonnes
  }));
};

// Pre-populated data for IMR Resources
export const prePopulatedData: YearlyData = {
  '2025': {
    "January": {
      "grid_electricity": {
        "office_buildings": 25600,
        "warehouses": 68400,
        "data_centers": 42000,
        "logistics_hubs": 35800
      },
      "purchased_heat": {
        "district_heating": 18500,
        "steam_purchased": 12300
      }
    },
    "February": {
      "grid_electricity": {
        "office_buildings": 24200,
        "warehouses": 65800,
        "data_centers": 41500,
        "logistics_hubs": 34600
      },
      "purchased_heat": {
        "district_heating": 17800,
        "steam_purchased": 11900
      }
    },
    "March": {
      "grid_electricity": {
        "office_buildings": 23500,
        "warehouses": 63400,
        "data_centers": 40800,
        "logistics_hubs": 33900
      },
      "purchased_heat": {
        "district_heating": 15200,
        "steam_purchased": 10500
      }
    }
  },
  '2024': {
    "January": {
      "grid_electricity": {
        "office_buildings": 26800,
        "warehouses": 70200,
        "data_centers": 43500,
        "logistics_hubs": 37200
      },
      "purchased_heat": {
        "district_heating": 19200,
        "steam_purchased": 13100
      }
    }
  }
};
