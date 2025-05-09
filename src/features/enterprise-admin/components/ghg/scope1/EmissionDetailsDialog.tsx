
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { scope1Categories } from '../mockData';
import { YearlyData } from './types';

interface EmissionDetailsDialogProps {
  categoryId: string;
  itemId: string;
  selectedMonth: string;
  selectedYear: string;
  formData: YearlyData;
  calculateEmissions: (categoryId: string, itemId: string) => number;
}

const EmissionDetailsDialog: React.FC<EmissionDetailsDialogProps> = ({
  categoryId,
  itemId,
  selectedMonth,
  selectedYear,
  formData,
  calculateEmissions
}) => {
  const item = scope1Categories
    .find(cat => cat.id === categoryId)
    ?.items.find(i => i.id === itemId);

  if (!item) return null;
  
  const activityData = formData[selectedYear]?.[selectedMonth]?.[itemId] || 0;
  
  return (
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
            Activity data ({activityData} {item.unit}) × 
            Emission factor ({item.emissionFactor} kgCO₂e/{item.unit}) ÷ 
            1000 = {calculateEmissions(categoryId, itemId).toFixed(2)} tCO₂e
          </p>
        </div>
      </div>
    </DialogContent>
  );
};

export default EmissionDetailsDialog;
