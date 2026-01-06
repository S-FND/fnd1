import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Database, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { GHGSourceTemplate, GHGDataCollection } from '@/types/ghg-source-template';
import { SourceType } from '@/types/scope1-ghg';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import TimePeriodFilter, { ViewMode } from '../shared/TimePerformanceFilter';
import Scope1Dashboard from '../dashboards/Scope1Dashboard';
import { httpClient } from '@/lib/httpClient';
import { get } from 'http';
import { AuthProvider } from '@/context/AuthContext';

type DataStatus = 'No Data' | 'Draft' | 'Under Review' | 'Reviewed';

type ScopeAccessType = 'data-collector' | 'data-verifier';

export interface CurrentAccessItem {
  id: string;
  access: ScopeAccessType;
}

export interface Scope1NewWorkflowProps {
  currentAccess: CurrentAccessItem[];
  isParent?: boolean;
}

export const Scope1NewWorkflow: React.FC<Scope1NewWorkflowProps> = ({
  currentAccess,
  isParent = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sourceTemplates, setSourceTemplates] = useState<GHGSourceTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SourceType | 'All'>('All');
  const [showDashboard, setShowDashboard] = useState(false);


  // useEffect(() => {
  //   loadSourceTemplates();
  // }, []);

  const loadSourceTemplates = () => {
    const key = 'scope1_source_templates';
    const stored = localStorage.getItem(key);
    if (stored) {
      setSourceTemplates(JSON.parse(stored));
    }
  };

  let getDataSource = async () => {
    try {
      let dataSourceResponse: { status: number; data: any[] } = await httpClient.get(`ghg-accounting/source/1`);
      console.log("dataSourceResponse", dataSourceResponse);
      if (dataSourceResponse.status === 200) {
        const dataCollections: GHGSourceTemplate[] = dataSourceResponse.data.map(item => ({
          _id: item._id,
          scope: 1, // or from item if available
          facilityName: item.facilityName,
          businessUnit: item.businessUnit,
          sourceCategory: item.sourceCategory,
          sourceDescription: item.sourceDescription,
          emissionFactorId: item.emissionFactorId,
          emissionFactor: item.emissionFactor,
          emissionFactorUnit: item.emissionFactorUnit,
          emissionFactorSource: item.emissionFactorSource,
          activityDataUnit: item.activityDataUnit,
          measurementFrequency: item.measurementFrequency,
          assignedDataCollectors: item.assignedDataCollectors,
          assignedVerifiers: item.assignedVerifiers,
          ghgIncluded: item.ghgIncluded,
          calculationMethodology: item.calculationMethodology,
          dataSource: item.dataSource,
          isActive: item.isActive,
          notes: item.notes,
          sourceType: item.sourceType,
          fuelSubstanceType: item.fuelSubstanceType,

          createdDate: item.createdAt,  // mapping backend → frontend naming
          createdBy: "",                // backend doesn’t have this value
          access: currentAccess.find(ca => ca.id === item._id)?.access || 'data-collector',
        }));
        // let dataCollections: GHGSourceTemplate[] = dataSourceResponse.data;
        setSourceTemplates(dataCollections);
      }
    } catch (error) {
      console.error("Error fetching data collections:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data collections.",
        variant: "destructive",
      });
    }
  }

  const getDataStatus = (templateId: string): DataStatus => {
    const statusKey = `scope1_status_${templateId}_${selectedMonth}_${selectedYear}`;
    const status = localStorage.getItem(statusKey);

    if (status === 'Draft') return 'Draft';
    if (status === 'Under Review') return 'Under Review';
    if (status === 'Reviewed') return 'Reviewed';

    const dataKey = `scope1_data_collections_${templateId}_${selectedMonth}_${selectedYear}`;
    const hasData = localStorage.getItem(dataKey);
    return hasData ? 'Draft' : 'No Data';
  };

  const handleDefineNewSource = () => {
    navigate('/ghg-accounting/scope1/define-source');
  };

  const handleEditSource = (template: GHGSourceTemplate) => {
    console.log("Editing template:", template);
    navigate(`/ghg-accounting/scope1/define-source?id=${template._id}`, { state: { template } });
  };

  const handleCollectData = (template: GHGSourceTemplate) => {
    navigate('/ghg-accounting/scope1/collect-data?templateId=' + template._id, {
      state: { template, month: selectedMonth, year: selectedYear }
    });
  };

  const handleDeleteSource = async (templateId: string) => {
    // const key = 'scope1_source_templates';
    // const filtered = sourceTemplates.filter(t => t._id !== id);
    // localStorage.setItem(key, JSON.stringify(filtered));
    // setSourceTemplates(filtered);
    try {
      let deleteResponse: { status: number; data: any } = await httpClient.delete(`ghg-accounting/source/${templateId}`);
      if (deleteResponse.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to delete the emission source.",
          variant: "destructive",
        });
        throw new Error('Failed to delete source');
      }
      else {
        getDataSource();
        toast({
          title: "Source Deleted",
          description: "The emission source has been removed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the emission source.",
        variant: "destructive",
      });
      return;
    }


  };

  const getStatusBadge = (status: DataStatus) => {
    switch (status) {
      case 'No Data':
        return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" />No Data</Badge>;
      case 'Draft':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Draft</Badge>;
      case 'Under Review':
        return <Badge variant="default" className="gap-1"><Clock className="h-3 w-3" />Under Review</Badge>;
      case 'Reviewed':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle2 className="h-3 w-3" />Reviewed</Badge>;
    }
  };

  const categories: Array<SourceType | 'All'> = ['All', 'Stationary', 'Mobile', 'Fugitive', 'Process'];

  const filteredTemplates = selectedCategory === 'All'
    ? sourceTemplates
    : sourceTemplates.filter(t => t.sourceType === selectedCategory);

  const getCategorySummary = () => {
    const categoryMap = new Map<SourceType, { count: number; withData: number }>();

    sourceTemplates.forEach(template => {
      const current = categoryMap.get(template.sourceType as SourceType) || { count: 0, withData: 0 };
      current.count += 1;
      const status = getDataStatus(template._id);
      if (status !== 'No Data') {
        current.withData += 1;
      }
      categoryMap.set(template.sourceType as SourceType, current);
    });

    return categoryMap;
  };

  const categorySummary = getCategorySummary();

  useEffect(() => {
    getDataSource();
  }, []);

  if (showDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setShowDashboard(false)}>
            ← Back to Sources
          </Button>
        </div>
        <Scope1Dashboard />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Scope 1: Direct Emissions</CardTitle>
                <CardDescription>
                  Define emission sources and collect activity data
                </CardDescription>
              </div>
              {isParent && <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDashboard(true)}>
                  <Database className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
                <Button onClick={handleDefineNewSource}>
                  <Plus className="mr-2 h-4 w-4" />
                  Define New Source
                </Button>
              </div>}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <TimePeriodFilter
              viewMode={viewMode}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onViewModeChange={setViewMode}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />

            {/* Category Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['Stationary', 'Mobile', 'Fugitive', 'Process'] as SourceType[]).map(cat => {
                const summary = categorySummary.get(cat) || { count: 0, withData: 0 };
                return (
                  <Card key={cat} className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedCategory(cat)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{cat}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.count}</div>
                      <p className="text-xs text-muted-foreground">
                        {summary.withData} with data for {viewMode === 'monthly' ? selectedMonth : selectedYear}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                  {cat !== 'All' && ` (${sourceTemplates.filter(t => t.sourceType === cat).length})`}
                </Button>
              ))}
            </div>

            {/* Source Templates Table */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Emission Sources Defined</h3>
                <p className="text-muted-foreground mb-4">
                  Start by defining emission sources. You'll then be able to collect data against them.
                </p>
                <Button onClick={handleDefineNewSource}>
                  <Plus className="mr-2 h-4 w-4" />
                  Define First Source
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Name</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Status ({viewMode === 'monthly' ? selectedMonth : 'Year'} {selectedYear})</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map(template => {
                      const status = getDataStatus(template._id);
                      return (
                        <TableRow key={template._id} className="cursor-pointer hover:bg-accent/50"
                          onClick={() => handleCollectData(template)}>
                          <TableCell className="font-medium">{template.sourceDescription}</TableCell>
                          <TableCell>{template.facilityName}</TableCell>
                          <TableCell><Badge variant="outline">{template.sourceCategory}</Badge></TableCell>
                          <TableCell><Badge variant="secondary">{template.measurementFrequency}</Badge></TableCell>
                          <TableCell>
                            {template.access}
                          </TableCell>
                          <TableCell>{getStatusBadge(status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              {template.access == 'data-collector' && <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleCollectData(template)}
                              >
                                <Database className="h-4 w-4 mr-1" />
                                Collect Data
                              </Button>}

                              {template.access == 'data-verifier' && <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleCollectData(template)}
                              >
                                <Database className="h-4 w-4 mr-1" />
                                Verify Data
                              </Button>}
                              {isParent && <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditSource(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              }
                              {isParent && <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteSource(template._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              }
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Scope1NewWorkflow;