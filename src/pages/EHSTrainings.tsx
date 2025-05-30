
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EHSTrainingsList from '@/components/ehs/EHSTrainingsList';
import EHSTrainingsCalendar from '@/components/ehs/EHSTrainingsCalendar';
import EHSTrainingForm from '@/components/ehs/EHSTrainingForm';

const EHSTrainingsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('list');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EHS Trainings</h1>
          <p className="text-muted-foreground">
            Manage EHS trainings and view scheduled sessions with client companies
          </p>
        </div>
        
        <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Trainings List</TabsTrigger>
            <TabsTrigger value="calendar">Training Calendar</TabsTrigger>
            {isAdmin && <TabsTrigger value="create">Add New Training</TabsTrigger>}
          </TabsList>
          <TabsContent value="list">
            <EHSTrainingsList />
          </TabsContent>
          <TabsContent value="calendar">
            <EHSTrainingsCalendar />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="create">
              <EHSTrainingForm onComplete={() => setActiveTab('list')} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default EHSTrainingsPage;
