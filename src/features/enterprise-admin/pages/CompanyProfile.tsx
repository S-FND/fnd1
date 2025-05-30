
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Users, DollarSign, Calendar, Target } from 'lucide-react';

const CompanyProfile = () => {
  const { isLoading } = useRouteProtection(['admin', 'manager']);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'manager')) {
    return <Navigate to="/login" />;
  }

  // Mock data - in real app, this would come from IRL form data
  const companyData = {
    legalEntityName: "TechCorp Solutions Pvt Ltd",
    email: "info@techcorp.com",
    incorporationDate: "March 2020",
    brandName: "TechCorp",
    contactNumber: "+91 9876543210",
    paidUpCapital: "₹50,00,000",
    currentYearTurnover: "₹2,50,00,000",
    previousYearTurnover: "₹1,80,00,000",
    totalBeneficiaries: "500+",
    employeeStrength: 125,
    fundingStage: "Series A",
    officeSpaces: [
      {
        location: "Bangalore",
        type: "Leased",
        address: "123 Tech Park, Electronic City, Bangalore - 560100",
        seats: 150
      },
      {
        location: "Mumbai",
        type: "Coworking",
        address: "456 Business Hub, Andheri East, Mumbai - 400069",
        seats: 50
      }
    ],
    foundingTeam: [
      {
        name: "John Doe",
        education: "MBA from IIM-A, B.Tech from IIT-B",
        experience: "10+ years in Tech & Product Management"
      },
      {
        name: "Jane Smith",
        education: "CA, B.Com from St. Xavier's College",
        experience: "8+ years in Finance & Operations"
      }
    ],
    locations: {
      warehouses: 3,
      offices: 2,
      dcs: 1
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <UnifiedSidebarLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
            <p className="text-muted-foreground">
              Overview of {companyData.brandName} company details and highlights
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Company Overview */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Legal Entity</p>
                    <p className="text-lg font-semibold">{companyData.legalEntityName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Brand Name</p>
                    <p className="text-lg font-semibold">{companyData.brandName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incorporated</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {companyData.incorporationDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Funding Stage</p>
                    <Badge variant="secondary">{companyData.fundingStage}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employee Strength</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    <Users className="h-5 w-5" />
                    {companyData.employeeStrength}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer Base</p>
                  <p className="text-xl font-semibold">{companyData.totalBeneficiaries}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Up Capital</p>
                  <p className="text-lg font-semibold">{companyData.paidUpCapital}</p>
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Year</p>
                  <p className="text-xl font-bold text-green-600">{companyData.currentYearTurnover}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Previous Year</p>
                  <p className="text-lg font-semibold">{companyData.previousYearTurnover}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Growth: +38.9%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Office Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyData.officeSpaces.map((office, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{office.location}</h4>
                        <Badge variant="outline">{office.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{office.address}</p>
                      <p className="text-sm">
                        <strong>Capacity:</strong> {office.seats} seats
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{companyData.locations.warehouses}</p>
                    <p className="text-sm text-muted-foreground">Warehouses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{companyData.locations.offices}</p>
                    <p className="text-sm text-muted-foreground">Offices</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{companyData.locations.dcs}</p>
                    <p className="text-sm text-muted-foreground">Distribution Centers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Founding Team */}
            <Card>
              <CardHeader>
                <CardTitle>Founding Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyData.foundingTeam.map((founder, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <h4 className="font-semibold">{founder.name}</h4>
                      <p className="text-sm text-muted-foreground">{founder.education}</p>
                      <p className="text-sm">{founder.experience}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </UnifiedSidebarLayout>
    </div>
  );
};

export default CompanyProfile;
