import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { GHGSourceTemplate } from '@/types/ghg-source-template';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SourceTemplateManagerProps {
  scope: 1 | 2 | 3 | 4;
  templates: GHGSourceTemplate[];
  onAdd: () => void;
  onEdit: (template: GHGSourceTemplate) => void;
  onDelete: (id: string) => void;
  onCollectData: (template: GHGSourceTemplate) => void;
}

export const SourceTemplateManager: React.FC<SourceTemplateManagerProps> = ({
  scope,
  templates,
  onAdd,
  onEdit,
  onDelete,
  onCollectData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.sourceCategory)))];

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.sourceCategory === selectedCategory);

  return (
    <div className="space-y-4">
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
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Define New Source
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emission Sources (Step 1: Definition)</CardTitle>
          <CardDescription>
            Defined emission sources for Scope {scope}. Click "Collect Data" to enter measurements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No emission sources defined yet.</p>
              <p className="text-sm">Click "Define New Source" to start tracking emissions.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Name</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Emission Factor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map(template => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.sourceDescription}</TableCell>
                    <TableCell>{template.facilityName}</TableCell>
                    <TableCell>{template.sourceCategory}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.measurementFrequency}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {template.emissionFactor} {template.emissionFactorUnit}
                    </TableCell>
                    <TableCell>
                      {template.isActive ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onCollectData(template)}
                        >
                          Collect Data
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SourceTemplateManager;
