import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Building2 } from 'lucide-react';
import { ESGMetricWithTracking } from '../../data/esgMetricsData';
import { httpClient } from '@/lib/httpClient';
import CustomDashboardTab from './custom-graph';
import MetricsGraph1 from './graphShow1';
import GroupedBarChart from './graphTemp1';
import NestedStackedBarChart from './graphTemp1';
import { logger } from '@/hooks/logger';
// import { SmartChart } from '@/components/charts/SmartChart';
import DynamicYearFilter, { getCurrentFinancialYear } from "@/hooks/DynamicYearFilter"; 
interface MetricDataEntry {
  id: string;
  metricId: string;
  metricName: string;
  unit: string;
  frequency: string;
  value: any;
  date: string;
  topicId: string;
  dataType: string;
  financialYear: string;
  unitLevel?: string; // For unit-level tracking
}

interface ESGDashboardProps {
  materialTopics: any[];
  finalMetricsList: ESGMetricWithTracking[],
}

const ESGDashboard: React.FC<ESGDashboardProps> = ({ materialTopics, finalMetricsList }) => {
  const [configuredMetrics, setConfiguredMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [dataEntries, setDataEntries] = useState<MetricDataEntry[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('12months');
  const [selectedUnit, setSelectedUnit] = useState<string>('organization');
  const [viewMode, setViewMode] = useState<'charts' | 'trends' | 'comparison'>('charts');
  const [selectedTrendYear, setSelectedTrendYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedTrendMonth, setSelectedTrendMonth] = useState<string>('all');

  const [selectedYear, setSelectedYear] = useState<string>(getCurrentFinancialYear());
  const [graphData, setGraphData] = useState<any>({});
  logger.info('activeTab', viewMode, "viewMode");

  const getGraphData = async (year: string) => {
    try {
      let response = await httpClient.get(`materiality/metrics/graph-data?year=${year}`);

      if (response && response.data && response.data['status']) {
        const apiData = response.data['data'];

        // Transform API data to match MetricDataEntry interface
        const transformedDataEntries: MetricDataEntry[] = [];
        const transformedMetrics: ESGMetricWithTracking[] = [];

        // Map period names to month numbers (for FY starting April)
        const periodToMonthMap: Record<string, number> = {
          'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9,
          'October': 10, 'November': 11, 'December': 12, 'January': 1, 'February': 2, 'March': 3
        };

        Object.entries(apiData).forEach(([metricName, metricInfo]: [string, any]) => {
          // Create metric configuration
          transformedMetrics.push({
            id: metricName.trim(),
            name: metricName.trim(),
            category: metricInfo.data[0]?.topicId || 'General',
            collectionFrequency: 'Monthly',
            unit: metricInfo.units || ''
          } as ESGMetricWithTracking);

          // Transform each data point
          metricInfo.data.forEach((entry: any, index: number) => {
            // Convert period to date
            const monthNum = periodToMonthMap[entry.period] || 1;
            const yearToUse = monthNum >= 4 ? parseInt(year.split('-')[0]) : parseInt(year.split('-')[1]);
            const isoDate = `${yearToUse}-${String(monthNum).padStart(2, '0')}-01`;

            transformedDataEntries.push({
              id: `${metricName}-${index}`,
              metricId: metricName.trim(),
              metricName: metricName.trim(),
              unit: metricInfo.units || '',
              frequency: 'Monthly',
              value: entry.value,
              date: isoDate,
              topicId: entry.topicId,
              dataType: entry.dataType || 'unknown',
              financialYear: year,
              // Add unitLevel for aggregation (use fake units for now)
              unitLevel: ['Manufacturing', 'Operations', 'R&D', 'Logistics'][index % 4]
            });
          });
        });

        setConfiguredMetrics(transformedMetrics);
        setDataEntries(transformedDataEntries);
        setGraphData(apiData);
      }
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    // const savedMetrics = localStorage.getItem('savedESGMetrics');
    // const savedEntries = localStorage.getItem('esgDataEntries');

    // if (savedMetrics) {
    //   try {
    //     setConfiguredMetrics(JSON.parse(savedMetrics));
    //   } catch (error) {
    //     console.error('Error loading metrics:', error);
    //   }
    // }

    // if (savedEntries) {
    //   try {
    //     setDataEntries(JSON.parse(savedEntries));
    //   } catch (error) {
    //     console.error('Error loading entries:', error);
    //   }
    // }
    logger.log('selectedYear', selectedYear);
    getGraphData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    logger.log('selectedYear changed', selectedYear);
    logger.log('getCurrentFinancialYear', getCurrentFinancialYear());
  }, [selectedYear]);

  const generatePeriods = (frequency: string, financialYear: string) => {
    if (!financialYear) return [];
    const [startYearStr, endYearStr] = financialYear.split("-"); // e.g. "2025", "2026"
    const startYear = parseInt(startYearStr);
    const endYear = parseInt(endYearStr);

    const periods: { period: string; periodIndex: number; dueDate: string }[] = [];

    switch (frequency) {
      case "Quarterly":
        periods.push(
          { period: "Q1", periodIndex: 1, dueDate: `${startYear}-06-30` }, // Apr–Jun
          { period: "Q2", periodIndex: 2, dueDate: `${startYear}-09-30` }, // Jul–Sep
          { period: "Q3", periodIndex: 3, dueDate: `${startYear}-12-31` }, // Oct–Dec
          { period: "Q4", periodIndex: 4, dueDate: `${endYear}-03-31` } // Jan–Mar (next year)
        );
        break;

      case "Monthly":
        const months = [
          { name: "April", year: startYear, month: 4 },
          { name: "May", year: startYear, month: 5 },
          { name: "June", year: startYear, month: 6 },
          { name: "July", year: startYear, month: 7 },
          { name: "August", year: startYear, month: 8 },
          { name: "September", year: startYear, month: 9 },
          { name: "October", year: startYear, month: 10 },
          { name: "November", year: startYear, month: 11 },
          { name: "December", year: startYear, month: 12 },
          { name: "January", year: endYear, month: 1 },
          { name: "February", year: endYear, month: 2 },
          { name: "March", year: endYear, month: 3 },
        ];

        months.forEach((m, idx) => {
          const daysInMonth = new Date(m.year, m.month, 0).getDate();
          const monthNum = String(m.month).padStart(2, "0");
          periods.push({
            period: m.name,
            periodIndex: idx + 1,
            dueDate: `${m.year}-${monthNum}-${daysInMonth}`,
          });
        });
        break;

      case "Bi-Annually":
        periods.push(
          { period: "H1", periodIndex: 1, dueDate: `${startYear}-09-30` }, // Apr–Sep
          { period: "H2", periodIndex: 2, dueDate: `${endYear}-03-31` } // Oct–Mar (next year)
        );
        break;

      case "Annually":
        periods.push({
          period: "Annual",
          periodIndex: 1,
          dueDate: `${endYear}-03-31`, // End of financial year
        });
        break;

      case "Weekly":
        {
          // Start = April 1st of startYear, End = March 31st of endYear
          const startDate = new Date(startYear, 3, 1); // April = month 3 (0-based)
          const endDate = new Date(endYear, 2, 31); // March
          let weekIndex = 1;
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
            periods.push({
              period: `Week ${weekIndex}`,
              periodIndex: weekIndex,
              dueDate: new Date(d).toISOString().split("T")[0],
            });
            weekIndex++;
          }
        }
        break;

      case "Daily":
        {
          const startDate = new Date(startYear, 3, 1); // Apr 1
          const endDate = new Date(endYear, 2, 31); // Mar 31
          let dayIndex = 1;
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            periods.push({
              period: `Day ${dayIndex}`,
              periodIndex: dayIndex,
              dueDate: d.toISOString().split("T")[0],
            });
            dayIndex++;
          }
        }
        break;

      default:
        periods.push({
          period: "Single Entry",
          periodIndex: 1,
          dueDate: `${endYear}-03-31`,
        });
    }

    return periods;
  };


  // Process data for charts
  const processedData = useMemo(() => {
    if (!selectedMetric) return [];

    const metric = configuredMetrics.find(m => m.id === selectedMetric);
    if (!metric) return [];

    const metricEntries = dataEntries
      .filter(entry => entry.metricId === selectedMetric)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return metricEntries.map(entry => ({
      date: entry.date,
      value: typeof entry.value === 'string' && !isNaN(Number(entry.value))
        ? Number(entry.value)
        : entry.value,
      month: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      year: new Date(entry.date).getFullYear(),
      financialYear: entry.financialYear,
      unitLevel: entry.unitLevel || 'organization'
    }));
  }, [selectedMetric, dataEntries, configuredMetrics]);

  // Aggregate data by unit level
  const aggregatedData = useMemo(() => {
    const grouped = processedData.reduce((acc, entry) => {
      const key = selectedUnit === 'organization' ? 'organization' : entry.unitLevel;
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {} as Record<string, typeof processedData>);

    return Object.entries(grouped).map(([unit, entries]) => ({
      unit,
      totalValue: entries.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0),
      avgValue: entries.length > 0 ? entries.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0) / entries.length : 0,
      entries: entries.length,
      trend: entries.length > 1 ? ((Number(entries[entries.length - 1].value) || 0) - (Number(entries[0].value) || 0)) : 0
    }));
  }, [processedData, selectedUnit]);

  // Month-on-month trend data
  const monthlyTrends = useMemo(() => {
    let filteredData = processedData;

    // Filter by selected year and month
    if (selectedTrendYear) {
      filteredData = processedData.filter(entry => entry.year.toString() === selectedTrendYear);
    }

    if (selectedTrendMonth !== 'all') {
      filteredData = filteredData.filter(entry => {
        const entryMonth = new Date(entry.date).getMonth();
        return entryMonth.toString() === selectedTrendMonth;
      });
    }

    const monthly = filteredData.reduce((acc, entry) => {
      const monthKey = entry.month;
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, values: [], count: 0 };
      }
      acc[monthKey].values.push(Number(entry.value) || 0);
      acc[monthKey].count++;
      return acc;
    }, {} as Record<string, { month: string; values: number[]; count: number }>);

    return Object.values(monthly)
      .map(item => ({
        month: item.month,
        value: item.values.reduce((sum, val) => sum + val, 0) / item.count,
        count: item.count
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [processedData, selectedTrendYear, selectedTrendMonth]);

  // Year-on-year comparison with enhanced trend analysis
  const yearlyComparison = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearly = processedData.reduce((acc, entry) => {
      const year = entry.year.toString();
      if (!acc[year]) {
        acc[year] = { year, values: [], count: 0, isCurrentYear: entry.year === currentYear };
      }
      acc[year].values.push(Number(entry.value) || 0);
      acc[year].count++;
      return acc;
    }, {} as Record<string, { year: string; values: number[]; count: number; isCurrentYear: boolean }>);

    return Object.values(yearly)
      .map(item => ({
        year: item.isCurrentYear ? `${item.year} (YTD)` : item.year,
        value: item.values.reduce((sum, val) => sum + val, 0) / item.count,
        total: item.values.reduce((sum, val) => sum + val, 0),
        count: item.count,
        isCurrentYear: item.isCurrentYear
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [processedData]);

  // Add this before your return statement
  const categoryBreakdown = useMemo(() => {
    // Count metrics by ESG category using finalMetricsList
    const esgCounts = {
      Environmental: 0,
      Social: 0,
      Governance: 0
    };

    // Go through each metric in your graphData
    Object.keys(graphData).forEach(metricName => {
      // Find the corresponding metric in finalMetricsList
      const finalMetric = finalMetricsList.find(m => m.name === metricName);

      if (finalMetric && finalMetric.esg) {
        const esgCat = finalMetric.esg.trim();
        if (esgCat.toLowerCase().includes('environ')) {
          esgCounts.Environmental++;
        } else if (esgCat.toLowerCase().includes('social')) {
          esgCounts.Social++;
        } else if (esgCat.toLowerCase().includes('govern')) {
          esgCounts.Governance++;
        }
      }
    });

    // Create breakdown array with only categories that have metrics
    const breakdown = [];
    if (esgCounts.Environmental > 0) {
      breakdown.push({ category: 'Environmental', metrics: esgCounts.Environmental });
    }
    if (esgCounts.Social > 0) {
      breakdown.push({ category: 'Social', metrics: esgCounts.Social });
    }
    if (esgCounts.Governance > 0) {
      breakdown.push({ category: 'Governance', metrics: esgCounts.Governance });
    }

    return breakdown;
  }, [graphData, finalMetricsList]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const renderMetricOverview = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {configuredMetrics.slice(0, 4).map((metric, index) => {
        const metricEntries = dataEntries.filter(entry => entry.metricId === metric.id);
        const latestEntry = metricEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const previousEntry = metricEntries[1];

        let trend = 0;
        if (latestEntry && previousEntry) {
          const latest = Number(latestEntry.value) || 0;
          const previous = Number(previousEntry.value) || 0;
          trend = ((latest - previous) / previous) * 100;
        }

        return (
          <Card key={metric.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className="text-2xl font-bold">
                {latestEntry ? String(latestEntry.value) : 'No data'}
                {latestEntry && <span className="text-xs text-muted-foreground ml-1">{metric.unit}</span>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                {trend !== 0 && (
                  <>
                    {trend > 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
                      {Math.abs(trend).toFixed(1)}%
                    </span>
                    <span className="ml-1">vs previous</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      {/* {renderMetricOverview()} */}

      {/* Main Dashboard Tabs */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
        {/* Centered Title above Charts & Trends tabs */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold tracking-tight">ESG Metrics Dashboard</h2>
          <p className="text-muted-foreground">Monitor and analyze your ESG performance</p>
        </div>

        <TabsList>
          <TabsTrigger value="charts">Charts & Trends</TabsTrigger>
          <TabsTrigger value="trends">Timeline Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Category Comparison</TabsTrigger>
        </TabsList>

        {/* Header Controls */}
        <div className="flex justify-end gap-2 mb-6">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(graphData).map(metric => (
                <SelectItem key={metric} disabled={viewMode !== 'trends' && graphData[metric].graphType == 'Numeric'} value={metric}>{metric}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organization">Organization Level</SelectItem>
              <SelectItem value="unit">Unit Level</SelectItem>
            </SelectContent>
          </Select>

          <DynamicYearFilter
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            className="w-[180px]"
            showCurrentYearIndicator
          />

          {viewMode !== 'trends' && (
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {generatePeriods(
                  finalMetricsList?.find((m) => m.name === selectedMetric)?.collectionFrequency || 'Monthly',
                  selectedYear
                ).map((period) => (
                  <SelectItem key={period.periodIndex} value={period.period}>
                    {period.period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metric Analysis</CardTitle>
              <CardDescription>Charts for metrics configured to display on dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomDashboardTab graphData={graphData} selectedMetric={selectedMetric} selectedPeriod={selectedPeriod} selectedYear={selectedYear} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* <NestedStackedBarChart graphData={graphData} /> */}
          <MetricsGraph1 graphData={graphData} selectedMetric={selectedMetric} selectedPeriod={selectedPeriod} selectedYear={selectedYear} />
          {/* <div className="grid gap-6 md:grid-cols-2">
          
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Month-on-month performance</CardDescription>
                <div className="flex gap-2 mt-4">
                  <Select value={selectedTrendYear} onValueChange={setSelectedTrendYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        // Sample years + years from data
                        const currentYear = new Date().getFullYear();
                        const sampleYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];
                        const dataYears = Array.from(new Set(processedData.map(entry => entry.year.toString())));
                        const allYears = Array.from(new Set([...sampleYears.map(y => y.toString()), ...dataYears]))
                          .sort((a, b) => Number(b) - Number(a));

                        return allYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>

                  <Select value={selectedTrendMonth} onValueChange={setSelectedTrendMonth}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {new Date(2000, i).toLocaleDateString('en-US', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {monthlyTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No monthly trend data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Year-on-Year Comparison</CardTitle>
                <CardDescription>Trend from data collection start to current year till date</CardDescription>
              </CardHeader>
              <CardContent>
                {yearlyComparison.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={yearlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value, name, props) => [
                        value,
                        props.payload.isCurrentYear ? 'Current Year (YTD)' : 'Full Year'
                      ]} />
                      <Bar
                        dataKey="value"
                        fill="#ffc658"
                        stroke="#f39c12"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No yearly comparison data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div> */}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ESG Category Breakdown</CardTitle>
                <CardDescription>Distribution across Environmental, Social, and Governance</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryBreakdown.length > 0 ? (
                  <div className="space-y-6">
                    {/* Pie Chart */}
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryBreakdown} // This has the correct data: [{ category: 'Environmental', metrics: 4 }, { category: 'Social', metrics: 3 }]
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ category, metrics }) => `${category} (${metrics})`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="metrics" // This tells the pie chart to use the 'metrics' field as the value
                          >
                            {categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value} metrics`,
                              `${props.payload.category}`
                            ]}
                          />
                          <Legend
                            content={({ payload }) => {
                              return (
                                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                                  {categoryBreakdown.map((cat, index) => (
                                    <li key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          width: '12px',
                                          height: '12px',
                                          backgroundColor: COLORS[index % COLORS.length], // Use the same color mapping
                                          marginRight: '5px'
                                        }}
                                      />
                                      <span>{cat.category} ({cat.metrics})</span> {/* Use original data */}
                                    </li>
                                  ))}
                                </ul>
                              );
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Metric List Below - CLEAN & READABLE */}
                    <div className="mt-4 p-4 bg-white border rounded-lg">
                      <h4 className="font-semibold mb-3">Metrics by Category</h4>
                      {categoryBreakdown.map((cat) => (
                        <div key={cat.category} className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[categoryBreakdown.findIndex(c => c.category === cat.category) % COLORS.length] }}
                            />
                            <span className="font-medium">{cat.category} ({cat.metrics})</span>
                          </div>
                          <ul className="ml-6 list-disc space-y-1 text-sm">
                            {Object.keys(graphData).filter(metricName => {
                              const finalMetric = finalMetricsList.find(m => m.name === metricName);
                              if (!finalMetric) return false;
                              const esg = finalMetric.esg?.trim().toLowerCase() || '';
                              if (cat.category === 'Environmental') return esg.includes('environ');
                              if (cat.category === 'Social') return esg.includes('social');
                              if (cat.category === 'Governance') return esg.includes('govern');
                              return false;
                            }).map(metricName => (
                              <li key={metricName}>{metricName}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No ESG category data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Unit Level Aggregation</CardTitle>
                <CardDescription>Performance across different organizational units</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUnit === 'unit' && aggregatedData.length > 0 ? (
                  <div className="space-y-3">
                    {aggregatedData.map((unit, index) => (
                      <div key={unit.unit} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{unit.unit}</p>
                            <p className="text-sm text-muted-foreground">{unit.entries} entries</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{unit.avgValue.toFixed(2)}</p>
                          <div className="flex items-center text-xs">
                            {unit.trend > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : unit.trend < 0 ? (
                              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            ) : null}
                            <span className={unit.trend > 0 ? 'text-green-500' : unit.trend < 0 ? 'text-red-500' : 'text-muted-foreground'}>
                              {unit.trend.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{selectedUnit === 'organization' ? 'Switch to Unit Level view' : 'No unit-level data available'}</p>
                    <p className="text-sm">Add unit-level data entries to see aggregation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGDashboard;