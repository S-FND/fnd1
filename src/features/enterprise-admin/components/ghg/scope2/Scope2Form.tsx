
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scope2Categories } from '../mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { months } from '@/data/ghg/calculator';
import MonthYearSelector from '../MonthYearSelector';
import EmissionsTrendGraph from '../EmissionsTrendGraph';
import CategoryItems from './CategoryItems';
import EmissionsSummaryPanel from './EmissionsSummaryPanel';
import { prePopulatedData, calculateMonthlyTotalForAllCategories, calculateYearTotal, generateMonthlyTrendData, generateYearlyTrendData } from './scope2Utils';
import { YearlyData } from './types';

const Scope2Form = () => {
  const [selectedCategory, setSelectedCategory] = useState(scope2Categories[0].id);
  const [monthlyFormData, setMonthlyFormData] = useState<YearlyData>(prePopulatedData);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("location");
  const { toast } = useToast();
  
  // Generate trend data for the charts
  const monthlyTrendData = generateMonthlyTrendData(selectedYear, selectedCategory, monthlyFormData);
  const yearlyTrendData = generateYearlyTrendData(monthlyFormData);
  
  const handleValueChange = (categoryId: string, itemId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setMonthlyFormData(prev => {
      const yearStr = selectedYear.toString();
      const yearData = prev[yearStr] || {};
      const monthData = yearData[selectedMonth] || {};
      const categoryData = monthData[categoryId] || {};
      
      return {
        ...prev,
        [yearStr]: {
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
  
  const handleSaveData = () => {
    toast({
      title: "Data Saved",
      description: `Your Scope 2 emissions data for ${selectedMonth} ${selectedYear} has been saved successfully.`,
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
          <CardTitle>Scope 2: Indirect Emissions</CardTitle>
          <CardDescription>
            Record indirect emissions from purchased electricity, heating, and cooling
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="location">Location-Based Method</TabsTrigger>
              <TabsTrigger value="market">Market-Based Method</TabsTrigger>
            </TabsList>
            
            <TabsContent value="location" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Location-based method reflects the average emissions intensity of grids on which energy consumption occurs
              </p>
            </TabsContent>
            
            <TabsContent value="market" className="mt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Market-based method reflects emissions from electricity that companies have purposefully chosen
              </p>
            </TabsContent>
          </Tabs>
          
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
                    {scope2Categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {scope2Categories.find(cat => cat.id === selectedCategory)?.description}
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
        title="Scope 2 Emissions Trend"
        description="Monthly and yearly indirect emissions from energy"
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

export default Scope2Form;
