import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle2, Clock, Database } from "lucide-react";
import { GHGSourceTemplate } from '@/types/ghg-source-template';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Scope4Dashboard from '../dashboards/Scope4Dashboard';
import { httpClient } from '@/lib/httpClient';

type DataStatus = 'No Data' | 'Draft' | 'Submitted' | 'Verified';

type ScopeAccessType = 'data-collector' | 'data-verifier';

export interface CurrentAccessItem {
  id: string;
  access: ScopeAccessType;
}

export interface Scope4NewWorkflowProps {
  currentAccess: CurrentAccessItem[];
  isParent?: boolean;
}

export const Scope4NewWorkflow: React.FC<Scope4NewWorkflowProps> = ({
  currentAccess,
  isParent = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sourceTemplates, setSourceTemplates] = useState<GHGSourceTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showDashboard, setShowDashboard] = useState(false);

  // useEffect(() => {
  //   loadSourceTemplates();
  // }, []);

  let getDataSource = async () => {
    try {
      let dataSourceResponse: { status: number; data: any[] } = await httpClient.get(`ghg-accounting/source/4`);
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
          avoidedEmissionType: item.avoidedEmissionType,

          createdDate: item.createdAt,  // mapping backend → frontend naming
          createdBy: "",                // backend doesn’t have this value
          access: isParent
            ? 'data-collector'
            : currentAccess.find(ca => ca.id === item._id)?.access ?? null
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
  };

  // const loadSourceTemplates = () => {
  //   const key = 'scope4_source_templates';
  //   const stored = localStorage.getItem(key);
  //   if (stored) {
  //     setSourceTemplates(JSON.parse(stored));
  //   }
  // };

  const getDataStatus = (templateId: string): DataStatus => {
    const dataKey = `ghg_activity_data_${templateId}`;
    const data = localStorage.getItem(dataKey);

    if (!data) return 'No Data';

    const parsed = JSON.parse(data);
    if (parsed.status === 'verified') return 'Verified';
    if (parsed.status === 'submitted') return 'Submitted';
    return 'Draft';
  };

  const handleDefineNewSource = () => {
    navigate('/ghg-accounting/scope4/define-source');
  };

  const handleEditSource = (template: GHGSourceTemplate) => {
    navigate(`/ghg-accounting/scope4/define-source?id=${template._id}`, { state: { template } });
  };

  const handleCollectData = (template: GHGSourceTemplate) => {
    navigate('/ghg-accounting/scope4/collect-data?templateId=' + template._id, {
      state: { template, month: new Date().toLocaleString('en-US', { month: 'long' }), year: new Date().getFullYear() }
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
      case 'Submitted':
        return <Badge variant="default" className="gap-1"><Clock className="h-3 w-3" />Submitted</Badge>;
      case 'Verified':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle2 className="h-3 w-3" />Verified</Badge>;
    }
  };

  const categories = ['All', ...Array.from(new Set(sourceTemplates.map(t => t.sourceType)))];

  const filteredTemplates = selectedCategory === 'All'
    ? sourceTemplates
    : sourceTemplates.filter(t => t.sourceType === selectedCategory);

  const getCategorySummary = () => {
    const categoryMap = new Map<string, { count: number; withData: number }>();

    sourceTemplates.forEach(template => {
      const current = categoryMap.get(template.sourceType || '') || { count: 0, withData: 0 };
      current.count += 1;
      const status = getDataStatus(template._id);
      if (status !== 'No Data') {
        current.withData += 1;
      }
      categoryMap.set(template.sourceType || '', current);
    });

    return categoryMap;
  };

  const categorySummary = getCategorySummary();
  const sourceTypes = ['Product Use', 'Product Manufacturing', 'Energy Generation', 'Transportation', 'Product End-of-Life'];

  if (showDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setShowDashboard(false)}>
            ← Back to Sources
          </Button>
        </div>
        <Scope4Dashboard />
      </div>
    );
  }

  useEffect(() => {
    getDataSource();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Scope 4: Avoided Emissions</CardTitle>
              <CardDescription>
                Define avoided emission sources and collect impact data
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
          {/* Category Summary */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {sourceTypes.map(type => {
              const summary = categorySummary.get(type) || { count: 0, withData: 0 };
              return (
                <Card key={type} className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedCategory(type)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summary.count}</div>
                    <p className="text-xs text-muted-foreground">
                      {summary.withData} with data
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avoided Emission Sources</CardTitle>
          <CardDescription>
            Defined sources for impact tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No emission sources defined yet</p>
              <p className="text-sm mb-4">Define your Scope 4 sources to start tracking avoided emissions</p>
              <Button onClick={handleDefineNewSource}>
                <Plus className="mr-2 h-4 w-4" />
                Define First Source
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Name</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Avoided Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Data Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map(template => {
                  const status = getDataStatus(template._id);
                  return (
                    <TableRow key={template._id}>
                      <TableCell className="font-medium">{template.sourceDescription}</TableCell>
                      <TableCell>{template.facilityName}</TableCell>
                      <TableCell>{template.sourceType}</TableCell>
                      <TableCell className="text-xs">{template.avoidedEmissionType || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{template.measurementFrequency}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {template.access == 'data-collector' && <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleCollectData(template)}
                          >
                            <Database className="h-4 w-4 mr-1" />
                            Collect Data
                          </Button>}
                          {/* <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleCollectData(template)}
                          >
                            Collect Data
                          </Button> */}
                          {/* <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditSource(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSource(template._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope4NewWorkflow;