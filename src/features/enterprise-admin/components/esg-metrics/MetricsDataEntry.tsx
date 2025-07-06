
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
import { ESGMetricWithTracking } from '../../data/esgMetricsData';

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

interface MetricsDataEntryProps {
  materialTopics: MaterialTopic[];
}

const MetricsDataEntry: React.FC<MetricsDataEntryProps> = ({ materialTopics }) => {
  const [configuredMetrics, setConfiguredMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [dataEntries, setDataEntries] = useState<MetricDataEntry[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [entryValue, setEntryValue] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Load configured metrics from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedESGMetrics');
    if (saved) {
      try {
        const parsedMetrics = JSON.parse(saved);
        setConfiguredMetrics(parsedMetrics);
      } catch (error) {
        console.error('Error loading saved metrics:', error);
      }
    }
  }, []);

  // Load existing data entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('esgDataEntries');
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        setDataEntries(parsedEntries);
      } catch (error) {
        console.error('Error loading data entries:', error);
      }
    }
  }, []);

  // Save data entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('esgDataEntries', JSON.stringify(dataEntries));
  }, [dataEntries]);

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
      frequency: metric.collectionFrequency,
      value: entryValue,
      date: entryDate,
      topicId: metric.relatedTopic
    };

    setDataEntries(prev => [newEntry, ...prev]);
    
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
      case 'Bi-Annually': return 'bg-indigo-100 text-indigo-800';
      case 'Annually': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (lastEntry: string, frequency: string) => {
    if (!lastEntry) return true;
    
    const lastEntryDate = new Date(lastEntry);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (frequency) {
      case 'Daily': return daysDiff >= 1;
      case 'Weekly': return daysDiff >= 7;
      case 'Monthly': return daysDiff >= 30;
      case 'Quarterly': return daysDiff >= 90;
      case 'Bi-Annually': return daysDiff >= 180;
      case 'Annually': return daysDiff >= 365;
      default: return false;
    }
  };

  const getLastEntryDate = (metricId: string) => {
    const entries = dataEntries.filter(entry => entry.metricId === metricId);
    if (entries.length === 0) return null;
    return entries[0].date; // Since entries are sorted by newest first
  };

  const metricsNeedingData = configuredMetrics.filter(metric => {
    const lastEntry = getLastEntryDate(metric.id);
    return isOverdue(lastEntry || '', metric.collectionFrequency);
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
                          {metric.collectionFrequency} • {metric.unit}
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

      {/* Available Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Metrics ({configuredMetrics.length})</CardTitle>
          <CardDescription>
            All metrics configured for data collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configuredMetrics.length > 0 ? (
            <div className="grid gap-3">
              {configuredMetrics.map(metric => {
                const lastEntry = getLastEntryDate(metric.id);
                const needsData = isOverdue(lastEntry || '', metric.collectionFrequency);
                
                return (
                  <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getFrequencyColor(metric.collectionFrequency)}>
                          {metric.collectionFrequency}
                        </Badge>
                        {needsData && (
                          <Badge variant="destructive">Data Needed</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">Last Entry:</div>
                      <div>{lastEntry || 'Never'}</div>
                      <div className="text-muted-foreground mt-1">Unit: {metric.unit}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No metrics configured yet</p>
              <p className="text-sm text-muted-foreground">Configure metrics in the Metrics Configuration tab first</p>
            </div>
          )}
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
              {metricsNeedingData.map(metric => {
                const lastEntry = getLastEntryDate(metric.id);
                
                return (
                  <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getFrequencyColor(metric.collectionFrequency)}>
                          {metric.collectionFrequency}
                        </Badge>
                        <Badge variant="destructive">Overdue</Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">Last Entry:</div>
                      <div>{lastEntry || 'Never'}</div>
                    </div>
                  </div>
                );
              })}
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
