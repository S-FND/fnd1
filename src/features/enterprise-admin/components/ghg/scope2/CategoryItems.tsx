
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateEmissions } from './scope2Utils';
import { CategoryItemsProps } from './types';

const CategoryItems: React.FC<CategoryItemsProps> = ({ 
  selectedCategory, 
  formData, 
  selectedMonth, 
  selectedYear,
  onValueChange
}) => {
  // Define items for each category
  const categoryItems: Record<string, string[]> = {
    electricity_grid: ['office_buildings', 'warehouses', 'data_centers', 'logistics_hubs'],
    thermal_energy: ['district_heating', 'steam_purchased'],
    renewable_energy: ['office_buildings', 'warehouses', 'data_centers', 'logistics_hubs']
  };
  
  // Item display names
  const itemNames: Record<string, string> = {
    office_buildings: 'Office Buildings (kWh)',
    warehouses: 'Warehouses (kWh)',
    data_centers: 'Data Centers (kWh)',
    logistics_hubs: 'Logistics Hubs (kWh)',
    district_heating: 'District Heating (kWh)',
    steam_purchased: 'Steam Purchased (kWh)'
  };
  
  const items = categoryItems[selectedCategory] || [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(item => {
        const value = formData?.[selectedYear]?.[selectedMonth]?.[selectedCategory]?.[item] || 0;
        const emissions = calculateEmissions({
          categoryId: selectedCategory,
          itemId: item,
          formData,
          selectedMonth,
          selectedYear
        });
        
        return (
          <div key={item} className="space-y-2">
            <Label htmlFor={`${selectedCategory}-${item}`}>{itemNames[item]}</Label>
            <div className="flex gap-2">
              <Input
                id={`${selectedCategory}-${item}`}
                type="number"
                value={value}
                onChange={(e) => onValueChange(selectedCategory, item, e.target.value)}
                className="flex-1"
                min="0"
              />
              <div className="w-24 bg-muted py-2 px-3 text-sm rounded flex items-center justify-end">
                {emissions.toFixed(2)} tCO₂e
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryItems;
