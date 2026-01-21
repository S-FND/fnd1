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

const FY_QUARTERS = [
  'Q1 (Apr-Jun)',
  'Q2 (Jul-Sep)',
  'Q3 (Oct-Dec)',
  'Q4 (Jan-Mar)',
] as const;
export type Quarter = typeof FY_QUARTERS[number];

const Scope2Dashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>(FY_MONTHS[0]); // "Apr"
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>('Q1 (Apr-Jun)');
  const [selectedYear, setSelectedYear] = useState(getCurrentFinancialYear());
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rawSummaryData, setRawSummaryData] = useState<GHGSummaryResponse | null>(null);
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

  // Helper function to get months in a quarter
  const getMonthsInQuarter = (quarter: Quarter): string[] => {
    const quarterMap: Record<Quarter, string[]> = {
      'Q1 (Apr-Jun)': ['Apr', 'May', 'Jun'],
      'Q2 (Jul-Sep)': ['Jul', 'Aug', 'Sep'],
      'Q3 (Oct-Dec)': ['Oct', 'Nov', 'Dec'],
      'Q4 (Jan-Mar)': ['Jan', 'Feb', 'Mar']
    };
    return quarterMap[quarter] || [];
  };

  // Updated processSummaryData function for Scope 2
  const processSummaryData = (
    summaryData: GHGSummaryResponse,
    selectedMonth?: string,
    selectedQuarter?: Quarter
  ) => {
    // Filter for Scope 2 only
    const scope2Data = summaryData.allData.filter(
      item => item.scope === 'Scope 2' || item.scope?.toLowerCase() === 'scope 2'
    );
  
    const categoryMap = new Map<
      string,
      {
        emissions: number;
        count: number;
        monthlyData: Record<string, number>;
        quarterlyData: Record<Quarter, number>;
        monthlyCollections: Record<string, any[]>;
      }
    >();
  
    // Monthly trend (only for yearly view)
    const monthlyData: Record<string, number> = {};
    FY_MONTHS.forEach(m => (monthlyData[m] = 0));
  
    scope2Data.forEach(item => {
      const category = item.sourceType || item.sourceDescription || 'Other';
  
      let categoryInfo = categoryMap.get(category);
      if (!categoryInfo) {
        categoryInfo = {
          emissions: 0,
          count: 0,
          monthlyData: {},
          quarterlyData: {
            'Q1 (Apr-Jun)': 0,
            'Q2 (Jul-Sep)': 0,
            'Q3 (Oct-Dec)': 0,
            'Q4 (Jan-Mar)': 0
          },
          monthlyCollections: {}
        };
        categoryMap.set(category, categoryInfo);
      }
  
      // Track all monthly collections
      item.dataCollections?.forEach(collection => {
        // Year filter
        if (collection.reportingYear !== selectedYear) return;
  
        const month = collection.reportingMonth;
        const emission = collection.totalEmission || 0;
  
        // Initialize monthly collections array
        if (!categoryInfo.monthlyCollections[month]) {
          categoryInfo.monthlyCollections[month] = [];
        }
        categoryInfo.monthlyCollections[month].push(collection);
  
        // Store monthly data
        if (!categoryInfo.monthlyData[month]) {
          categoryInfo.monthlyData[month] = 0;
        }
        categoryInfo.monthlyData[month] += emission;
  
        // Add to total emissions for this category
        categoryInfo.emissions += emission;
        categoryInfo.count += 1;
  
        // Add to monthly trend for yearly view
        if (monthlyData[month] !== undefined) {
          monthlyData[month] += emission;
        }
  
        // Add to quarterly data
        if (month === 'Apr' || month === 'May' || month === 'Jun') {
          categoryInfo.quarterlyData['Q1 (Apr-Jun)'] += emission;
        } else if (month === 'Jul' || month === 'Aug' || month === 'Sep') {
          categoryInfo.quarterlyData['Q2 (Jul-Sep)'] += emission;
        } else if (month === 'Oct' || month === 'Nov' || month === 'Dec') {
          categoryInfo.quarterlyData['Q3 (Oct-Dec)'] += emission;
        } else if (month === 'Jan' || month === 'Feb' || month === 'Mar') {
          categoryInfo.quarterlyData['Q4 (Jan-Mar)'] += emission;
        }
      });
    });
  
    // Calculate totals based on view mode
    let totalScopeEmissions = 0;
    const categories: CategoryData[] = [];
  
    if (viewMode === 'yearly') {
      // Yearly view - include all data
      Array.from(categoryMap.entries()).forEach(([category, stats]) => {
        const emissions = stats.emissions;
        totalScopeEmissions += emissions;
        
        categories.push({
          category,
          totalEmissions: emissions,
          entries: stats.count,
          percentage: 0
        });
      });
      
    } else if (viewMode === 'quarterly' && selectedQuarter) {
      // Quarterly view - only include data from selected quarter
      Array.from(categoryMap.entries()).forEach(([category, stats]) => {
        const quarterEmissions = stats.quarterlyData[selectedQuarter];
        totalScopeEmissions += quarterEmissions;
        
        categories.push({
          category,
          totalEmissions: quarterEmissions,
          entries: Object.keys(stats.monthlyCollections)
            .filter(month => getMonthsInQuarter(selectedQuarter).includes(month))
            .reduce((sum, month) => sum + (stats.monthlyCollections[month]?.length || 0), 0),
          percentage: 0
        });
      });
      
    } else if (viewMode === 'monthly' && selectedMonth) {
      // Monthly view - check if we have monthly data or need to use quarterly
      Array.from(categoryMap.entries()).forEach(([category, stats]) => {
        let monthlyEmissions = 0;
        let monthlyEntries = 0;
        
        // Check if we have actual monthly data
        if (stats.monthlyCollections[selectedMonth]?.length > 0) {
          // Use actual monthly data
          monthlyEmissions = stats.monthlyData[selectedMonth] || 0;
          monthlyEntries = stats.monthlyCollections[selectedMonth].length;
        } else {
          // No monthly data found - check if we have quarterly data
          let monthQuarter: Quarter | null = null;
          if (['Apr', 'May', 'Jun'].includes(selectedMonth)) {
            monthQuarter = 'Q1 (Apr-Jun)';
          } else if (['Jul', 'Aug', 'Sep'].includes(selectedMonth)) {
            monthQuarter = 'Q2 (Jul-Sep)';
          } else if (['Oct', 'Nov', 'Dec'].includes(selectedMonth)) {
            monthQuarter = 'Q3 (Oct-Dec)';
          } else if (['Jan', 'Feb', 'Mar'].includes(selectedMonth)) {
            monthQuarter = 'Q4 (Jan-Mar)';
          }
          
          if (monthQuarter && stats.quarterlyData[monthQuarter] > 0) {
            // Divide quarterly data equally among months
            const quarterMonths = getMonthsInQuarter(monthQuarter);
            monthlyEmissions = stats.quarterlyData[monthQuarter] / quarterMonths.length;
            monthlyEntries = 1;
          }
        }
        
        totalScopeEmissions += monthlyEmissions;
        
        categories.push({
          category,
          totalEmissions: monthlyEmissions,
          entries: monthlyEntries,
          percentage: 0
        });
      });
    }
  
    // Calculate percentages
    const finalCategories = categories.map(cat => ({
      ...cat,
      percentage: totalScopeEmissions > 0
        ? Math.round((cat.totalEmissions / totalScopeEmissions) * 100)
        : 0
    })).sort((a, b) => b.totalEmissions - a.totalEmissions);
  
    setTotalEmissions(totalScopeEmissions);
    setCategoryData(finalCategories);
  
    // 📈 Yearly trend only
    if (viewMode === 'yearly') {
      const trend: MonthlyTrend[] = FY_MONTHS.map(month => ({
        month,
        emissions: monthlyData[month] || 0,
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

            <TabsContent value="breakdown" className="space-y-4 overflow-visible">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Emissions by Category</CardTitle>
                    <CardDescription>Total emissions breakdown by purchased energy type</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-visible">
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
                  <CardHeader className="overflow-visible">
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
              </div>
            </TabsContent>

            <TabsContent value="trends">
              {viewMode === 'yearly' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trend - FY {selectedYear}</CardTitle>
                    <CardDescription>Track emissions across the fiscal year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[280px]">
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={monthlyTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
                          <YAxis label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }} />
                          <Tooltip
                            formatter={(value: number) => `${value.toFixed(2)} tCO₂e`}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="emissions" stroke="#6366f1" strokeWidth={2} name="Emissions (tCO₂e)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
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

            <TabsContent value="distribution" className='overflow-visible'>
              <Card>
                <CardHeader>
                  <CardTitle>Emission Distribution</CardTitle>
                  <CardDescription>Relative contribution by source type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={categoryData}
                      barCategoryGap={40}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                      <YAxis
                        label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }}
                        domain={[0, 'dataMax + 1']}
                        tickFormatter={(value: number) => value.toFixed(2)}
                      />
                      <Tooltip formatter={(value: number) => `${Number(value).toFixed(2)} tCO₂e`} />
                      <Legend />
                      <Bar
                        dataKey="totalEmissions"
                        fill="#6366f1"
                        name="Emissions (tCO₂e)"
                        barSize={60}
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

export default Scope2Dashboard;