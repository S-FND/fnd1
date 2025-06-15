
import { YearlyData } from '../types';

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
