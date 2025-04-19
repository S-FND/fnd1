
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { VendorLayout } from '@/components/layout/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchTrainingBids, fetchEHSTrainings } from '@/data/mockData';

const VendorBids = () => {
  const { isAuthenticated, user, isVendor } = useAuth();
  const vendorId = user?.vendorInfo?.id;
  
  const { data: bids, isLoading: bidsLoading } = useQuery({
    queryKey: ['vendor-bids', vendorId],
    queryFn: () => fetchTrainingBids(undefined, vendorId),
    enabled: !!vendorId
  });

  const { data: trainings, isLoading: trainingsLoading } = useQuery({
    queryKey: ['ehs-trainings'],
    queryFn: fetchEHSTrainings
  });

  if (!isAuthenticated || !isVendor()) {
    return <Navigate to="/login" />;
  }

  const isLoading = bidsLoading || trainingsLoading;

  // Function to get training information by ID
  const getTraining = (trainingId) => {
    return trainings?.find(t => t.id === trainingId);
  };

  // Function to get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Bids</h1>
          <p className="text-muted-foreground">
            Track the status of your submitted bids
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Submitted Bids</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : bids && bids.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.map(bid => {
                    const training = getTraining(bid.trainingId);
                    return (
                      <TableRow key={bid.id}>
                        <TableCell>
                          {training ? training.name : `Training #${bid.trainingId}`}
                        </TableCell>
                        <TableCell>
                          {training ? new Date(training.date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>${bid.totalFee.toFixed(2)}</TableCell>
                        <TableCell>{new Date(bid.submittedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(bid.status)}>
                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/vendor/bid-details/${bid.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't submitted any bids yet.</p>
                <Button className="mt-4" asChild>
                  <Link to="/vendor/trainings">Find Trainings</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorBids;
