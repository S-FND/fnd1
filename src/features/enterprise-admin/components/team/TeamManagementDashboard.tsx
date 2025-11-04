import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Building2, MapPin } from 'lucide-react';
import EmployeeManagement from './EmployeeManagement';
import LocationManagement from './LocationManagement';
import RoleAssignment from './RoleAssignment';
import UnitHeadsManagement from './UnitHeadsManagement';
import SubsidiaryCompany from './SubsidiaryCompany';
import { fetchLocationData, fetchTeamData,fetchSubsidiaries } from "../../services/teamMangment";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const TeamManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [loading, setLoading] = useState({
    locations: false,
    employees: false,
    subsidiaries: false
  });
  const [counts, setCounts] = useState({
    employees: 0,
    // locations: 0,
    // unitHeads: 0,
    // pendingAssignments: 0,
    subsidiaryCompany:0
  });

  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [subsidiaries, setSubsidiaries] = useState([]);

  const fetchEmployeeCount = useCallback(async () => {
    setLoading(prev => ({...prev, employees: true}));
    try {
      const response = await fetchTeamData();
      if (response?.data?.[0]?.subuser) {
        const transformed = transformEmployeeData(response.data[0].subuser);
        setEmployees(transformed);
        setCounts(prev => ({...prev, employees: transformed.length}));
      }
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(prev => ({...prev, employees: false}));
    }
  }, []);

  const fetchLocationCount = useCallback(async () => {
    setLoading(prev => ({...prev, locations: true}));
    try {
      const response = await fetchLocationData();
      if (response?.data) {
        const activeLocations = response.data.filter(location => location.active !== false);
        setLocations(activeLocations);
        setCounts(prev => ({...prev, locations: activeLocations.length}));
      }
    } catch (error) {
      toast.error("Failed to fetch locations");
    } finally {
      setLoading(prev => ({...prev, locations: false}));
    }
  }, []);

  const fetchSubsidiariesCount = useCallback(async () => {
    setLoading(prev => ({ ...prev, subsidiaries: true }));
    try {
      const response = await fetchSubsidiaries();
      if (response?.data) {
        setSubsidiaries(response.data);
        setCounts(prev => ({ ...prev, subsidiaryCompany: response.data.length }));
      }
    } catch (err) {
      toast.error("Failed to load subsidiaries");
    } finally {
      setLoading(prev => ({ ...prev, subsidiaries: false }));
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchEmployeeCount();
    fetchLocationCount();
    fetchSubsidiariesCount();
  }, [fetchEmployeeCount, fetchLocationCount, fetchSubsidiariesCount]);

  // Initial fetch
  useEffect(() => {
    fetchEmployeeCount();
    fetchLocationCount();
    fetchSubsidiariesCount();
  }, [fetchEmployeeCount, fetchLocationCount, fetchSubsidiariesCount]);

  const transformEmployeeData = (subusers) => {
    return subusers.map(emp => ({
      ...emp,
      role: emp.accessUrls?.includes('admin') ? 'Admin' : 'User',
      department: 'General',
      location: emp?.userAccess?.[0]?.location || 'Unassigned',
      city: emp.selectedLocation?.split(' ')[0] || 'Unknown',
      status: emp.active ? 'Active' : 'Inactive'
    }));
  };

  const stats = [
    {
      title: 'Total Employees',
      value: loading.employees ? <Loader2 className="h-6 w-6 animate-spin" /> : counts.employees,
      icon: Users,
      description: 'Across all locations',
      key: 'employees'
    },
    // {
    //   title: 'Locations',
    //   value: loading.locations ? <Loader2 className="h-6 w-6 animate-spin" /> : counts.locations,
    //   icon: MapPin,
    //   description: 'Cities and units',
    //   key: 'locations'
    // },
    // {
    //   title: 'Pending Assignments',
    //   value: counts.pendingAssignments,
    //   icon: UserPlus,
    //   description: 'Role assignments',
    //   key: 'pendingAssignments'
    // },
    // {
    //   title: 'Unit Heads',
    //   value: counts.unitHeads,
    //   icon: Building2,
    //   description: 'Department leaders',
    //   key: 'unitHeads'
    // },
    {
      title: 'Subsidiary Company',
      value: loading.subsidiaries ? <Loader2 className="h-6 w-6 animate-spin" /> : counts.subsidiaryCompany,
      icon: Building2,
      description: 'Companines List',
      key: 'subsidiaryCompany'
    }
    
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center justify-start h-8">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          {/* <TabsTrigger value="locations">Locations</TabsTrigger> */}
          {/* <TabsTrigger value="roles">Role Assignment</TabsTrigger>
          <TabsTrigger value="unit-heads">Unit Heads</TabsTrigger> */}
          <TabsTrigger value="subsidiary-company">Subsidiary Company</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          <EmployeeManagement 
            employees={employees} 
            locations={locations}
            refreshData={refreshData} 
            loading={loading.employees} 
          />
        </TabsContent>
        
        {/* <TabsContent value="locations">
          <LocationManagement locations={locations} refreshData={refreshData} />
        </TabsContent>
        
        <TabsContent value="roles">
          <RoleAssignment />
        </TabsContent>
        
        <TabsContent value="unit-heads">
          <UnitHeadsManagement />
        </TabsContent> */}

        <TabsContent value="subsidiary-company">
          <SubsidiaryCompany />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagementDashboard;