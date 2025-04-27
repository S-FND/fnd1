
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { useAuth } from "@/context/AuthContext";
import { fetchVendorTrainings, fetchTrainingBids, fetchVendorProfile } from "@/data";
import { Navigate } from "react-router-dom";
import { useRouteProtection } from "@/hooks/useRouteProtection";

const VendorDashboard: React.FC = () => {
  const { isLoading } = useRouteProtection("vendor");
  const { user, isVendor } = useAuth();

  // Data fetching would be done with useQuery in a real application
  const vendorId = user?.vendorInfo?.id || '';
  const trainings = fetchVendorTrainings(vendorId);
  const bids = fetchTrainingBids(undefined, vendorId);
  const vendorProfile = fetchVendorProfile(vendorId);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isVendor()) {
    return <Navigate to="/login" />;
  }

  const bidStats = {
    total: bids.length,
    pending: bids.filter(bid => bid.status === "pending").length,
    accepted: bids.filter(bid => bid.status === "accepted").length,
    rejected: bids.filter(bid => bid.status === "rejected").length
  };

  const trainingStats = {
    open: trainings.filter(t => t.bidOpen).length,
    assigned: trainings.filter(t => t.assignedVendorId === vendorId).length,
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {vendorProfile?.name || 'Vendor'}! Here's your current training and bid status.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Trainings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trainingStats.open}</div>
              <p className="text-xs text-muted-foreground">Available for bidding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assigned Trainings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trainingStats.assigned}</div>
              <p className="text-xs text-muted-foreground">Trainings you're conducting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bidStats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting client decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Accepted Bids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bidStats.accepted}</div>
              <p className="text-xs text-muted-foreground">Successfully won bids</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bid Activity</CardTitle>
              <CardDescription>Your recent training bids</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bids.slice(0, 3).map((bid) => {
                  const training = trainings.find((t) => t.id === bid.trainingId);
                  return (
                    <div key={bid.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{training?.name || 'Unknown Training'}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{bid.totalFee.toLocaleString()} • Submitted: {bid.submittedDate}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        bid.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        bid.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                    </div>
                  );
                })}
                {bids.length === 0 && (
                  <p className="text-sm text-muted-foreground">No bid activity yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Trainings</CardTitle>
              <CardDescription>Trainings you're assigned to conduct</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainings
                  .filter(t => t.assignedVendorId === vendorId)
                  .slice(0, 3)
                  .map((training) => (
                    <div key={training.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{training.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {training.date} • {training.trainingType === 'online' ? 'Online' : training.location}
                        </p>
                      </div>
                      <span className="text-sm text-blue-600">View Details</span>
                    </div>
                  ))}
                {trainings.filter(t => t.assignedVendorId === vendorId).length === 0 && (
                  <p className="text-sm text-muted-foreground">No upcoming trainings</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
