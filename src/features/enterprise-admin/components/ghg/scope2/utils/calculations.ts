
import { EmissionCalculationProps, YearlyData } from '../types';

/**
 * Calculate emissions for a specific input
 */
export const calculateEmissions = ({ 
  categoryId, 
  itemId, 
  formData, 
  selectedMonth, 
  selectedYear 
}: EmissionCalculationProps): number => {
  const value = formData?.[selectedYear]?.[selectedMonth]?.[categoryId]?.[itemId] || 0;
  
  // Emission factors would normally be sourced from a database or API
  // These are placeholder values
  const emissionFactors: Record<string, Record<string, number>> = {
    electricity_grid: {
      office_buildings: 0.5,
      warehouses: 0.4,
      data_centers: 0.6,
      logistics_hubs: 0.45
    },
    thermal_energy: {
      district_heating: 0.3,
      steam_purchased: 0.35
    },
    renewable_energy: {
      office_buildings: 0.05,
      warehouses: 0.04,
      data_centers: 0.06,
      logistics_hubs: 0.045
    }
  };
  
  const factor = emissionFactors[categoryId]?.[itemId] || 1;
  return value * factor;
};

/**
 * Sum all emissions for a given category
 */
export const sumCategoryEmissions = (
  categoryId: string,
  formData: YearlyData,
  selectedMonth: string,
  selectedYear: string
): number => {
  const categoryData = formData?.[selectedYear]?.[selectedMonth]?.[categoryId] || {};
  let total = 0;
  
  // Sum up emissions for each item in the category
  Object.keys(categoryData).forEach(itemId => {
    total += calculateEmissions({
      categoryId,
      itemId,
      formData,
      selectedMonth,
      selectedYear
    });
  });
  
  return total;
};
