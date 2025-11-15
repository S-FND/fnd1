import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { GHGSourceTemplate } from '@/types/ghg-source-template';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type DataStatus = 'No Data' | 'Draft' | 'Submitted' | 'Verified';

export const Scope4NewWorkflow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sourceTemplates, setSourceTemplates] = useState<GHGSourceTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadSourceTemplates();
  }, []);

  const loadSourceTemplates = () => {
    const key = 'scope4_source_templates';
    const stored = localStorage.getItem(key);
    if (stored) {
      setSourceTemplates(JSON.parse(stored));
    }
  };

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
    navigate('/ghg-accounting/scope4/define-source', { state: { template } });
  };

  const handleCollectData = (template: GHGSourceTemplate) => {
    navigate('/ghg-data-collection', { 
      state: { sourceId: template.id, scope: 4 } 
    });
  };

  const handleDeleteSource = (id: string) => {
    const key = 'scope4_source_templates';
    const filtered = sourceTemplates.filter(t => t.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    setSourceTemplates(filtered);
    
    toast({
      title: "Source Deleted",
      description: "The emission source has been removed.",
      variant: "destructive",
    });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <Button onClick={handleDefineNewSource}>
          <Plus className="mr-2 h-4 w-4" />
          Define New Source
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scope 4 Avoided Emission Sources</CardTitle>
          <CardDescription>
            Manage your avoided emission sources and collect data
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
                  const status = getDataStatus(template.id);
                  return (
                    <TableRow key={template.id}>
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
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleCollectData(template)}
                          >
                            Collect Data
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditSource(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSource(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
