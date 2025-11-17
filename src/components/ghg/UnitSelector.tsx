import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { convertUnit, getAvailableConversions, formatConversion } from "@/utils/unitConversion";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UnitSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  baseUnit: string; // The unit defined in the source
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
  placeholder?: string;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({
  label,
  value,
  onChange,
  baseUnit,
  selectedUnit,
  onUnitChange,
  placeholder = "Enter value",
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value?.toString() || '');
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [convertedValue, setConvertedValue] = useState<number | null>(null);

  useEffect(() => {
    // Get available unit conversions
    const units = getAvailableConversions(baseUnit);
    setAvailableUnits(units);
    
    // Set selected unit to base unit if not set
    if (!selectedUnit) {
      onUnitChange(baseUnit);
    }
  }, [baseUnit, selectedUnit, onUnitChange]);

  useEffect(() => {
    // Calculate converted value to base unit
    if (value && selectedUnit && selectedUnit !== baseUnit) {
      const converted = convertUnit(value, selectedUnit, baseUnit);
      setConvertedValue(converted);
    } else {
      setConvertedValue(null);
    }
  }, [value, selectedUnit, baseUnit]);

  const handleValueChange = (inputValue: string) => {
    setDisplayValue(inputValue);
    const numValue = parseFloat(inputValue);
    
    if (!isNaN(numValue)) {
      // Convert to base unit for storage
      if (selectedUnit === baseUnit) {
        onChange(numValue);
      } else {
        const converted = convertUnit(numValue, selectedUnit, baseUnit);
        if (converted !== null) {
          onChange(converted);
        }
      }
    } else {
      onChange(0);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    onUnitChange(newUnit);
    
    // Recalculate display value in new unit
    if (value && newUnit !== baseUnit) {
      const converted = convertUnit(value, baseUnit, newUnit);
      if (converted !== null) {
        setDisplayValue(converted.toString());
      }
    } else {
      setDisplayValue(value?.toString() || '');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {convertedValue !== null && selectedUnit !== baseUnit && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {formatConversion(parseFloat(displayValue) || 0, selectedUnit, baseUnit)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Data will be stored in {baseUnit}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            step="0.01"
            value={displayValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <div className="w-[140px]">
          <Select value={selectedUnit} onValueChange={handleUnitChange}>
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {availableUnits.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                  {unit === baseUnit && (
                    <span className="text-xs text-muted-foreground ml-1">(base)</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {convertedValue !== null && selectedUnit !== baseUnit && (
        <p className="text-xs text-muted-foreground">
          = {convertedValue.toFixed(2)} {baseUnit} (will be saved in base unit)
        </p>
      )}
    </div>
  );
};

export default UnitSelector;