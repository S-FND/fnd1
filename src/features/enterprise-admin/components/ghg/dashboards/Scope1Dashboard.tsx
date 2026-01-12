import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { SourceType } from '@/types/scope1-ghg';
import TimePeriodFilter, { ViewMode } from '../shared/TimePerformanceFilter';
import { months } from '@/data/ghg/calculator';
import { httpClient } from '@/lib/httpClient';
import { logger } from '@/hooks/logger';
import { toast } from 'sonner';

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

interface GHGSummaryResponse {
  allData: Array<{
    _id: string;
    facilityName: string;
    sourceDescription: string;
    sourceType: SourceType;
    activityDataUnit: string;
    measurementFrequency: string;
    dataCollections: Array<{
      _id: string;
      reportingMonth: string;
      reportingYear: string;
      totalEmission: number;
      activityDataValue: number;
      collectedDate: string;
    }>;
    totalEmission: number;
    scope: string;
  }>;
  emmissonData: {
    totalEmission: number;
    avoidedEmission: number;
    emissionByScope: {
      "Scope 1": number;
      "Scope 2": number;
      "Scope 3": number;
      "Scope 4": number;
    };
  };
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

const getCurrentFinancialYear = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan

  // Financial year starts in April (month >= 3)
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;

  return `${startYear}-${endYear}`;
};

const FY_MONTHS = [
  'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
];

const Scope1Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(FY_MONTHS[0]); // "Apr"
  const [selectedYear, setSelectedYear] = useState(getCurrentFinancialYear());
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [ghgSummary, setGhgSummary] = useState({
    totalEmission: 0,
    avoidedEmission: 0,
    emissionByScope: {
      "Scope 1": 0,
      "Scope 2": 0,
      "Scope 3": 0,
      "Scope 4": 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data from summary API
  const fetchSummaryData = async (year: string, month?: string) => {
    try {
      setIsLoading(true);
      
      // Use only the summary API endpoint
      const response = await httpClient.get(`ghg-accounting/summary?year=${year}`);
      
      if (response.status !== 200) {
        toast.error('Failed to fetch summary data');
        return;
      }

      const summaryData = response.data as GHGSummaryResponse;
      
      if (!summaryData.allData || !Array.isArray(summaryData.allData)) {
        toast.error('Invalid data format received');
        return;
      }

      // Process the data
      processSummaryData(summaryData, month);
      
      // Set the emission summary
      if (summaryData.emmissonData) {
        setGhgSummary({
          totalEmission: summaryData.emmissonData.totalEmission || 0,
          avoidedEmission: summaryData.emmissonData.avoidedEmission || 0,
          emissionByScope: summaryData.emmissonData.emissionByScope || {
            "Scope 1": 0,
            "Scope 2": 0,
            "Scope 3": 0,
            "Scope 4": 0,
          },
        });
      }
      
    } catch (error) {
      logger.error('Failed to fetch GHG summary', error);
      toast.error('Failed to load GHG summary data');
    } finally {
      setIsLoading(false);
    }
  };

  // Process summary data to extract category and trend information
  const processSummaryData = (summaryData: GHGSummaryResponse, selectedMonth?: string) => {
    // Filter for Scope 1 data only
    const scope1Data = summaryData.allData.filter(item => 
      item.scope === "Scope 1" || item.scope === "Scope 1"
    );

    // Initialize category map
    const categoryMap = new Map<SourceType, { 
      emissions: number; 
      count: number;
      monthlyData: Record<string, number>;
    }>();

    // Initialize monthly trend data
    const monthlyData: Record<string, number> = {};
    FY_MONTHS.forEach(month => {
      monthlyData[month] = 0;
    });

    // Process all data collections
    scope1Data.forEach(item => {
      const sourceType = item.sourceType as SourceType;
      
      // Get or initialize category data
      let categoryInfo = categoryMap.get(sourceType);
      if (!categoryInfo) {
        categoryInfo = { 
          emissions: 0, 
          count: 0,
          monthlyData: {}
        };
      }

      // Process data collections for this item
      if (item.dataCollections && Array.isArray(item.dataCollections)) {
        item.dataCollections.forEach(collection => {
          // Skip if not the selected year
          if (collection.reportingYear !== selectedYear) return;
          
          // Skip if monthly view and not selected month
          if (viewMode === 'monthly' && selectedMonth && 
              collection.reportingMonth !== selectedMonth) return;
          
          const emission = collection.totalEmission || 0;
          
          // Add to category total
          categoryInfo.emissions += emission;
          categoryInfo.count += 1;
          
          // Add to monthly trend data
          const month = collection.reportingMonth;
          if (monthlyData.hasOwnProperty(month)) {
            monthlyData[month] += emission;
          }
          
          // Add to category monthly data
          if (!categoryInfo.monthlyData[month]) {
            categoryInfo.monthlyData[month] = 0;
          }
          categoryInfo.monthlyData[month] += emission;
        });
      }

      categoryMap.set(sourceType, categoryInfo);
    });

    // Calculate total emissions
    const totalEmissions = Array.from(categoryMap.values())
      .reduce((sum, cat) => sum + cat.emissions, 0);

    // Convert category map to array
    const categories: CategoryData[] = Array.from(categoryMap.entries()).map(
      ([category, stats]) => ({
        category,
        totalEmissions: stats.emissions,
        entries: stats.count,
        percentage: totalEmissions > 0 
          ? Math.round((stats.emissions / totalEmissions) * 100) 
          : 0,
      })
    );

    // Set category data
    setCategoryData(categories);

    // Prepare monthly trend data
    if (viewMode === 'yearly') {
      const trend: MonthlyTrend[] = FY_MONTHS.map(month => ({
        month,
        emissions: monthlyData[month] || 0,
      }));
      setMonthlyTrend(trend);
    } else if (viewMode === 'monthly' && selectedMonth) {
      // For monthly view, we can show category breakdown for the selected month
      const monthlyCategories = Array.from(categoryMap.entries()).map(
        ([category, stats]) => ({
          category,
          totalEmissions: stats.monthlyData[selectedMonth] || 0,
          entries: stats.count,
          percentage: totalEmissions > 0 
            ? Math.round(((stats.monthlyData[selectedMonth] || 0) / totalEmissions) * 100) 
            : 0,
        })
      ).filter(cat => cat.totalEmissions > 0);
      
      setCategoryData(monthlyCategories);
    }
  };

  useEffect(() => {
    fetchSummaryData(selectedYear, selectedMonth);
  }, [viewMode, selectedMonth, selectedYear]);

  // Handle view mode changes
  useEffect(() => {
    if (viewMode === 'monthly' && !selectedMonth) {
      setSelectedMonth('Apr');
    }
  }, [viewMode]);

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

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ghgSummary.emissionByScope["Scope 1"].toFixed(2)} 
                  <span className="text-sm font-normal"> tCO₂e</span>
                </div>
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
        </>
      )}
    </div>
  );
};

export default Scope1Dashboard;