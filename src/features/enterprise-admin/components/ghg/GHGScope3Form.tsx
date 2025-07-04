
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scope3Categories } from './mockData';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { months, calculateMonthlyTotal, calculateYearlyTotal } from '@/data/ghg/calculator';
import MonthYearSelector from './MonthYearSelector';
import EmissionsTrendGraph from './EmissionsTrendGraph';

export const GHGScope3Form = () => {
  const [selectedCategory, setSelectedCategory] = useState(scope3Categories[0].id);
  const [monthlyFormData, setMonthlyFormData] = useState<Record<string, Record<string, Record<string, number>>>>({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { toast } = useToast();
  
  const currentCategory = scope3Categories.find(cat => cat.id === selectedCategory);
  
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
    
    const item = scope3Categories
      .find(cat => cat.id === categoryId)
      ?.items.find(i => i.id === itemId);
    
    if (!item) return 0;
    
    return monthlyFormData[selectedYear][selectedMonth][categoryId][itemId] * item.emissionFactor;
  };
  
  const handleSaveData = () => {
    toast({
      title: "Data Saved",
      description: `Your Scope 3 emissions data for ${selectedMonth} ${selectedYear} has been saved successfully.`,
    });
  };

  // Calculate totals
  const monthlyTotal = monthlyTrendData.find(m => m.name === selectedMonth)?.value || 0;
  const yearlyTotal = calculateYearlyTotal(monthlyFormData[selectedYear] || {}) / 1000;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope 3: Value Chain Emissions</CardTitle>
          <CardDescription>
            Record indirect emissions that occur in your value chain
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

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {scope3Categories.map((category) => (
                <Badge 
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{currentCategory?.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {currentCategory?.description}
                </p>
              </div>
              
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
        </CardContent>
      </Card>

      <EmissionsTrendGraph 
        monthlyData={monthlyTrendData}
        yearlyData={yearlyTrendData}
        title="Scope 3 Emissions Trend"
        description="Monthly and yearly value chain emissions"
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
