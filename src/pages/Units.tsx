
import React, { useCallback, useEffect, useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import UnitsManagement from '@/components/units/UnitsManagement';
import { logger } from '@/hooks/logger';
import LocationManagement from '@/features/enterprise-admin/components/team/LocationManagement';
import { fetchLocationData } from '@/features/enterprise-admin/services/teamMangment';
import { toast } from 'sonner';

const UnitsPage = () => {
  logger.debug('Rendering UnitsPage component');
  const { isAuthenticated, user, isAuthenticatedStatus } = useAuth();

  if (!isAuthenticatedStatus()) {
    return <Navigate to="/" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState({
    locations: false,
    employees: false,
    subsidiaries: false
  });

  const [counts, setCounts] = useState({
    employees: 0,
    locations: 0,
    unitHeads: 0,
    pendingAssignments: 0,
    subsidiaryCompany: 0
  });

  const fetchLocationCount = useCallback(async () => {
    setLoading(prev => ({ ...prev, locations: true }));
    try {
      const response = await fetchLocationData();
      if (response?.data) {
        const activeLocations = response.data.filter(location => location.active !== false);
        setLocations(activeLocations);
        setCounts(prev => ({ ...prev, locations: activeLocations.length }));
      }
    } catch (error) {
      toast.error("Failed to fetch locations");
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchLocationCount();
  }, [fetchLocationCount]);

  // Initial fetch
  useEffect(() => {
    fetchLocationCount();
  }, [fetchLocationCount]);



  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Locations Management</h1>
          <p className="text-muted-foreground">
            Manage your company's units across multiple locations
          </p>
        </div>
        <LocationManagement locations={locations} refreshData={refreshData} />
        {/* <UnitsManagement /> */}
      </div>
    </UnifiedSidebarLayout>
  );
};

export default UnitsPage;
