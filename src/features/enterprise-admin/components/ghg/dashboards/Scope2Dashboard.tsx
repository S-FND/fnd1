import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import TimePeriodFilter, { ViewMode } from '../shared/TimePerformanceFilter';
import { months } from '@/data/ghg/calculator';

interface CategoryData {
  category: string;
  totalEmissions: number;
  entries: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  emissions: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

const Scope2Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [totalEmissions, setTotalEmissions] = useState(0);

  useEffect(() => {
    loadEmissionsData();
  }, [viewMode, selectedMonth, selectedYear]);

  const loadEmissionsData = () => {
    const key = viewMode === 'monthly' 
      ? `scope2_entries_${selectedMonth}_${selectedYear}`
      : `scope2_entries_year_${selectedYear}`;
    
    const storedData = localStorage.getItem(key);
    
    if (storedData) {
      const entries = JSON.parse(storedData);
      processCategoryData(entries);
    } else {
      generateSampleData();
    }

    if (viewMode === 'yearly') {
      loadYearlyTrend();
    }
  };

  const generateSampleData = () => {
    const sampleData: CategoryData[] = [
      { category: 'Purchased Electricity', totalEmissions: 205.02, entries: 4, percentage: 82 },
      { category: 'Purchased Steam', totalEmissions: 25.5, entries: 2, percentage: 10 },
      { category: 'Purchased Heating', totalEmissions: 15.3, entries: 1, percentage: 6 },
      { category: 'Purchased Cooling', totalEmissions: 5.1, entries: 1, percentage: 2 },
    ];
    setCategoryData(sampleData);
    setTotalEmissions(sampleData.reduce((sum, cat) => sum + cat.totalEmissions, 0));
  };

  const processCategoryData = (entries: any[]) => {
    const categoryMap = new Map<string, { emissions: number; count: number }>();
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
    const trend: MonthlyTrend[] = months.map((month) => {
      const key = `scope2_entries_${month}_${selectedYear}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const entries = JSON.parse(stored);
        const emissions = entries.reduce((sum: number, e: any) => sum + (e.totalEmission || 0), 0);
        return { month, emissions };
      }
      return { month, emissions: Math.random() * 250 + 50 };
    });
    setMonthlyTrend(trend);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope 2: Indirect Emissions Dashboard</CardTitle>
          <CardDescription>
            Analyze purchased energy emissions trends and breakdowns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimePeriodFilter
            viewMode={viewMode}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onViewModeChange={setViewMode}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEmissions.toFixed(2)} tCO₂e</div>
            <p className="text-xs text-muted-foreground mt-2">
              {viewMode === 'monthly' ? selectedMonth : `FY ${selectedYear}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {categoryData.reduce((sum, cat) => sum + cat.entries, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across {categoryData.length} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Largest Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryData.length > 0 ? categoryData[0].category : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {categoryData.length > 0 ? `${categoryData[0].percentage}% of total` : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList>
          <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Emission Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emissions by Source Type</CardTitle>
              <CardDescription>Total emissions breakdown by purchased energy type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalEmissions" fill="#6366f1" name="Emissions (tCO₂e)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((cat, index) => (
                  <div key={cat.category} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <div>
                        <p className="font-medium">{cat.category}</p>
                        <p className="text-sm text-muted-foreground">{cat.entries} sources</p>
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
        </TabsContent>

        <TabsContent value="trends">
          {viewMode === 'yearly' && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend - FY {selectedYear}</CardTitle>
                <CardDescription>Track emissions across the fiscal year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="emissions" stroke="#6366f1" strokeWidth={2} name="Emissions (tCO₂e)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
          {viewMode === 'monthly' && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly View</CardTitle>
                <CardDescription>Switch to yearly view to see monthly trends</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12 text-muted-foreground">
                Select "Yearly" view to analyze monthly emission trends
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Emission Distribution</CardTitle>
              <CardDescription>Relative contribution by source type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}: ${entry.percentage}%`}
                    outerRadius={120}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scope2Dashboard;
