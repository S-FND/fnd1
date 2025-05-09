
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { scope2Categories } from '../mockData';
import { CategoryItemsProps } from './types';
import { calculateEmissions } from './scope2Utils';

const CategoryItems: React.FC<CategoryItemsProps> = ({
  selectedCategory,
  formData,
  selectedMonth,
  selectedYear,
  onValueChange
}) => {
  const currentCategory = scope2Categories.find(cat => cat.id === selectedCategory);
  
  if (!currentCategory) return null;
  
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
                value={formData[selectedYear]?.[selectedMonth]?.[selectedCategory]?.[item.id] || ''}
                onChange={(e) => onValueChange(selectedCategory, item.id, e.target.value)}
              />
              <span className="text-sm text-muted-foreground w-12">{item.unit}</span>
            </div>
          </div>
          <div className="col-span-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {calculateEmissions(selectedCategory, item.id, formData, selectedMonth, selectedYear).toFixed(2)} tCO₂e
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Emission Factor Details</DialogTitle>
                    <DialogDescription>
                      Information about how this emission is calculated
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Item</Label>
                        <p className="text-sm">{item.name}</p>
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <p className="text-sm">{item.unit}</p>
                      </div>
                      <div>
                        <Label>Emission Factor</Label>
                        <p className="text-sm">{item.emissionFactor} kgCO₂e per {item.unit}</p>
                      </div>
                      <div>
                        <Label>Source</Label>
                        <p className="text-sm">GHG Protocol (2023)</p>
                      </div>
                    </div>
                    <div>
                      <Label>Calculation Method</Label>
                      <p className="text-sm mt-1">
                        Activity data ({formData[selectedYear]?.[selectedMonth]?.[selectedCategory]?.[item.id] || 0} {item.unit}) × 
                        Emission factor ({item.emissionFactor} kgCO₂e/{item.unit}) ÷ 
                        1000 = {calculateEmissions(selectedCategory, item.id, formData, selectedMonth, selectedYear).toFixed(2)} tCO₂e
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryItems;
