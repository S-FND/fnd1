
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  calculateMonthlyTotal, 
  calculateYearlyTotal, 
  ensureMonthExists,
  getPrePopulatedData
} from './utils';
import { YearlyData } from './types';
import CategoryItems from './CategoryItems';
import EmissionsSummaryPanel from './EmissionsSummaryPanel';

const Scope2Form: React.FC = () => {
  const [formData, setFormData] = useState<YearlyData>(getPrePopulatedData());
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonth, setSelectedMonth] = useState<string>("January");
  
  // Calculate emission totals
  const monthlyTotal = calculateMonthlyTotal(formData, selectedMonth, selectedYear);
  const yearlyTotal = calculateYearlyTotal(formData, selectedYear);
  
  // Ensure the selected month exists in the data structure
  useEffect(() => {
    setFormData(currentData => ensureMonthExists(currentData, selectedYear, selectedMonth));
  }, [selectedYear, selectedMonth]);
  
  const handleValueChange = (categoryId: string, itemId: string, value: string) => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    
    if (isNaN(numericValue)) return;
    
    setFormData(prev => {
      // Create a deep copy of the previous state
      const updated = JSON.parse(JSON.stringify(prev));
      
      // Ensure the path exists
      if (!updated[selectedYear]) updated[selectedYear] = {};
      if (!updated[selectedYear][selectedMonth]) updated[selectedYear][selectedMonth] = {};
      if (!updated[selectedYear][selectedMonth][categoryId]) updated[selectedYear][selectedMonth][categoryId] = {};
      
      // Update the value
      updated[selectedYear][selectedMonth][categoryId][itemId] = numericValue;
      
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Month and Year Selector */}
      <div className="flex items-center gap-4">
        <div>
          <label htmlFor="year" className="block text-sm mb-1">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded p-2"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
        <div>
          <label htmlFor="month" className="block text-sm mb-1">Month</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded p-2"
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
      </div>
      
      {/* Emissions Summary Panel */}
      <EmissionsSummaryPanel
        monthlyTotal={monthlyTotal}
        yearlyTotal={yearlyTotal}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      
      {/* Electricity Grid Consumption */}
      <Card>
        <CardHeader>
          <CardTitle>Electricity Grid Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryItems 
            selectedCategory="electricity_grid"
            formData={formData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onValueChange={handleValueChange}
          />
        </CardContent>
      </Card>
      
      {/* Thermal Energy */}
      <Card>
        <CardHeader>
          <CardTitle>Thermal Energy</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryItems 
            selectedCategory="thermal_energy"
            formData={formData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onValueChange={handleValueChange}
          />
        </CardContent>
      </Card>
      
      {/* Renewable Energy */}
      <Card>
        <CardHeader>
          <CardTitle>Renewable Energy</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryItems 
            selectedCategory="renewable_energy"
            formData={formData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onValueChange={handleValueChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope2Form;
