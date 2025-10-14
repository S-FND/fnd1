
import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Save, TrendingUp, Plus, Edit3, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { ESGMetricWithTracking } from '../../data/esgMetricsData';
import FlexibleDataInput from './FlexibleDataInput';
import { httpClient } from '@/lib/httpClient';
import { logger } from '@/hooks/logger';
import { PageAccessContext } from '@/context/PageAccessContext';


interface MaterialTopic {
  id: string;
  topic: string;
  esg: string;
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
  value: any; // Changed to any to support different data types
  date: string;
  topicId: string;
  dataType: string;
  financialYear: string;
  esg: string;
  industry: string;
  period?: string; // e.g., "Q1", "January", "Week 1", etc.
  periodIndex?: number; // For ordering periods
  locationId?: string; // Location identifier
}

interface MetricPeriod {
  id: string;
  metricId: string;
  period: string;
  periodIndex: number;
  value: any;
  isCompleted: boolean;
  dueDate: string;
}

interface MetricsDataEntryProps {
  materialTopics: MaterialTopic[];
  finalMetrics: ESGMetricWithTracking[]
}

const financialYearList = [
  { value: "2020-2021", label: "2020-2021" },
  { value: "2021-2022", label: "2021-2022" },
  { value: "2022-2023", label: "2022-2023" },
  { value: "2023-2024", label: "2023-2024" },
  { value: "2024-2025", label: "2024-2025" },
  { value: "2025-2026", label: "2025-2026" },
];
export interface LocationData {
  _id: string; // use string if you serialize from backend
  name: string;
  unitId: string;
}

const MetricsDataEntry: React.FC<MetricsDataEntryProps> = ({ materialTopics, finalMetrics }) => {
  const [configuredMetrics, setConfiguredMetrics] = useState<ESGMetricWithTracking[]>([]);
  const [dataEntries, setDataEntries] = useState<MetricDataEntry[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [entryValue, setEntryValue] = useState<any>('');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>(financialYearList.reverse()[0].value);
  const [showBulkEntry, setShowBulkEntry] = useState<boolean>(false);
  const [bulkEntries, setBulkEntries] = useState<{ [key: string]: any }>({});
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const {userRole}=useContext(PageAccessContext)
  const [locations, setLocations] = useState<LocationData[]>([]);

  // Available locations
  // const locations = ['Mumbai Office', 'Delhi Warehouse', 'Bangalore Manufacturing', 'Chennai Office'];


  const getMetricsKpiData = async (selectedYear) => {
    try {
      let subQuery = `?year=${selectedYear}`;
      if(userRole == 'employee' && selectedLocation){
        subQuery += `&locationId=${selectedLocation}`
      }
      let metricDataResponse = await httpClient.get(`materiality/metrics/data-entry${subQuery}`);
      if (metricDataResponse['data']['status']) {
        const metricsEntries = metricDataResponse['data']['data']['metricsEntries'];
        
        let flattenedEntries = [];
        
        if (Array.isArray(metricsEntries)) {
          flattenedEntries = metricsEntries.flatMap(entry => {
            if (Array.isArray(entry)) {
              return entry;
            } else if (typeof entry === 'object' && entry !== null) {
              return [entry];
            }
            return [];
          });
        } else {
          flattenedEntries = [];
        }
        
        setDataEntries(flattenedEntries);
      } else {
        setDataEntries([]);
      }
    } catch (error) {
      logger.error("Error fetching metrics KPI data:", error);
      setDataEntries([]); 
    }
  }

  



  // Load existing data entries from localStorage
  // useEffect(() => {
    // const savedEntries = localStorage.getItem('esgDataEntries');
    // if (savedEntries) {
    //   try {
    //     const parsedEntries = JSON.parse(savedEntries);
    //     setDataEntries(parsedEntries);
    //   } catch (error) {
    //     console.error('Error loading data entries:', error);
    //   }
    // }
  //   getMetricsKpiData(selectedFinancialYear);
  // }, [selectedFinancialYear]);

  // Save data entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('esgDataEntries', JSON.stringify(dataEntries));
  }, [dataEntries]);

  const handleSubmitData = async () => {
    if (!selectedMetric || !entryValue || !selectedPeriod) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate location selection. put a check if location is selected if logged user is employee
    if (!selectedLocation && userRole == 'employee') {
      toast.error('Please select a location');
      return;
    }

    let tempParsedMetric: ESGMetricWithTracking = JSON.parse(selectedMetric);
    const metric = configuredMetrics?.find(m => m.code === tempParsedMetric.code && m.name === tempParsedMetric.name);
    if (!metric) return;
    logger.log(`metric ==> `, metric)

    // Check if entry already exists for this period
    const existingEntryIndex = dataEntries.findIndex(entry =>
      entry.metricId === tempParsedMetric.code &&
      entry.metricName === tempParsedMetric.name &&
      entry.period === selectedPeriod &&
      entry.financialYear === selectedFinancialYear
      // entry.location === selectedLocation
    );

    const newEntry: MetricDataEntry = {
      id: existingEntryIndex >= 0 ? dataEntries[existingEntryIndex].id : `entry_${Date.now()}`,
      metricId: tempParsedMetric.code,
      metricName: metric.name,
      unit: metric.unit,
      frequency: metric.collectionFrequency,
      value: entryValue,
      date: entryDate,
      topicId: metric.topic,
      dataType: metric.dataType,
      financialYear: selectedFinancialYear,
      industry: metric.industry ? metric.industry : '',
      esg: metric.esg,
      period: selectedPeriod,
      periodIndex: getAvailablePeriods(tempParsedMetric.code, tempParsedMetric.name).find(p => p.period === selectedPeriod)?.periodIndex || 0,
      locationId: selectedLocation
    };
    let dataEntryResponse = await httpClient.post('materiality/metrics/data-entry', newEntry)
    // console.log(`dataEntryResponse`, dataEntryResponse)
    if (dataEntryResponse['data']['status']) {
      toast.success('Data entry submitted successfully');
      getMetricsKpiData(selectedFinancialYear);
    }
    // if (existingEntryIndex >= 0) {
    //   // Update existing entry
    //   setDataEntries(prev => {
    //     const updated = [...prev];
    //     updated[existingEntryIndex] = newEntry;
    //     return updated;
    //   });
    //   toast.success('Data entry updated successfully');
    // } else {
    //   // Add new entry
    //   setDataEntries(prev => [newEntry, ...prev]);
    //   toast.success('Data entry submitted successfully');
    // }

    // Reset form
    setSelectedMetric('');
    setEntryValue('');
    setSelectedPeriod('');
    setEntryDate(new Date().toISOString().split('T')[0]);
    setSelectedLocation('');
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

  const getAllEntryPeriod = (metricId: string) => {
    const entries = dataEntries.filter(entry => entry.metricId === metricId);
    if (entries.length === 0) return null;
    return entries.map((e) => e.period); // Since entries are sorted by newest first
  };

  // Generate periods based on frequency
  const generatePeriods = (frequency: string, financialYear: string) => {
    const year = parseInt(financialYear);
    const periods: { period: string; periodIndex: number; dueDate: string }[] = [];

    switch (frequency) {
      case 'Quarterly':
        periods.push(
          { period: 'Q1', periodIndex: 1, dueDate: `${year}-03-31` },
          { period: 'Q2', periodIndex: 2, dueDate: `${year}-06-30` },
          { period: 'Q3', periodIndex: 3, dueDate: `${year}-09-30` },
          { period: 'Q4', periodIndex: 4, dueDate: `${year}-12-31` }
        );
        break;
      case 'Monthly':
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];
        months.forEach((month, index) => {
          const monthNum = String(index + 1).padStart(2, '0');
          const daysInMonth = new Date(year, index + 1, 0).getDate();
          periods.push({
            period: month,
            periodIndex: index + 1,
            dueDate: `${year}-${monthNum}-${daysInMonth}`
          });
        });
        break;
      case 'Bi-Annually':
        periods.push(
          { period: 'H1', periodIndex: 1, dueDate: `${year}-06-30` },
          { period: 'H2', periodIndex: 2, dueDate: `${year}-12-31` }
        );
        break;
      case 'Annually':
        periods.push({ period: 'Annual', periodIndex: 1, dueDate: `${year}-12-31` });
        break;
      case 'Weekly':
        for (let week = 1; week <= 52; week++) {
          const weekDate = new Date(year, 0, 1 + (week - 1) * 7);
          periods.push({
            period: `Week ${week}`,
            periodIndex: week,
            dueDate: weekDate.toISOString().split('T')[0]
          });
        }
        break;
      case 'Daily':
        for (let day = 1; day <= 365; day++) {
          const dayDate = new Date(year, 0, day);
          periods.push({
            period: `Day ${day}`,
            periodIndex: day,
            dueDate: dayDate.toISOString().split('T')[0]
          });
        }
        break;
      default:
        periods.push({ period: 'Single Entry', periodIndex: 1, dueDate: `${year}-12-31` });
    }

    return periods;
  };

  // Get periods with completion status for a metric
  const getMetricPeriods = (metric: ESGMetricWithTracking): MetricPeriod[] => {
    const periods = generatePeriods(metric.collectionFrequency, selectedFinancialYear);
    // console.log(`getMetricPeriods :: metric ==> `,metric)
    // console.log(`getMetricPeriods :: dataEntries ==> `,dataEntries)
    return periods.map(period => {
      const existingEntry = dataEntries.find(entry =>
        entry.metricId === metric.code &&
        entry.period === period.period &&
        entry.financialYear === selectedFinancialYear &&
        entry.metricName === metric.name
      );

      return {
        id: `${metric.code}_${period.period}_${selectedFinancialYear}`,
        metricId: metric.code,
        period: period.period,
        periodIndex: period.periodIndex,
        value: existingEntry?.value || '',
        isCompleted: !!existingEntry,
        dueDate: period.dueDate,
        metricName: metric.name
      };
    });
  };

  // Get available periods for selected metric
  const getAvailablePeriods = (metricId: string, metricName: string) => {
    // console.log('metricId',metricId)
    const metric = configuredMetrics?.find(m => m.code === metricId && m.name === metricName);
    if (!metric) return [];
    return getMetricPeriods(metric);
  };

  type PeriodType = "weekly" | "monthly" | "quarterly" | "bi-annually";

  function getAllPeriodTillNow(date: Date = new Date(), type: PeriodType): string[] {

    if (!type) return [];

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based
    const periods: string[] = [];

    switch (type) {
      case "monthly": {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        for (let m = 0; m <= month; m++) {
          periods.push(`${monthNames[m]}`);
        }
        break;
      }

      case "quarterly": {
        const currentQuarter = Math.floor(month / 3) + 1;
        for (let q = 1; q <= currentQuarter; q++) {
          periods.push(`Q${q}`);
        }
        break;
      }

      case "bi-annually": {
        const currentHalf = month < 6 ? 1 : 2;
        for (let h = 1; h <= currentHalf; h++) {
          periods.push(`H${h}`);
        }
        break;
      }

      case "weekly": {
        // Calculate ISO weeks till now
        const firstDayOfYear = new Date(year, 0, 1);
        const days = Math.floor((date.getTime() - firstDayOfYear.getTime()) / 86400000);
        const currentWeek = Math.ceil((days + firstDayOfYear.getDay() + 1) / 7);
        for (let w = 1; w <= currentWeek; w++) {
          periods.push(`Week ${w}`);
        }
        break;
      }
    }

    return periods;
  }



  const metricsNeedingData = configuredMetrics?.filter(metric => {

    if (!metric || !metric.collectionFrequency) return false;

    const lastEntry = getLastEntryDate(metric.code);
    const allEntryPeriod = getAllEntryPeriod(metric.code)
    let allPeriodsTillDate = getAllPeriodTillNow(new Date(), metric.collectionFrequency.toLowerCase() as PeriodType);
    let checkEntries=dataEntries.filter((entry) => entry.metricName == metric.name && entry.financialYear == selectedFinancialYear );
    const missingPeriods = allPeriodsTillDate.filter(
      p => !checkEntries.some(e => e.period === p)
    );
    
    // console.log(`metric ==> `, metric.name)
    // console.log(`allPeriodsTillDate ==> `, allPeriodsTillDate)
    // console.log(`checkEntries ==> `, checkEntries)
    // console.log(`missingPeriods ==> `, missingPeriods)
    // return isOverdue(lastEntry || '', metric.collectionFrequency);
    return missingPeriods.length>0;
  }) || [];

  const getUserAccessLevel = async() => {
    try {
      let accessData=await httpClient.get('subuser/access');
      if(accessData['data']['status']){
        if(accessData['data']['locationsData'] && accessData['data']['locationsData'].length>0){
          // let locs=accessData['locationsData'].map((loc) => loc.name)
          setLocations(accessData['data']['locationsData'])
          setSelectedLocation(accessData['data']['locationsData'][0]._id)
          // if(locs.length==1){
          //   setSelectedLocation(locs[0])
          // }
        }
      }
    } catch (error) {
      logger.error("Error fetching user access level:", error);
      throw new Error('Failed to fetch user access level');
    }
  }



  useEffect(() => {
    if (selectedPeriod && selectedMetric && selectedFinancialYear && dataEntries) {
      let checkExistingValue = dataEntries.filter((entry) => entry.financialYear == selectedFinancialYear && entry.period == selectedPeriod && entry.metricId == JSON.parse(selectedMetric).code && entry.metricName == JSON.parse(selectedMetric).name);
      // console.log(`selectedMetric == checkExistingValue => `, checkExistingValue)
      if (checkExistingValue && checkExistingValue.length > 0 && checkExistingValue[0]['value']) {
        setEntryValue(checkExistingValue[0]['value'])
      }
    }

  }, [selectedPeriod, selectedMetric, selectedFinancialYear])
  // useEffect(() => {
  //   console.log(`bulkEntries => `, bulkEntries)
  // }, [bulkEntries])

  // useEffect(() => {
  //   console.log(`dataEntries => `, dataEntries)
  // }, [bulkEntries])



  useEffect(() => {
    if(userRole){
      if(userRole == 'employee'){
        getUserAccessLevel()
      }
    }
  }, [userRole])

  useEffect(() => {
    if(userRole !== 'employee'){
      getMetricsKpiData(selectedFinancialYear);
      setConfiguredMetrics(finalMetrics)
    }
    else{
      if(selectedLocation){
        getMetricsKpiData(selectedFinancialYear);
        setConfiguredMetrics(finalMetrics)
      }
    }
  }, [finalMetrics,selectedFinancialYear,userRole,selectedLocation]);

  return (
    <div className="space-y-6">
      {/* Data Entry Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ESG Data Entry</CardTitle>
              <CardDescription>
                Enter data for your configured ESG metrics for financial year {selectedFinancialYear}
                {selectedLocation && ` at ${locations.find(loc => loc._id === selectedLocation)?.name}`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
            {userRole == 'employee' && <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  
                  {locations && locations.map(location => (
                    <SelectItem key={location._id} value={location._id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {location.name} ({location.unitId})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>}
              <Select value={selectedFinancialYear} onValueChange={setSelectedFinancialYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {

                    financialYearList.map((year) => {
                      // const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year.value} value={year.label}>
                          {year.label}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowBulkEntry(!showBulkEntry)}
              >
                {showBulkEntry ? <Edit3 className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {showBulkEntry ? 'Single Entry' : 'Bulk Entry'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showBulkEntry ? (
            // Single Entry Mode
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metric-select">Select Metric</Label>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric} >
                    <SelectTrigger style={{ "whiteSpace": "nowrap", "textOverflow": "ellipsis" }}>
                      <SelectValue placeholder="Choose a metric..." />
                    </SelectTrigger>
                    <SelectContent >
                      {configuredMetrics?.map(metric => (
                        <SelectItem key={metric.id} value={JSON.stringify(metric)}>
                          <div className="flex flex-col">
                            <span>{metric.name}</span>
                            {/* <span className="text-xs text-muted-foreground">
                              {metric.collectionFrequency} • {metric.dataType}
                            </span> */}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="period-select">Period</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod} disabled={!selectedMetric}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a period..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMetric && getAvailablePeriods(JSON.parse(selectedMetric).code, JSON.parse(selectedMetric).name).map(period => (
                        <SelectItem key={period.id} value={period.period}>
                          <div className="flex items-center justify-between w-full">
                            <span>{period.period}</span>
                            {period.isCompleted && (
                              <Badge variant="secondary" className="ml-2">Completed</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              {selectedMetric && selectedPeriod && (
                <div className="p-4 border rounded-lg">
                  <div className="mb-3">
                    <h4 className="font-medium">Data Entry for {selectedPeriod}</h4>
                    <p className="text-sm text-muted-foreground">
                      {configuredMetrics?.find(m => m.id === JSON.parse(selectedMetric).id)?.name}
                    </p>
                  </div>
                  <FlexibleDataInput
                    metric={configuredMetrics?.find(m => m.code === JSON.parse(selectedMetric)?.code && m.name == JSON.parse(selectedMetric)?.name)!}
                    value={entryValue}
                    onChange={setEntryValue}
                  />
                </div>
              )}

              <Button
                onClick={handleSubmitData}
                className="w-full md:w-auto"
                disabled={!selectedMetric || !entryValue || !selectedPeriod}
              >
                <Save className="w-4 h-4 mr-2" />
                {selectedPeriod && getAvailablePeriods(JSON.parse(selectedMetric).code, JSON.parse(selectedMetric).name).find(p => p.period === selectedPeriod)?.isCompleted
                  ? 'Update Data Entry'
                  : 'Submit Data Entry'}
              </Button>
            </div>
          ) : (
            // Bulk Entry Mode
            <div className="space-y-6">
              <div className="text-center py-4 border-2 border-dashed rounded-lg">
                <h3 className="font-medium text-lg mb-2">Bulk Data Entry</h3>
                <p className="text-muted-foreground">
                  Enter data for multiple metrics at once for financial year {selectedFinancialYear}
                </p>
              </div>

              <div className="grid gap-6">
                {configuredMetrics?.map(metric => {
                  const periods = getMetricPeriods(metric);
                  const completedPeriods = periods.filter(p => p.isCompleted).length;

                  return (
                    <div key={metric.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{metric.name}</h4>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge className={getFrequencyColor(metric.collectionFrequency)}>
                              {metric.collectionFrequency}
                            </Badge>
                            <Badge variant="outline">{metric.dataType}</Badge>
                            <Badge variant="secondary">
                              {completedPeriods}/{periods.length} periods completed
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <h5 className="font-medium text-sm">Period-based Data Entry:</h5>
                        <div className="grid gap-2 max-h-60 overflow-y-auto">
                          {periods.map(period => (
                            <div key={period.id} className="flex items-center gap-3 p-2 border rounded">
                              <div className="flex-1">
                                <span className="text-sm font-medium">{period.period}</span>
                                {period.isCompleted && (
                                  <Badge variant="secondary" className="ml-2">Completed</Badge>
                                )}
                              </div>
                              <div className="flex-1">
                                <FlexibleDataInput
                                  metric={metric}
                                  value={bulkEntries[`${metric.code}_${metric.name}_${period.period}`] ??
                                    period.value ??
                                    ""}
                                  onChange={(value) => {
                                    // Update the period value in bulk entries
                                    setBulkEntries(prev => ({
                                      ...prev,
                                      [`${metric.code}_${metric.name}_${period.period}`]: value
                                    }));
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    // Submit all bulk entries
                    const currentDate = new Date().toISOString().split('T')[0];
                    const newEntries: MetricDataEntry[] = [];
                    // debugger;
                    // console.log("=====>>> ", Object.entries(bulkEntries)
                    //   .filter(([_, value]) => value && value !== ''))
                    // Object.entries(bulkEntries)
                    //   .filter(([_, value]) => value && value !== '')
                    //   .forEach(([key, value]) => {
                    //     const [metricId, period] = key.includes('_') && !key.startsWith('entry_') 
                    //       ? key.split('_').slice(0, -1).join('_') + '_' + key.split('_').slice(-1)[0]
                    //       : [key, 'Single Entry'];

                    //     const metric = configuredMetrics.find(m => m.code === metricId.split('_')[0])!;
                    //     if (!metric) return;

                    //     const periodData = period !== 'Single Entry' 
                    //       ? getMetricPeriods(metric).find(p => p.period === period.split('_').slice(-1)[0])
                    //       : { periodIndex: 1 };

                    //     // Check for existing entry
                    //     const existingEntryIndex = dataEntries.findIndex(entry => 
                    //       entry.metricId === metricId.split('_')[0] && 
                    //       entry.period === (period !== 'Single Entry' ? period.split('_').slice(-1)[0] : undefined) && 
                    //       entry.financialYear === selectedFinancialYear
                    //     );

                    //     const entry: MetricDataEntry = {
                    //       id: existingEntryIndex >= 0 ? dataEntries[existingEntryIndex].id : `entry_${Date.now()}_${metricId}_${period}`,
                    //       metricId: metricId.split('_')[0],
                    //       metricName: metric.name,
                    //       unit: metric.unit,
                    //       frequency: metric.collectionFrequency,
                    //       value,
                    //       date: currentDate,
                    //       topicId: metric.topic,
                    //       dataType: metric.dataType,
                    //       financialYear: selectedFinancialYear,
                    //       esg:metric.esg,
                    //       industry:metric.industry,
                    //       period: period !== 'Single Entry' ? period.split('_').slice(-1)[0] : undefined,
                    //       periodIndex: periodData?.periodIndex || 1
                    //     };
                    //     console.log(`entry => `,entry)
                    //     newEntries.push(entry);
                    //   });
                    Object.entries(bulkEntries)
                      .filter(([_, value]) => value !== '' && value !== null && value !== undefined) // keeps 0 and false
                      .forEach(([key, value]) => {
                        let metricId: string;
                        let period: string;
                        let metricName:string;

                        // Extract metricId and period correctly
                        if (key.includes('_') && !key.startsWith('entry_')) {
                          const parts = key.split('_');
                          period = parts.pop()!;       // last part = "January"
                          metricName=parts.pop()!;   // second last part = "Revenue"
                          metricId = parts.join('_');  // rest = "RR-BI-430a.1"
                        } else {
                          metricId = key;
                          period = 'Single Entry';
                          metricName=key;
                        }
                        console.log(`metricname => `, metricName) 
                        // Find matching metric
                        const metric = configuredMetrics?.find(m => m.code === metricId && m.name == metricName);
                        if (!metric) return;

                        // Find matching period object if applicable
                        const periodData = period !== 'Single Entry'
                          ? getMetricPeriods(metric).find(p => p.period === period)
                          : { periodIndex: 1 };

                        // Check for existing entry
                        const existingEntryIndex = dataEntries.findIndex(entry =>
                          entry.metricId === metricId &&
                          entry.metricName === metric.name &&
                          entry.period === (period !== 'Single Entry' ? period : undefined) &&
                          entry.financialYear === selectedFinancialYear
                        );

                        // Build new entry
                        const entry: MetricDataEntry = {
                          id: existingEntryIndex >= 0
                            ? dataEntries[existingEntryIndex].id
                            : `entry_${Date.now()}_${metricId}_${period}`,
                          metricId,
                          metricName: metric.name,
                          unit: metric.unit,
                          frequency: metric.collectionFrequency,
                          value,
                          date: currentDate,
                          topicId: metric.topic,
                          dataType: metric.dataType,
                          financialYear: selectedFinancialYear,
                          esg: metric.esg,
                          industry: metric.industry,
                          period: period !== 'Single Entry' ? period : undefined,
                          periodIndex: periodData?.periodIndex || 1
                        };

                        // console.log(`entry =>`, entry);
                        newEntries.push(entry);
                      });


                    if (newEntries.length > 0) {
                      let dataMultiEntryResponse = await httpClient.post('materiality/metrics/data-entry', newEntries)
                      // console.log(`dataMultiEntryResponse`, dataMultiEntryResponse)
                      if (dataMultiEntryResponse['data']['status']) {
                        toast.success('Data entry submitted successfully');
                        // Update existing entries and add new ones
                        setDataEntries(prev => {
                          const updated = [...prev];
                          newEntries.forEach(newEntry => {
                            const existingIndex = updated.findIndex(entry =>
                              entry.metricId === newEntry.metricId &&
                              entry.metricName === newEntry.metricName &&
                              entry.period === newEntry.period &&
                              entry.financialYear === newEntry.financialYear
                            );

                            if (existingIndex >= 0) {
                              updated[existingIndex] = newEntry;
                            } else {
                              updated.unshift(newEntry);
                            }
                          });
                          return updated;
                        });

                        setBulkEntries({});
                        toast.success(`${newEntries.length} data entries submitted successfully`);
                        getMetricsKpiData(selectedFinancialYear);

                      }
                    } else {
                      toast.error('Please enter data for at least one metric');
                    }
                  }}
                  className="flex-1"
                  disabled={Object.keys(bulkEntries).length === 0}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit All Entries
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBulkEntries({})}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Metrics ({configuredMetrics?.length})</CardTitle>
          <CardDescription>
            All metrics configured for data collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configuredMetrics?.length > 0 ? (
            <div className="grid gap-3">
              {configuredMetrics?.map(metric => {
                const periods = getMetricPeriods(metric);
                // console.log(`periods ==> `,periods)
                const completedPeriods = periods.filter(p => p.isCompleted).length;
                const totalPeriods = periods.length;
                const completionRate = totalPeriods > 0 ? Math.round((completedPeriods / totalPeriods) * 100) : 0;

                return (
                  <div key={metric.code} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{metric.name}</h4>
                        <p className="text-sm text-muted-foreground">{metric.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getFrequencyColor(metric.collectionFrequency)}>
                            {metric.collectionFrequency}
                          </Badge>
                          <Badge variant="outline">{metric.unit}</Badge>
                          <Badge variant={completionRate === 100 ? "default" : completionRate > 50 ? "secondary" : "destructive"}>
                            {completedPeriods}/{totalPeriods} completed ({completionRate}%)
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Period status grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {periods.slice(0, 12).map(period => (
                        <div
                          key={period.id}
                          className={`p-2 text-xs text-center rounded border ${period.isCompleted
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                        >
                          {period.period}
                        </div>
                      ))}
                      {periods.length > 12 && (
                        <div className="p-2 text-xs text-center rounded border bg-gray-50 border-gray-200 text-gray-600">
                          +{periods.length - 12} more
                        </div>
                      )}
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
                const lastEntry = getLastEntryDate(metric.code);

                return (
                  <div key={metric.code} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
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
                  <TableHead>Period</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Financial Year</TableHead>
                  <TableHead>Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataEntries.slice(0, 10).map(entry => {
                  let displayValue = entry.value;

                  // Format value based on data type
                  if (entry.dataType === 'Boolean') {
                    displayValue = entry.value === 'true' ? 'Yes' : 'No';
                  } else if (entry.dataType === 'Table' && Array.isArray(entry.value)) {
                    displayValue = `Table (${entry.value.length} rows)`;
                  } else if (Array.isArray(entry.value)) {
                    displayValue = entry.value.join(', ');
                  }

                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.metricName}</TableCell>
                      <TableCell>
                        {entry.period ? (
                          <Badge variant="secondary">{entry.period}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={String(displayValue)}>
                          {String(displayValue)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.dataType}</Badge>
                      </TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.financialYear}</TableCell>
                      <TableCell>
                        <Badge className={getFrequencyColor(entry.frequency)}>
                          {entry.frequency}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
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