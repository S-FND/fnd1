import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { SourceType } from '@/types/scope1-ghg';
import TimePeriodFilter, { ViewMode } from '../shared/TimePerformanceFilter';
import { months } from '@/data/ghg/calculator';

interface CategoryData {
  category: SourceType;
  totalEmissions: number;
  entries: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  emissions: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

const Scope1Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [totalEmissions, setTotalEmissions] = useState(0);

  useEffect(() => {
    // Load data from localStorage or API
    loadEmissionsData();
  }, [viewMode, selectedMonth, selectedYear]);

  const loadEmissionsData = () => {
    // Fetch data based on time period
    const key = viewMode === 'monthly' 
      ? `scope1_entries_${selectedMonth}_${selectedYear}`
      : `scope1_entries_year_${selectedYear}`;
    
    const storedData = localStorage.getItem(key);
    
    if (storedData) {
      const entries = JSON.parse(storedData);
      processCategoryData(entries);
    } else {
      // Generate sample data for demonstration
      generateSampleData();
    }

    // Load trend data for the year
    if (viewMode === 'yearly') {
      loadYearlyTrend();
    }
  };

  const generateSampleData = () => {
    const sampleData: CategoryData[] = [
      { category: 'Stationary', totalEmissions: 14.2, entries: 3, percentage: 24 },
      { category: 'Mobile', totalEmissions: 33.8, entries: 5, percentage: 57 },
      { category: 'Fugitive', totalEmissions: 10.44, entries: 2, percentage: 18 },
      { category: 'Process', totalEmissions: 0.8, entries: 1, percentage: 1 },
    ];
    setCategoryData(sampleData);
    setTotalEmissions(sampleData.reduce((sum, cat) => sum + cat.totalEmissions, 0));
  };

  const processCategoryData = (entries: any[]) => {
    const categoryMap = new Map<SourceType, { emissions: number; count: number }>();
    let total = 0;

    entries.forEach((entry: any) => {
      const current = categoryMap.get(entry.sourceType) || { emissions: 0, count: 0 };
      current.emissions += entry.totalEmission || 0;
      current.count += 1;
      categoryMap.set(entry.sourceType, current);
      total += entry.totalEmission || 0;
    });

    const data: CategoryData[] = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      totalEmissions: stats.emissions,
      entries: stats.count,
      percentage: total > 0 ? Math.round((stats.emissions / total) * 100) : 0,
    }));

    setCategoryData(data);
    setTotalEmissions(total);
  };

  const loadYearlyTrend = () => {
    const trend: MonthlyTrend[] = months.map((month, index) => {
      const key = `scope1_entries_${month}_${selectedYear}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const entries = JSON.parse(stored);
        const emissions = entries.reduce((sum: number, e: any) => sum + (e.totalEmission || 0), 0);
        return { month, emissions };
      }
      // Sample data for demonstration
      return { month, emissions: Math.random() * 60 + 10 };
    });
    setMonthlyTrend(trend);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scope 1 Emissions Dashboard</h2>
          <p className="text-muted-foreground">Direct emissions from owned or controlled sources</p>
        </div>
        <TimePeriodFilter
          viewMode={viewMode}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onViewModeChange={setViewMode}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmissions.toFixed(2)} <span className="text-sm font-normal">tCO₂e</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              {viewMode === 'monthly' ? `${selectedMonth} ${selectedYear}` : `Year ${selectedYear}`}
            </p>
          </CardContent>
        </Card>

        {categoryData.slice(0, 3).map((cat, idx) => (
          <Card key={cat.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{cat.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cat.totalEmissions.toFixed(2)} <span className="text-sm font-normal">tCO₂e</span></div>
              <p className="text-xs text-muted-foreground mt-1">{cat.entries} sources • {cat.percentage}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="category" className="w-full">
        <TabsList>
          <TabsTrigger value="category">Category Breakdown</TabsTrigger>
          <TabsTrigger value="comparison">Category Comparison</TabsTrigger>
          {viewMode === 'yearly' && <TabsTrigger value="trend">Monthly Trend</TabsTrigger>}
        </TabsList>

        <TabsContent value="category" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Emissions by Category</CardTitle>
                <CardDescription>Distribution across source types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="totalEmissions"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Details */}
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>Emission sources and totals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((cat, idx) => (
                    <div key={cat.category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{cat.category}</p>
                          <p className="text-sm text-muted-foreground">{cat.entries} emission sources</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{cat.totalEmissions.toFixed(2)} tCO₂e</p>
                        <p className="text-sm text-muted-foreground">{cat.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Category Comparison</CardTitle>
              <CardDescription>Emissions comparison across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalEmissions" fill="#6366f1" name="Total Emissions (tCO₂e)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {viewMode === 'yearly' && (
          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Emissions Trend</CardTitle>
                <CardDescription>Scope 1 emissions throughout {selectedYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="emissions" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      name="Monthly Emissions (tCO₂e)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Scope1Dashboard;
