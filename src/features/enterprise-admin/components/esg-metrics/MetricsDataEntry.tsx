
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Save, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface MaterialTopic {
  id: string;
  name: string;
  category: string;
  businessImpact: number;
  sustainabilityImpact: number;
  color: string;
  description: string;
  framework?: string;
}

interface MetricDataEntry {
  id: string;
  metricId: string;
  metricName: string;
  unit: string;
  frequency: string;
  value: string;
  date: string;
  topicId: string;
}

interface ConfiguredMetric {
  id: string;
  name: string;
  unit: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  topicId: string;
  topicName: string;
  lastEntry?: string;
  nextDue?: string;
}

interface MetricsDataEntryProps {
  materialTopics: MaterialTopic[];
}

const MetricsDataEntry: React.FC<MetricsDataEntryProps> = ({ materialTopics }) => {
  const [configuredMetrics, setConfiguredMetrics] = useState<ConfiguredMetric[]>([]);
  const [dataEntries, setDataEntries] = useState<MetricDataEntry[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [entryValue, setEntryValue] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Load configured metrics (in a real app, this would come from your backend)
  useEffect(() => {
    // Simulate some configured metrics
    const mockMetrics: ConfiguredMetric[] = [
      {
        id: 'metric_1',
        name: 'Greenhouse Gas Emissions',
        unit: 'Metric tons CO2e',
        frequency: 'Monthly',
        topicId: 'climate',
        topicName: 'Climate Change',
        lastEntry: '2024-05-15',
        nextDue: '2024-06-15'
      },
      {
        id: 'metric_2',
        name: 'Water Consumption',
        unit: 'Cubic meters',
        frequency: 'Monthly',
        topicId: 'water',
        topicName: 'Water Management',
        lastEntry: '2024-05-10',
        nextDue: '2024-06-10'
      },
      {
        id: 'metric_3',
        name: 'Employee Training Hours',
        unit: 'Hours',
        frequency: 'Quarterly',
        topicId: 'employeeWellbeing',
        topicName: 'Employee Wellbeing',
        lastEntry: '2024-03-31',
        nextDue: '2024-06-30'
      },
      {
        id: 'metric_4',
        name: 'Gender Diversity Ratio',
        unit: 'Percentage',
        frequency: 'Annually',
        topicId: 'diversity',
        topicName: 'Diversity & Inclusion',
        lastEntry: '2023-12-31',
        nextDue: '2024-12-31'
      }
    ];
    
    setConfiguredMetrics(mockMetrics);
  }, []);

  // Load existing data entries
  useEffect(() => {
    // Simulate some existing data entries
    const mockEntries: MetricDataEntry[] = [
      {
        id: 'entry_1',
        metricId: 'metric_1',
        metricName: 'Greenhouse Gas Emissions',
        unit: 'Metric tons CO2e',
        frequency: 'Monthly',
        value: '245.67',
        date: '2024-05-15',
        topicId: 'climate'
      },
      {
        id: 'entry_2',
        metricId: 'metric_2',
        metricName: 'Water Consumption',
        unit: 'Cubic meters',
        frequency: 'Monthly',
        value: '1,234',
        date: '2024-05-10',
        topicId: 'water'
      }
    ];
    
    setDataEntries(mockEntries);
  }, []);

  const handleSubmitData = () => {
    if (!selectedMetric || !entryValue || !entryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const metric = configuredMetrics.find(m => m.id === selectedMetric);
    if (!metric) return;

    const newEntry: MetricDataEntry = {
      id: `entry_${Date.now()}`,
      metricId: selectedMetric,
      metricName: metric.name,
      unit: metric.unit,
      frequency: metric.frequency,
      value: entryValue,
      date: entryDate,
      topicId: metric.topicId
    };

    setDataEntries(prev => [newEntry, ...prev]);
    
    // Update the metric's last entry date
    setConfiguredMetrics(prev => prev.map(m => 
      m.id === selectedMetric 
        ? { ...m, lastEntry: entryDate }
        : m
    ));

    // Reset form
    setSelectedMetric('');
    setEntryValue('');
    setEntryDate(new Date().toISOString().split('T')[0]);
    
    toast.success('Data entry submitted successfully');
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Daily': return 'bg-red-100 text-red-800';
      case 'Weekly': return 'bg-orange-100 text-orange-800';
      case 'Monthly': return 'bg-blue-100 text-blue-800';
      case 'Quarterly': return 'bg-purple-100 text-purple-800';
      case 'Annually': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (nextDue?: string) => {
    if (!nextDue) return false;
    return new Date(nextDue) < new Date();
  };

  const metricsNeedingData = configuredMetrics.filter(metric => {
    const lastEntry = metric.lastEntry ? new Date(metric.lastEntry) : null;
    const today = new Date();
    
    if (!lastEntry) return true;
    
    switch (metric.frequency) {
      case 'Daily':
        return (today.getTime() - lastEntry.getTime()) >= 24 * 60 * 60 * 1000;
      case 'Weekly':
        return (today.getTime() - lastEntry.getTime()) >= 7 * 24 * 60 * 60 * 1000;
      case 'Monthly':
        return today.getMonth() !== lastEntry.getMonth() || today.getFullYear() !== lastEntry.getFullYear();
      case 'Quarterly':
        return Math.floor(today.getMonth() / 3) !== Math.floor(lastEntry.getMonth() / 3) || 
               today.getFullYear() !== lastEntry.getFullYear();
      case 'Annually':
        return today.getFullYear() !== lastEntry.getFullYear();
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Data Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Data Entry</CardTitle>
          <CardDescription>
            Enter data for your configured ESG metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="metric-select">Select Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a metric..." />
                </SelectTrigger>
                <SelectContent>
                  {configuredMetrics.map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>
                      <div className="flex flex-col">
                        <span>{metric.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {metric.topicName} • {metric.frequency}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="entry-value">Value</Label>
              <Input
                id="entry-value"
                value={entryValue}
                onChange={(e) => setEntryValue(e.target.value)}
                placeholder="Enter value..."
              />
              {selectedMetric && (
                <p className="text-xs text-muted-foreground mt-1">
                  Unit: {configuredMetrics.find(m => m.id === selectedMetric)?.unit}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="entry-date">Date</Label>
              <Input
                id="entry-date"
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleSubmitData} className="w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Submit Data Entry
          </Button>
        </CardContent>
      </Card>

      {/* Metrics Needing Data */}
      {metricsNeedingData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Metrics Requiring Data ({metricsNeedingData.length})
            </CardTitle>
            <CardDescription>
              These metrics need data based on their collection frequency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {metricsNeedingData.map(metric => (
                <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{metric.name}</h4>
                    <p className="text-sm text-muted-foreground">{metric.topicName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getFrequencyColor(metric.frequency)}>
                        {metric.frequency}
                      </Badge>
                      {isOverdue(metric.nextDue) && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">Last Entry:</div>
                    <div>{metric.lastEntry || 'Never'}</div>
                    {metric.nextDue && (
                      <>
                        <div className="text-muted-foreground mt-1">Next Due:</div>
                        <div className={isOverdue(metric.nextDue) ? 'text-red-600' : ''}>
                          {metric.nextDue}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Data Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Data Entries
          </CardTitle>
          <CardDescription>
            Latest ESG metric data submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dataEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataEntries.slice(0, 10).map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.metricName}</TableCell>
                    <TableCell>{entry.value}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.unit}</TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>
                      <Badge className={getFrequencyColor(entry.frequency)}>
                        {entry.frequency}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No data entries yet</p>
              <p className="text-sm text-muted-foreground">Start by adding data for your configured metrics above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsDataEntry;
