import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { VendorLayout } from '@/components/layout/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { fetchVendorProfile } from '@/data';

const VendorProfile = () => {
  const { isAuthenticated, user, isVendor,isAuthenticatedStatus } = useAuth();
  const vendorId = user?.vendorInfo?.id;
  
  const { data: vendorProfile, isLoading } = useQuery({
    queryKey: ['vendor-profile', vendorId],
    queryFn: () => fetchVendorProfile(vendorId || ''),
    enabled: !!vendorId
  });

  if (!isAuthenticatedStatus() || !isVendor()) {
    return <Navigate to="/" />;
  }

  return (
    <VendorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendor Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile and company information
          </p>
        </div>
        
        {isLoading ? (
          <div>Loading profile...</div>
        ) : vendorProfile ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Company Information</span>
                  {vendorProfile.verified && (
                    <Badge>Verified</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={vendorProfile.companyName} 
                        readOnly 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input 
                        id="contactPerson" 
                        value={vendorProfile.name} 
                        readOnly 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={vendorProfile.email} 
                        readOnly 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={vendorProfile.phone} 
                        readOnly 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea 
                        id="address" 
                        value={vendorProfile.address} 
                        readOnly 
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Label>Specialties</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {vendorProfile.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="button">Edit Profile</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      placeholder="Enter current password" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      placeholder="Enter new password" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Confirm new password" 
                    />
                  </div>
                  
                  <div>
                    <Button type="button">Change Password</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p>Unable to load profile data.</p>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;
