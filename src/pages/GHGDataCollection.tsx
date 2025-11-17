import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Upload, Database, RefreshCw } from "lucide-react";
import DataCollectionScheduleView from '@/features/enterprise-admin/components/ghg/data-collection/DataCollectionSchedule';
import BulkDataImport from '@/features/enterprise-admin/components/ghg/data-collection/BulkDataImport';
import { EmissionFactorUpdater } from '@/components/ghg/EmissionFactorUpdater';

const GHGDataCollection: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">GHG Data Collection</h1>
        <p className="text-muted-foreground">
          Collect and manage period-wise activity data for emission sources
        </p>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Collection Schedule
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </TabsTrigger>
          <TabsTrigger value="factors" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Emission Factors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <DataCollectionScheduleView />
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <BulkDataImport />
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <EmissionFactorUpdater />
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Collection Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Individual Entry</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                <li>Click "Enter Data" on any source in the schedule view</li>
                <li>Fill in activity values for each period</li>
                <li>Add notes for context or explanations</li>
                <li>Import/export CSV templates for convenience</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Bulk Import</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                <li>Download the template with all your sources</li>
                <li>Fill in multiple sources and periods at once</li>
                <li>Upload the completed CSV file</li>
                <li>Review results and fix any validation errors</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Best Practices</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc ml-4">
              <li>Collect data regularly based on your measurement frequency</li>
              <li>Verify data accuracy before submission</li>
              <li>Add notes to document data sources and assumptions</li>
              <li>Use bulk import for historical data or multiple sources</li>
              <li>Track completion status in the schedule view</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GHGDataCollection;