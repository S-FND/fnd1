
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLayout } from '@/components/layout/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EHSTrainingsList from '@/components/ehs/EHSTrainingsList';
import EHSTrainingsCalendar from '@/components/ehs/EHSTrainingsCalendar';
import EHSTrainingForm from '@/components/ehs/EHSTrainingForm';
import { toast } from 'sonner';

const EHSTrainingsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trainings,setTrainings]=useState([])
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const getAllTrainings = async () => {
    // Here you would typically save the data to your backend

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}`+"/admin/trainings", {
        method: "GET",
        headers: { "Content-Type": "application/json",Authorization : `Bearer ${localStorage.getItem("fandoro-token")}` },
      });
      if (!res.ok) {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }
      else{
        const jsondata = await res.json();
        const { data } = jsondata;
        console.log('data',data)
        setTrainings(data)
      }
    } catch (error) {
      console.error("Api call:", error);
      toast.error("API Call failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    getAllTrainings()
  },[])

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen">
      <Navbar />
      <SidebarLayout>
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
              <EHSTrainingsList trainingList={trainings} />
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
      </SidebarLayout>
    </div>
  );
};

export default EHSTrainingsPage;
