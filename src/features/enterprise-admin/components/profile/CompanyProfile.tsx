
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const CompanyProfile = () => {
  const companyData = {
    name: 'TechCorp Industries',
    founded: '2010',
    headquarters: '123 Business District, Mumbai, Maharashtra 400001',
    revenue: '₹2,500 Cr',
    fundingStage: 'Series C',
    employeeStrength: '2,500+',
    founders: [
      { name: 'Rajesh Kumar', title: 'CEO & Co-Founder', experience: '15+ years in Tech' },
      { name: 'Priya Singh', title: 'CTO & Co-Founder', experience: '12+ years in Engineering' }
    ],
    locations: [
      { name: 'Mumbai Office', type: 'Headquarters', employees: 800 },
      { name: 'Bangalore R&D Center', type: 'Office', employees: 600 },
      { name: 'Delhi Warehouse', type: 'Warehouse', employees: 400 },
      { name: 'Chennai Manufacturing', type: 'Manufacturing Unit', employees: 700 }
    ],
    keyMetrics: {
      totalLocations: 8,
      cities: 4,
      departments: 6,
      sustainability: 'B-Corp Certified'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{companyData.name}</CardTitle>
              <p className="text-muted-foreground flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                Founded in {companyData.founded}
              </p>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {companyData.keyMetrics.sustainability}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="text-lg font-semibold">{companyData.revenue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Employee Strength</p>
                <p className="text-lg font-semibold">{companyData.employeeStrength}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Funding Stage</p>
                <p className="text-lg font-semibold">{companyData.fundingStage}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Locations</p>
                <p className="text-lg font-semibold">{companyData.keyMetrics.totalLocations}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Headquarters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{companyData.headquarters}</p>
        </CardContent>
      </Card>

      {/* Founder Profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Founder Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyData.founders.map((founder, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{founder.name}</h3>
                <p className="text-sm text-blue-600 mb-2">{founder.title}</p>
                <p className="text-sm text-muted-foreground">{founder.experience}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Units and Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Units & Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyData.locations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{location.name}</h3>
                  <Badge variant="outline">{location.type}</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {location.employees} employees
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;
