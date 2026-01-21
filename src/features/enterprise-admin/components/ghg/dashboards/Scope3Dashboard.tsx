import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import TimePeriodFilter, { ViewMode } from '../shared/TimePerformanceFilter';
import { httpClient } from '@/lib/httpClient';
import { logger } from '@/hooks/logger';
import { toast } from 'sonner';
import DataSourceInfo from './DataSourceInfo';
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

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f43f5e', '#06b6d4', '#84cc16'];

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

const FY_QUARTERS = [
  'Q1 (Apr-Jun)',
  'Q2 (Jul-Sep)',
  'Q3 (Oct-Dec)',
  'Q4 (Jan-Mar)',
] as const;
export type Quarter = typeof FY_QUARTERS[number];

const Scope3Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(FY_MONTHS[0]); // "Apr"
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('Q1 (Apr-Jun)');
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
  const [rawSummaryData, setRawSummaryData] = useState<GHGSummaryResponse | null>(null);
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
      // processSummaryData(summaryData, month);
      setRawSummaryData(summaryData);
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

  // Helper function to get months in a quarter (same as above)
  const getMonthsInQuarter = (quarter: Quarter): string[] => {
    const quarterMap: Record<Quarter, string[]> = {
      'Q1 (Apr-Jun)': ['Apr', 'May', 'Jun'],
      'Q2 (Jul-Sep)': ['Jul', 'Aug', 'Sep'],
      'Q3 (Oct-Dec)': ['Oct', 'Nov', 'Dec'],
      'Q4 (Jan-Mar)': ['Jan', 'Feb', 'Mar']
    };
    return quarterMap[quarter] || [];
  };

  // Helper function to normalize month/quarter data
  const normalizeMonthData = (reportingMonth: string): {
    type: 'month' | 'quarter';
    value: string;
    months?: string[];
  } => {
    // Check if it's a quarter format (starts with Q)
    if (reportingMonth.startsWith('Q')) {
      const quarterMap: Record<string, string[]> = {
        'Q1 (Apr-Jun)': ['Apr', 'May', 'Jun'],
        'Q2 (Jul-Sep)': ['Jul', 'Aug', 'Sep'],
        'Q3 (Oct-Dec)': ['Oct', 'Nov', 'Dec'],
        'Q4 (Jan-Mar)': ['Jan', 'Feb', 'Mar']
      };

      const months = quarterMap[reportingMonth as Quarter];
      return {
        type: 'quarter',
        value: reportingMonth as Quarter,
        months: months || []
      };
    } else {
      // It's a month
      return {
        type: 'month',
        value: reportingMonth
      };
    }
  };

  // Add this state to track detailed category info
  const [categoryDetails, setCategoryDetails] = useState<Map<string, {
    emissions: number;
    sourceIds: Set<string>;
    dataTypes: Set<string>;
    monthlyData: Record<string, number>;
    quarterlyData: Record<Quarter, number>;
    dataTypeDetails: Map<string, { emissions: number; sourceIds: Set<string> }>;
  }> | null>(null);

  // Updated process function
  const processSummaryData = (
    summaryData: GHGSummaryResponse,
    selectedMonth?: string,
    selectedQuarter?: Quarter
  ) => {
    // Filter for Scope 3 only
    const scope3Data: any = summaryData.allData.filter(
      item => item.scope === 'Scope 3'
    );

    console.log('Scope 3 data found:', scope3Data.length);

    // For Scope 3, we need to group by category (sourceType)
    const categoryMap = new Map<
      string, // Category name (e.g., "Purchased Goods and Services")
      {
        emissions: number;
        sourceIds: Set<string>; // Track unique source IDs within this category
        dataTypes: Set<string>; // Track different data types within this category
        monthlyData: Record<string, number>;
        quarterlyData: Record<Quarter, number>;
        dataTypeDetails: Map<string, { // Track emissions by data type
          emissions: number;
          sourceIds: Set<string>;
        }>;
      }
    >();

    // Process all Scope 3 data
    scope3Data.forEach((item: any) => {
      const category = item.sourceType; // This is the Scope 3 category
      const sourceId = item._id;
      const dataType = item.sourceCategory || item.sourceDescription || item.facilityName || 'Unknown';

      let categoryInfo = categoryMap.get(category);
      if (!categoryInfo) {
        categoryInfo = {
          emissions: 0,
          sourceIds: new Set<string>(),
          dataTypes: new Set<string>(),
          monthlyData: {},
          quarterlyData: {
            'Q1 (Apr-Jun)': 0,
            'Q2 (Jul-Sep)': 0,
            'Q3 (Oct-Dec)': 0,
            'Q4 (Jan-Mar)': 0
          },
          dataTypeDetails: new Map()
        };
        categoryMap.set(category, categoryInfo);
      }

      // Add source ID to this category
      categoryInfo.sourceIds.add(sourceId);

      // Add data type to this category
      categoryInfo.dataTypes.add(dataType);

      // Initialize data type details if not exists
      if (!categoryInfo.dataTypeDetails.has(dataType)) {
        categoryInfo.dataTypeDetails.set(dataType, {
          emissions: 0,
          sourceIds: new Set<string>()
        });
      }

      const dataTypeInfo = categoryInfo.dataTypeDetails.get(dataType)!;
      dataTypeInfo.sourceIds.add(sourceId);

      // DECISION: Use graphData if available, otherwise use dataCollections
      let allCollections = [];

      if (item.graphData && item.graphData.length > 0) {
        allCollections = item.graphData; // Already has monthly breakdown
      } else {
        allCollections = item.dataCollections || [];
      }

      allCollections.forEach((collection: any) => {
        if (collection.reportingYear !== selectedYear) return;

        const emission = collection.totalEmission || 0;

        // Check if this has a month field (from graphData)
        if (collection.month) {
          // This is from graphData - already has monthly breakdown
          const monthName = collection.month;

          // Update monthly data for this category
          if (!categoryInfo.monthlyData[monthName]) {
            categoryInfo.monthlyData[monthName] = 0;
          }
          categoryInfo.monthlyData[monthName] += emission;

          // Update data type emissions
          dataTypeInfo.emissions += emission;

          // Update quarterly data
          if (monthName === 'Apr' || monthName === 'May' || monthName === 'Jun') {
            categoryInfo.quarterlyData['Q1 (Apr-Jun)'] += emission;
          } else if (monthName === 'Jul' || monthName === 'Aug' || monthName === 'Sep') {
            categoryInfo.quarterlyData['Q2 (Jul-Sep)'] += emission;
          } else if (monthName === 'Oct' || monthName === 'Nov' || monthName === 'Dec') {
            categoryInfo.quarterlyData['Q3 (Oct-Dec)'] += emission;
          } else if (monthName === 'Jan' || monthName === 'Feb' || monthName === 'Mar') {
            categoryInfo.quarterlyData['Q4 (Jan-Mar)'] += emission;
          }

        } else {
          // This is from dataCollections - could be monthly or quarterly
          const normalized = normalizeMonthData(collection.reportingMonth);

          if (normalized.type === 'quarter') {
            // Quarterly data - DIVIDE FIRST, then add to months
            const quarter = normalized.value as Quarter;
            const months = normalized.months || getMonthsInQuarter(quarter);
            const monthlyEmission = emission / months.length; // DIVIDE FIRST

            // Update quarterly data (add full amount)
            categoryInfo.quarterlyData[quarter] += emission;

            // Update data type emissions (full quarterly amount)
            dataTypeInfo.emissions += emission;

            // DISTRIBUTE TO MONTHLY DATA
            months.forEach(monthName => {
              if (!categoryInfo.monthlyData[monthName]) {
                categoryInfo.monthlyData[monthName] = 0;
              }
              categoryInfo.monthlyData[monthName] += monthlyEmission;
            });

          } else {
            // Monthly data from dataCollections
            const monthName = normalized.value;

            if (!categoryInfo.monthlyData[monthName]) {
              categoryInfo.monthlyData[monthName] = 0;
            }
            categoryInfo.monthlyData[monthName] += emission;

            // Update data type emissions
            dataTypeInfo.emissions += emission;

            // Update quarterly data
            if (monthName === 'Apr' || monthName === 'May' || monthName === 'Jun') {
              categoryInfo.quarterlyData['Q1 (Apr-Jun)'] += emission;
            } else if (monthName === 'Jul' || monthName === 'Aug' || monthName === 'Sep') {
              categoryInfo.quarterlyData['Q2 (Jul-Sep)'] += emission;
            } else if (monthName === 'Oct' || monthName === 'Nov' || monthName === 'Dec') {
              categoryInfo.quarterlyData['Q3 (Oct-Dec)'] += emission;
            } else if (monthName === 'Jan' || monthName === 'Feb' || monthName === 'Mar') {
              categoryInfo.quarterlyData['Q4 (Jan-Mar)'] += emission;
            }
          }
        }

        // Update total emissions for this category
        categoryInfo.emissions += emission;
      });
    });

    // Store the categoryMap in state for use in JSX
    setCategoryDetails(categoryMap);

    // Calculate totals based on view mode
    let totalScope3Emissions = 0;
    const categories: CategoryData[] = [];

    if (viewMode === 'yearly') {
      // Yearly view
      Array.from(categoryMap.entries()).forEach(([category, stats]) => {
        const yearlyEmissions = Object.values(stats.monthlyData).reduce((sum, val) => sum + val, 0);
        totalScope3Emissions += yearlyEmissions;

        categories.push({
          category,
          totalEmissions: yearlyEmissions,
          entries: stats.dataTypes.size, // Count of unique data types in this category
          percentage: 0
        });
      });

    } else if (viewMode === 'quarterly' && selectedQuarter) {
      // Quarterly view
      Array.from(categoryMap.entries()).forEach(([category, stats]) => {
        const quarterEmissions = stats.quarterlyData[selectedQuarter];
        totalScope3Emissions += quarterEmissions;

        categories.push({
          category,
          totalEmissions: quarterEmissions,
          entries: stats.dataTypes.size, // Count of unique data types
          percentage: 0
        });
      });

    } else if (viewMode === 'monthly' && selectedMonth) {
      // Monthly view
      Array.from(categoryMap.entries()).forEach(([category, stats]) => {
        const monthlyEmissions = stats.monthlyData[selectedMonth] || 0;
        totalScope3Emissions += monthlyEmissions;

        categories.push({
          category,
          totalEmissions: monthlyEmissions,
          entries: stats.dataTypes.size, // Count of unique data types
          percentage: 0
        });
      });
    }

    // Calculate percentages
    const finalCategories = categories.map(cat => ({
      ...cat,
      percentage: totalScope3Emissions > 0
        ? Math.round((cat.totalEmissions / totalScope3Emissions) * 100)
        : 0
    })).sort((a, b) => b.totalEmissions - a.totalEmissions);

    setTotalEmissions(totalScope3Emissions);
    setCategoryData(finalCategories);

    // Update monthly trend for yearly view
    if (viewMode === 'yearly') {
      const trend: MonthlyTrend[] = FY_MONTHS.map(month => ({
        month,
        emissions: Array.from(categoryMap.values()).reduce((sum, stats) =>
          sum + (stats.monthlyData[month] || 0), 0
        ),
      }));
      setMonthlyTrend(trend);
    }
  };

  useEffect(() => {
    fetchSummaryData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (!rawSummaryData) return;

    processSummaryData(rawSummaryData, selectedMonth, selectedQuarter);
  }, [rawSummaryData, viewMode, selectedMonth, selectedQuarter]);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope 3: Value Chain Emissions Dashboard</CardTitle>
          <CardDescription>
            Analyze upstream and downstream emissions across all 15 categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimePeriodFilter
            viewMode={viewMode}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedQuarter={selectedQuarter}
            onViewModeChange={setViewMode}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onQuarterChange={setSelectedQuarter}
          />
        </CardContent>
      </Card>

      {/* <DataSourceInfo 
        viewMode={viewMode}
        selectedMonth={selectedMonth}
        selectedQuarter={selectedQuarter}
        selectedYear={selectedYear}
        rawSummaryData={rawSummaryData}
      /> */}

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
                  {totalEmissions.toFixed(2)} tCO₂e
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {viewMode === 'monthly' ? `${selectedMonth} ${selectedYear}` : `FY ${selectedYear}`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{categoryData.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Out of 15 possible categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Largest Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold truncate">
                  {categoryData.length > 0 ? categoryData[0].category.substring(0, 30) : 'N/A'}
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

            <TabsContent value="breakdown" className="space-y-4 overflow-visible">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Emissions by Category</CardTitle>
                    <CardDescription>Total emissions breakdown by Scope 3 category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="totalEmissions"
                          >
                            <Legend
                              layout="vertical"
                              verticalAlign="middle"
                              align="right"
                            />
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          {/* Center Total */}
                          <text
                            x="50%"
                            y="45%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-sm font-medium"
                          >
                            Total
                          </text>
                          <text
                            x="50%"
                            y="55%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-lg font-bold"
                          >
                            {totalEmissions.toFixed(2)}
                          </text>
                          <text
                            x="50%"
                            y="65%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-muted-foreground text-xs"
                          >
                            tCO₂e
                          </text>

                          <Tooltip
                            formatter={(value: number, _name, props: any) => [
                              `${value.toFixed(2)} tCO₂e`,
                              `${props.payload.category} (${props.payload.percentage}%)`,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryData.map((cat, index) => {
                        // Get detailed info from categoryDetails
                        const categoryInfo = categoryDetails?.get(cat.category);

                        return (
                          <div key={cat.category} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <div>
                                  <p className="font-medium text-sm">{cat.category}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {/* {cat.entries} data types •  */}
                                    {cat.percentage}% of total
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{cat.totalEmissions.toFixed(2)} tCO₂e</p>
                              </div>
                            </div>

                            {/* Show data types if available */}
                            {/* {categoryInfo && categoryInfo.dataTypes.size > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Data Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(categoryInfo.dataTypes).map((dataType, idx) => (
                        <span 
                          key={idx} 
                          className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          {dataType}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}

{categoryInfo && categoryInfo.dataTypes.size > 0 && (
  <div className="mt-3 pt-3 border-t">
    <p className="text-xs font-medium text-muted-foreground mb-1">Source Categories:</p>
    <div className="flex flex-wrap gap-1">
      {Array.from(categoryInfo.dataTypes).map((dataType, idx) => (
        <span 
          key={idx} 
          className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded"
        >
          {dataType}
        </span>
      ))}
    </div>
  </div>
)}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              {viewMode === 'yearly' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trend - FY {selectedYear}</CardTitle>
                    <CardDescription>Track value chain emissions across the fiscal year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
                        <YAxis label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                        formatter={(value: number) => [`${value.toFixed(2)} tCO₂e`, 'Emissions']}
                      />
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
                  <CardDescription>Relative contribution by category</CardDescription>
                </CardHeader>

                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={categoryData}
                      barCategoryGap={40}   // 👈 important
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis
                        label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }}
                        domain={[0, 'dataMax + 1']}
                        tickFormatter={(value: number) => value.toFixed(2)}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(2)} tCO₂e`, 'Emissions']}
                      />
                      <Bar
                        dataKey="totalEmissions"
                        name="Emissions (tCO₂e)"
                        fill="#6366f1"
                        barSize={60}    // 👈 THIS FIXES FAT BAR ISSUE
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
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

export default Scope3Dashboard;