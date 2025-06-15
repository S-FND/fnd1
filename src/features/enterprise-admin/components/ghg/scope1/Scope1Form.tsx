
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scope1Categories } from '../mockData';
import { useToast } from "@/components/ui/use-toast";
import { months } from '@/data/ghg/calculator';
import MonthYearSelector from '../MonthYearSelector';
import EmissionsTrendGraph from '../EmissionsTrendGraph';
import CategoryItems from './CategoryItems';
import EmissionsSummaryPanel from './EmissionsSummaryPanel';
import { calculateCategoryTotal, calculateYearTotal, calculateMonthlyTotalForAllCategories } from './scope1Utils';
import { YearlyData } from './types';

// Pre-populated data for IMR Resources
const prePopulatedData: YearlyData = {
  '2025': {
    "January": {
      "trucks_diesel": 12500,
      "trucks_cng": 5600,
      "forklifts_diesel": 2800,
      "forklifts_electric": 4200,
      "company_cars": 3100,
      "diesel_generators": 7800,
      "natural_gas_heating": 15300,
      "lpg_equipment": 4200,
      "reach_stackers": 8900,
      "gantry_cranes": 12400,
      "terminal_tractors": 6700,
      "r410a": 48,
      "r404a": 32,
      "r134a": 65
    },
    "February": {
      "trucks_diesel": 11800,
      "trucks_cng": 5400,
      "forklifts_diesel": 2600,
      "forklifts_electric": 4000,
      "company_cars": 2900,
      "diesel_generators": 7500,
      "natural_gas_heating": 14800,
      "lpg_equipment": 4000
    },
    "March": {
      "trucks_diesel": 12200,
      "trucks_cng": 5500,
      "forklifts_diesel": 2700,
      "forklifts_electric": 4100,
      "company_cars": 3000
    }
  },
  '2024': {
    "January": {
      "trucks_diesel": 13000,
      "trucks_cng": 5800,
      "forklifts_diesel": 2900,
      "forklifts_electric": 4300,
      "company_cars": 3200
    }
  }
};

export const Scope1Form = () => {
  const [selectedCategory, setSelectedCategory] = useState(scope1Categories[0].id);
  const [monthlyFormData, setMonthlyFormData] = useState<YearlyData>(prePopulatedData);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { toast } = useToast();
  
  // Generate trend data for the charts
  const monthlyTrendData = months.map(month => ({
    name: month,
    value: calculateCategoryTotal(selectedYear.toString(), month, selectedCategory, monthlyFormData) / 1000, // Convert kg to tonnes
  }));

  const yearlyTrendData = Object.keys(monthlyFormData).map(year => ({
    name: year,
    value: calculateYearTotal(year, monthlyFormData) / 1000, // Convert kg to tonnes
  }));
  
  const handleValueChange = (categoryId: string, itemId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setMonthlyFormData(prev => {
      const yearStr = selectedYear.toString();
      const yearData = prev[yearStr] || {};
      const monthData = yearData[selectedMonth] || {};
      
      return {
        ...prev,
        [yearStr]: {
          ...yearData,
          [selectedMonth]: {
            ...monthData,
            [itemId]: numValue
          }
        }
      };
    });
  };
  
  const handleSaveData = () => {
    toast({
      title: "Data Saved",
      description: `Your Scope 1 emissions data for ${selectedMonth} ${selectedYear} has been saved successfully.`,
    });
  };

  // Calculate totals
  const selectedYearStr = selectedYear.toString();
  const monthlyTotal = calculateMonthlyTotalForAllCategories(selectedYearStr, selectedMonth, monthlyFormData) / 1000; // Convert to tonnes
  const yearlyTotal = calculateYearTotal(selectedYearStr, monthlyFormData) / 1000; // Convert to tonnes

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

          <EmissionsSummaryPanel
            monthlyTotal={monthlyTotal}
            yearlyTotal={yearlyTotal}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          
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
                  {scope1Categories.find(cat => cat.id === selectedCategory)?.description}
                </p>
                
                <CategoryItems
                  selectedCategory={selectedCategory}
                  formData={monthlyFormData}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear.toString()}
                  onValueChange={handleValueChange}
                />
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

export default Scope1Form;
