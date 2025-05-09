
import { YearlyData } from '../types';

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
