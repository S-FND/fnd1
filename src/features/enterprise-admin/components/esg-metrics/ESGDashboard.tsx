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
import ChartComponent from './graphShow';

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
}

const ESGDashboard: React.FC<ESGDashboardProps> = ({ materialTopics }) => {
  const [configuredMetrics, setConfiguredMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [dataEntries, setDataEntries] = useState<MetricDataEntry[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('12months');
  const [selectedUnit, setSelectedUnit] = useState<string>('organization');
  const [viewMode, setViewMode] = useState<'charts' | 'trends' | 'comparison'>('charts');

  // Load data on component mount
  useEffect(() => {
    const savedMetrics = localStorage.getItem('savedESGMetrics');
    const savedEntries = localStorage.getItem('esgDataEntries');
    
    if (savedMetrics) {
      try {
        setConfiguredMetrics(JSON.parse(savedMetrics));
      } catch (error) {
        console.error('Error loading metrics:', error);
      }
    }
    
    if (savedEntries) {
      try {
        setDataEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    }
  }, []);

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
    const monthly = processedData.reduce((acc, entry) => {
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
  }, [processedData]);

  // Year-on-year comparison
  const yearlyComparison = useMemo(() => {
    const yearly = processedData.reduce((acc, entry) => {
      const year = entry.year.toString();
      if (!acc[year]) {
        acc[year] = { year, values: [], count: 0 };
      }
      acc[year].values.push(Number(entry.value) || 0);
      acc[year].count++;
      return acc;
    }, {} as Record<string, { year: string; values: number[]; count: number }>);

    return Object.values(yearly).map(item => ({
      year: item.year,
      value: item.values.reduce((sum, val) => sum + val, 0) / item.count,
      total: item.values.reduce((sum, val) => sum + val, 0),
      count: item.count
    }));
  }, [processedData]);

  // Category-wise breakdown
  const categoryBreakdown = useMemo(() => {
    const categories = configuredMetrics.reduce((acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = { 
          category: metric.category, 
          metrics: 0, 
          entries: 0,
          latestValues: []
        };
      }
      acc[metric.category].metrics++;
      
      const metricEntries = dataEntries.filter(entry => entry.metricId === metric.id);
      acc[metric.category].entries += metricEntries.length;
      
      if (metricEntries.length > 0) {
        const latest = metricEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        if (latest && !isNaN(Number(latest.value))) {
          acc[metric.category].latestValues.push(Number(latest.value));
        }
      }
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(categories).map((cat: any) => ({
      ...cat,
      averageValue: cat.latestValues.length > 0 
        ? cat.latestValues.reduce((sum: number, val: number) => sum + val, 0) / cat.latestValues.length 
        : 0
    }));
  }, [configuredMetrics, dataEntries]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const renderMetricOverview = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {configuredMetrics.slice(0, 4).map((metric, index) => {
        const metricEntries = dataEntries.filter(entry => entry.metricId === metric.code);
        const latestEntry = metricEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const previousEntry = metricEntries[1];
        
        let trend = 0;
        if (latestEntry && previousEntry) {
          const latest = Number(latestEntry.value) || 0;
          const previous = Number(previousEntry.value) || 0;
          trend = ((latest - previous) / previous) * 100;
        }

        return (
          <Card key={metric.code}>
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
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ESG Metrics Dashboard</h2>
          <p className="text-muted-foreground">Monitor and analyze your ESG performance</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organization">Organization Level</SelectItem>
              <SelectItem value="unit">Unit Level</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="12months">12 Months</SelectItem>
              <SelectItem value="24months">24 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Overview */}
      {renderMetricOverview()}

      {/* Main Dashboard Tabs */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
        <TabsList>
          <TabsTrigger value="charts">Charts & Trends</TabsTrigger>
          <TabsTrigger value="trends">Timeline Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Category Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-4">
            {/* <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Metric Analysis</CardTitle>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a metric" />
                    </SelectTrigger>
                    <SelectContent>
                      {configuredMetrics.map(metric => (
                        <SelectItem key={metric.id} value={metric.id}>
                          {metric.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {selectedMetric && processedData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a metric to view its trend analysis</p>
                  </div>
                )}
              </CardContent>
            </Card> */}
            <ChartComponent  />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Month-on-month performance</CardDescription>
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
                <CardDescription>Annual performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                {yearlyComparison.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={yearlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No yearly comparison data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, metrics }) => `${category} (${metrics})`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="metrics"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No category data available</p>
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