
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scope1Categories } from './mockData';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { months, calculateMonthlyTotal, calculateYearlyTotal } from '@/data/ghg/calculator';
import MonthYearSelector from './MonthYearSelector';
import EmissionsTrendGraph from './EmissionsTrendGraph';

// Pre-populated data for IMR Resources
const prePopulatedData = {
  2025: {
    "January": {
      "owned_fleet": {
        "trucks_diesel": 12500,
        "trucks_cng": 5600,
        "forklifts_diesel": 2800,
        "forklifts_electric": 4200,
        "company_cars": 3100
      },
      "stationary_combustion": {
        "diesel_generators": 7800,
        "natural_gas_heating": 15300,
        "lpg_equipment": 4200
      },
      "cargo_handling": {
        "reach_stackers": 8900,
        "gantry_cranes": 12400,
        "terminal_tractors": 6700
      },
      "refrigerants": {
        "r410a": 48,
        "r404a": 32,
        "r134a": 65
      }
    },
    "February": {
      "owned_fleet": {
        "trucks_diesel": 11800,
        "trucks_cng": 5400,
        "forklifts_diesel": 2600,
        "forklifts_electric": 4000,
        "company_cars": 2900
      },
      "stationary_combustion": {
        "diesel_generators": 7500,
        "natural_gas_heating": 14800,
        "lpg_equipment": 4000
      }
    },
    "March": {
      "owned_fleet": {
        "trucks_diesel": 12200,
        "trucks_cng": 5500,
        "forklifts_diesel": 2700,
        "forklifts_electric": 4100,
        "company_cars": 3000
      }
    }
  },
  2024: {
    "January": {
      "owned_fleet": {
        "trucks_diesel": 13000,
        "trucks_cng": 5800,
        "forklifts_diesel": 2900,
        "forklifts_electric": 4300,
        "company_cars": 3200
      }
    }
  }
};

export const GHGScope1Form = () => {
  const [selectedCategory, setSelectedCategory] = useState(scope1Categories[0].id);
  const [monthlyFormData, setMonthlyFormData] = useState<Record<string, Record<string, Record<string, number>>>>(prePopulatedData);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { toast } = useToast();
  
  const currentCategory = scope1Categories.find(cat => cat.id === selectedCategory);
  
  // Generate trend data for the charts
  const monthlyTrendData = months.map(month => ({
    name: month,
    value: calculateMonthlyTotal(monthlyFormData[selectedYear]?.[month] || {}, selectedCategory) / 1000, // Convert kg to tonnes
  }));

  const yearlyTrendData = Object.keys(monthlyFormData).map(year => ({
    name: year,
    value: calculateYearlyTotal(monthlyFormData[parseInt(year)] || {}) / 1000, // Convert kg to tonnes
  }));
  
  const handleValueChange = (categoryId: string, itemId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setMonthlyFormData(prev => {
      const yearData = prev[selectedYear] || {};
      const monthData = yearData[selectedMonth] || {};
      const categoryData = monthData[categoryId] || {};
      
      return {
        ...prev,
        [selectedYear]: {
          ...yearData,
          [selectedMonth]: {
            ...monthData,
            [categoryId]: {
              ...categoryData,
              [itemId]: numValue
            }
          }
        }
      };
    });
  };
  
  const calculateEmissions = (categoryId: string, itemId: string) => {
    if (!monthlyFormData[selectedYear]?.[selectedMonth]?.[categoryId] || 
        monthlyFormData[selectedYear][selectedMonth][categoryId][itemId] === undefined) {
      return 0;
    }
    
    const item = scope1Categories
      .find(cat => cat.id === categoryId)
      ?.items.find(i => i.id === itemId);
    
    if (!item) return 0;
    
    return monthlyFormData[selectedYear][selectedMonth][categoryId][itemId] * item.emissionFactor;
  };
  
  const handleSaveData = () => {
    toast({
      title: "Data Saved",
      description: `Your Scope 1 emissions data for ${selectedMonth} ${selectedYear} has been saved successfully.`,
    });
  };

  // Calculate totals
  const monthlyTotal = monthlyTrendData.find(m => m.name === selectedMonth)?.value || 0;
  const yearlyTotal = calculateYearlyTotal(monthlyFormData[selectedYear] || {}) / 1000;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope 1: Direct Emissions</CardTitle>
          <CardDescription>
            Record direct emissions from IMR Resources owned or controlled sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MonthYearSelector 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Emissions</h3>
              <p className="text-2xl font-bold">{monthlyTotal.toFixed(2)} tCO₂e</p>
              <p className="text-xs text-muted-foreground">For {selectedMonth} {selectedYear}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Yearly Emissions</h3>
              <p className="text-2xl font-bold">{yearlyTotal.toFixed(2)} tCO₂e</p>
              <p className="text-xs text-muted-foreground">Total for {selectedYear}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {scope1Categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {currentCategory?.description}
                </p>
                
                <div className="space-y-4">
                  {currentCategory?.items.map((item) => (
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
                            value={monthlyFormData[selectedYear]?.[selectedMonth]?.[selectedCategory]?.[item.id] || ''}
                            onChange={(e) => handleValueChange(selectedCategory, item.id, e.target.value)}
                          />
                          <span className="text-sm text-muted-foreground w-12">{item.unit}</span>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {calculateEmissions(selectedCategory, item.id).toFixed(2)} tCO₂e
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
                                    Activity data ({monthlyFormData[selectedYear]?.[selectedMonth]?.[selectedCategory]?.[item.id] || 0} {item.unit}) × 
                                    Emission factor ({item.emissionFactor} kgCO₂e/{item.unit}) ÷ 
                                    1000 = {calculateEmissions(selectedCategory, item.id).toFixed(2)} tCO₂e
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EmissionsTrendGraph 
        monthlyData={monthlyTrendData}
        yearlyData={yearlyTrendData}
        title="Scope 1 Emissions Trend"
        description="Monthly and yearly direct emissions for IMR Resources"
      />

      <div className="flex justify-between">
        <Button variant="outline">Import Data</Button>
        <div className="space-x-2">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={handleSaveData}>Save & Submit</Button>
        </div>
      </div>
    </div>
  );
};
