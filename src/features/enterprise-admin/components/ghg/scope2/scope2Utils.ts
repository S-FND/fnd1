
import { CategoryData, MonthlyData, YearlyData, EmissionCalculationProps } from './types';

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

/**
 * Create an empty entry for a month if it doesn't exist
 */
export const ensureMonthExists = (
  formData: YearlyData,
  year: string,
  month: string
): YearlyData => {
  const updatedData = { ...formData };
  
  if (!updatedData[year]) {
    updatedData[year] = {};
  }
  
  if (!updatedData[year][month]) {
    updatedData[year][month] = {
      electricity_grid: {
        office_buildings: 0,
        warehouses: 0,
        data_centers: 0,
        logistics_hubs: 0
      },
      thermal_energy: {
        district_heating: 0,
        steam_purchased: 0
      },
      renewable_energy: {
        office_buildings: 0,
        warehouses: 0,
        data_centers: 0,
        logistics_hubs: 0
      }
    };
  }
  
  return updatedData;
};

/**
 * Sample pre-populated data for demonstration
 */
export const getPrePopulatedData = (): YearlyData => {
  return {
    "2025": {
      "January": {
        "electricity_grid": {
          "office_buildings": 1200,
          "warehouses": 3500,
          "data_centers": 4800,
          "logistics_hubs": 2200
        },
        "thermal_energy": {
          "district_heating": 850,
          "steam_purchased": 320
        },
        "renewable_energy": {
          "office_buildings": 300,
          "warehouses": 250,
          "data_centers": 150,
          "logistics_hubs": 200
        }
      },
      "February": {
        "electricity_grid": {
          "office_buildings": 1150,
          "warehouses": 3200,
          "data_centers": 4750,
          "logistics_hubs": 2050
        },
        "thermal_energy": {
          "district_heating": 900,
          "steam_purchased": 310
        },
        "renewable_energy": {
          "office_buildings": 320,
          "warehouses": 260,
          "data_centers": 180,
          "logistics_hubs": 210
        }
      },
      "March": {
        "electricity_grid": {
          "office_buildings": 1100,
          "warehouses": 3000,
          "data_centers": 4600,
          "logistics_hubs": 1900
        },
        "thermal_energy": {
          "district_heating": 800,
          "steam_purchased": 300
        },
        "renewable_energy": {
          "office_buildings": 350,
          "warehouses": 280,
          "data_centers": 200,
          "logistics_hubs": 230
        }
      }
    },
    "2024": {
      "January": {
        "electricity_grid": {
          "office_buildings": 1300,
          "warehouses": 3800,
          "data_centers": 5000,
          "logistics_hubs": 2500
        },
        "thermal_energy": {
          "district_heating": 950,
          "steam_purchased": 360
        },
        "renewable_energy": {
          "office_buildings": 280,
          "warehouses": 230,
          "data_centers": 120,
          "logistics_hubs": 180
        }
      }
    }
  };
};
