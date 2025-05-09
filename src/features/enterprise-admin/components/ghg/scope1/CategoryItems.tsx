
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { scope1Categories } from '../mockData';
import EmissionDetailsDialog from './EmissionDetailsDialog';
import { calculateEmissions } from './scope1Utils';
import { CategoryItemsProps } from './types';

const CategoryItems: React.FC<CategoryItemsProps> = ({
  selectedCategory,
  formData,
  selectedMonth,
  selectedYear,
  onValueChange
}) => {
  const currentCategory = scope1Categories.find(cat => cat.id === selectedCategory);
  
  if (!currentCategory) return null;
  
  const calculateEmissionsForItem = (categoryId: string, itemId: string) => {
    return calculateEmissions(categoryId, itemId, formData, selectedMonth, selectedYear);
  };

  return (
    <div className="space-y-4">
      {currentCategory.items.map((item) => (
        <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-5">
            <Label htmlFor={item.id}>{item.name}</Label>
          </div>
          <div className="col-span-3">
            <div className="flex items-center space-x-2">
              <Input
                id={item.id}
                type="number"
                placeholder="0.00"
                value={formData[selectedYear]?.[selectedMonth]?.[item.id] || ''}
                onChange={(e) => onValueChange(selectedCategory, item.id, e.target.value)}
              />
              <span className="text-sm text-muted-foreground w-12">{item.unit}</span>
            </div>
          </div>
          <div className="col-span-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {calculateEmissionsForItem(selectedCategory, item.id).toFixed(2)} tCO₂e
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Details</Button>
                </DialogTrigger>
                <EmissionDetailsDialog
                  categoryId={selectedCategory}
                  itemId={item.id}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  formData={formData}
                  calculateEmissions={calculateEmissionsForItem}
                />
              </Dialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryItems;
