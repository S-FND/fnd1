import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, Copy, Check } from "lucide-react";
import { convertUnit, getAvailableConversions } from "@/utils/unitConversion";
import { useToast } from "@/hooks/use-toast";

interface UnitConverterToolProps {
  initialFromUnit?: string;
  initialToUnit?: string;
  initialValue?: number;
}

export const UnitConverterTool: React.FC<UnitConverterToolProps> = ({
  initialFromUnit = 'kg',
  initialToUnit = 'tonnes',
  initialValue = 0,
}) => {
  const { toast } = useToast();
  const [value, setValue] = useState<string>(initialValue.toString());
  const [fromUnit, setFromUnit] = useState(initialFromUnit);
  const [toUnit, setToUnit] = useState(initialToUnit);
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  const [availableFromUnits, setAvailableFromUnits] = useState<string[]>([]);
  const [availableToUnits, setAvailableToUnits] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Common unit categories for quick access
  const unitCategories = {
    Mass: ['kg', 'tonnes', 'g', 'mg', 'lb', 'oz'],
    Volume: ['L', 'mL', 'kL', 'gal', 'm³', 'ft³'],
    Energy: ['kWh', 'MWh', 'GJ', 'MJ', 'therms', 'BTU'],
    Distance: ['km', 'm', 'mi', 'ft'],
    Emissions: ['kg CO₂e', 'tonnes CO₂e', 'g CO₂e'],
  };

  useEffect(() => {
    // Get all available units by combining all categories
    const allUnits = Array.from(new Set(Object.values(unitCategories).flat()));
    setAvailableFromUnits(allUnits);
  }, []);

  useEffect(() => {
    // Get available conversion units for the selected "from" unit
    const conversions = getAvailableConversions(fromUnit);
    setAvailableToUnits(conversions);
    
    // If current "to" unit is not available, select the first available one
    if (!conversions.includes(toUnit) && conversions.length > 0) {
      setToUnit(conversions[0]);
    }
  }, [fromUnit]);

  useEffect(() => {
    // Perform conversion whenever value, fromUnit, or toUnit changes
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && fromUnit && toUnit) {
      const result = convertUnit(numValue, fromUnit, toUnit);
      setConvertedValue(result);
    } else {
      setConvertedValue(null);
    }
  }, [value, fromUnit, toUnit]);

  const handleValueChange = (inputValue: string) => {
    // Allow empty string, numbers, and decimal points
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    
    // Swap the value with converted value
    if (convertedValue !== null) {
      setValue(convertedValue.toString());
    }
  };

  const handleCopyValue = (val: number, unit: string, index: number) => {
    navigator.clipboard.writeText(`${val} ${unit}`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    
    toast({
      title: "Copied to Clipboard",
      description: `${val} ${unit}`,
    });
  };

  const getAllConversions = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return [];

    const conversions = getAvailableConversions(fromUnit);
    return conversions
      .filter(unit => unit !== fromUnit)
      .map(unit => ({
        unit,
        value: convertUnit(numValue, fromUnit, unit),
      }))
      .filter(conv => conv.value !== null);
  };

  const allConversions = getAllConversions();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>Unit Converter</CardTitle>
          </div>
          <CardDescription>
            Convert values between different units for GHG emissions data entry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Conversion */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div className="space-y-2">
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder="Enter value"
                  className="text-lg"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(unitCategories).map(([category, units]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          {category}
                        </div>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapUnits}
              className="mb-2"
              disabled={!availableToUnits.includes(fromUnit)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
              <Label>To</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="text"
                    value={convertedValue !== null ? convertedValue.toFixed(6) : ''}
                    readOnly
                    placeholder="Converted value"
                    className="text-lg bg-muted"
                  />
                  {convertedValue !== null && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => handleCopyValue(convertedValue, toUnit, -1)}
                    >
                      {copiedIndex === -1 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {convertedValue !== null && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Conversion Result</p>
              <p className="text-2xl font-bold">
                {parseFloat(value) || 0} {fromUnit} = {convertedValue.toFixed(4)} {toUnit}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Available Conversions */}
      {allConversions.length > 0 && parseFloat(value) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Available Conversions</CardTitle>
            <CardDescription>
              {parseFloat(value)} {fromUnit} equals:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allConversions.map((conv, index) => (
                <div
                  key={conv.unit}
                  className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors group relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">{conv.unit}</p>
                      <p className="font-semibold truncate" title={conv.value?.toFixed(6)}>
                        {conv.value?.toFixed(4)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopyValue(conv.value!, conv.unit, index)}
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Conversions Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="font-semibold text-muted-foreground">Mass</p>
              <p>1 tonne = 1,000 kg</p>
              <p>1 kg = 1,000 g</p>
              <p>1 kg ≈ 2.205 lb</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-muted-foreground">Volume</p>
              <p>1 kL = 1,000 L</p>
              <p>1 L = 1,000 mL</p>
              <p>1 gal ≈ 3.785 L</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-muted-foreground">Energy</p>
              <p>1 MWh = 1,000 kWh</p>
              <p>1 kWh ≈ 3.6 MJ</p>
              <p>1 GJ = 1,000 MJ</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-muted-foreground">Distance</p>
              <p>1 km = 1,000 m</p>
              <p>1 mi ≈ 1.609 km</p>
              <p>1 m ≈ 3.281 ft</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitConverterTool;
