import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import TimePeriodFilter, { ViewMode } from '../shared/TimePerformanceFilter';
import { httpClient } from '@/lib/httpClient';
import { logger } from '@/hooks/logger';
import { toast } from 'sonner';

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

interface GHGSummaryResponse {
  allData: Array<{
    _id: string;
    facilityName: string;
    sourceDescription: string;
    sourceType: string;
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

const Scope2Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(FY_MONTHS[0]); // "Apr"
  const [selectedYear, setSelectedYear] = useState(getCurrentFinancialYear());
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

  // Process summary data to extract category and trend information for Scope 2
  const processSummaryData = (summaryData: GHGSummaryResponse, selectedMonth?: string) => {
    // Filter for Scope 2 data only
    const scope2Data = summaryData.allData.filter(item => 
      item.scope === "Scope 2" || item.scope === "Scope 2"
    );

    // Initialize category map
    const categoryMap = new Map<string, { 
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
    scope2Data.forEach(item => {
      const sourceType = item.sourceType;
      
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

    // Calculate total emissions for Scope 2
    const totalScope2Emissions = Array.from(categoryMap.values())
      .reduce((sum, cat) => sum + cat.emissions, 0);

    // Set total emissions
    setTotalEmissions(totalScope2Emissions);

    // Convert category map to array
    const categories: CategoryData[] = Array.from(categoryMap.entries()).map(
      ([category, stats]) => ({
        category,
        totalEmissions: stats.emissions,
        entries: stats.count,
        percentage: totalScope2Emissions > 0 
          ? Math.round((stats.emissions / totalScope2Emissions) * 100) 
          : 0,
      })
    );

    // Set category data
    setCategoryData(categories);

    // Prepare monthly trend data for yearly view
    if (viewMode === 'yearly') {
      const trend: MonthlyTrend[] = FY_MONTHS.map(month => ({
        month,
        emissions: monthlyData[month] || 0,
      }));
      setMonthlyTrend(trend);
    } else if (viewMode === 'monthly' && selectedMonth) {
      // For monthly view, show category breakdown for the selected month
      const monthlyCategories = Array.from(categoryMap.entries()).map(
        ([category, stats]) => ({
          category,
          totalEmissions: stats.monthlyData[selectedMonth] || 0,
          entries: stats.count,
          percentage: totalScope2Emissions > 0 
            ? Math.round(((stats.monthlyData[selectedMonth] || 0) / totalScope2Emissions) * 100) 
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Emissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {ghgSummary.emissionByScope["Scope 2"].toFixed(2)} tCO₂e
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {viewMode === 'monthly' ? `${selectedMonth} ${selectedYear}` : `FY ${selectedYear}`}
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
              {viewMode === 'yearly' ? (
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
              ) : (
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
        </>
      )}
    </div>
  );
};

export default Scope2Dashboard;