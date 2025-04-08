
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { VendorLayout } from '@/components/layout/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchVendorTrainings, fetchTrainingBids } from '@/data/mockData';
import { CalendarRange, FileText, Calendar, Users } from 'lucide-react';

const VendorDashboard = () => {
  const { isAuthenticated, user, isVendor } = useAuth();
  const vendorId = user?.vendorInfo?.id;
  
  const { data: trainings } = useQuery({
    queryKey: ['vendor-trainings', vendorId],
    queryFn: () => fetchVendorTrainings(vendorId || ''),
    enabled: !!vendorId
  });
  
  const { data: bids } = useQuery({
    queryKey: ['vendor-bids', vendorId],
    queryFn: () => fetchTrainingBids(undefined, vendorId),
    enabled: !!vendorId
  });

  if (!isAuthenticated || !isVendor()) {
    return <Navigate to="/login" />;
  }

  const openTrainingsCount = trainings?.filter(t => t.bidOpen).length || 0;
  const assignedTrainingsCount = trainings?.filter(t => t.assignedVendorId === vendorId).length || 0;
  const pendingBidsCount = bids?.filter(b => b.status === 'pending').length || 0;
  const acceptedBidsCount = bids?.filter(b => b.status === 'accepted').length || 0;

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's your overview.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Available Trainings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{openTrainingsCount}</span>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Open for bidding
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Trainings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{assignedTrainingsCount}</span>
                <CalendarRange className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Assigned to your company
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{pendingBidsCount}</span>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting client review
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Accepted Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{acceptedBidsCount}</span>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Trainings awarded to you
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Available Trainings</CardTitle>
            </CardHeader>
            <CardContent>
              {trainings && trainings.filter(t => t.bidOpen).length > 0 ? (
                <div className="space-y-4">
                  {trainings.filter(t => t.bidOpen).slice(0, 3).map(training => (
                    <div key={training.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{training.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {training.trainingType === 'online' ? 'Online (LMS)' : 'In-Person'} • {training.attendees.length} attendees
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(training.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">{training.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No available trainings right now.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Recent Bids</CardTitle>
            </CardHeader>
            <CardContent>
              {bids && bids.length > 0 ? (
                <div className="space-y-4">
                  {bids.slice(0, 3).map(bid => (
                    <div key={bid.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Training ID: {bid.trainingId}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(bid.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${bid.totalFee}</p>
                        <p className={`text-sm ${bid.status === 'accepted' ? 'text-green-500' : bid.status === 'rejected' ? 'text-red-500' : 'text-amber-500'}`}>
                          {bid.status === 'accepted' ? 'Accepted' : bid.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No bids submitted yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
