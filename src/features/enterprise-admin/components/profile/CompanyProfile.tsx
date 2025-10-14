
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, TrendingUp, Calendar, DollarSign, Mail, Phone, Globe } from 'lucide-react';
import { fetchProfileData } from '../../services/companyApi';
import { logger } from '@/hooks/logger';

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProfileData();
        setCompanyData(data);
      } catch (error) {
        logger.error('Error loading company data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading company profile...</div>;
  }

  if (!companyData) {
    return <div className="flex justify-center p-8">No company data available</div>;
  }

  return (
    <div className="space-y-6">
       {/* Header Section with Key Company Info */}
       <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{companyData.name}</CardTitle>
              <p className="text-lg text-muted-foreground mt-1">{companyData.industry}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Founded {companyData.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">CIN: {companyData.cin}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                {companyData.keyMetrics.sustainability}
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {companyData.fundingStage}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="text-xl font-semibold">{companyData.revenue}</p>
                <p className="text-xs text-muted-foreground">FY {companyData.financialYear}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Employee Strength</p>
                <p className="text-xl font-semibold">{companyData.employeeStrength}</p>
                <p className="text-xs text-muted-foreground">Across {companyData.keyMetrics.cities} cities</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Market Status</p>
                <p className="text-xl font-semibold">{companyData.fundingStage}</p>
                <p className="text-xs text-muted-foreground">NSE & BSE Listed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Locations</p>
                <p className="text-xl font-semibold">{companyData.keyMetrics.totalLocations}</p>
                <p className="text-xs text-muted-foreground">Pan India presence</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Office Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Registered Office
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{companyData.registeredOffice}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{companyData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{companyData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{companyData.website}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Corporate Office
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{companyData.corporateOffice}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Primary Operations Hub</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Listed on: {companyData.listedOn}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Founder Profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Leadership Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyData.founders.map((founder, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{founder.name}</h3>
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
          <CardTitle>Units & Locations Network</CardTitle>
          <p className="text-sm text-muted-foreground">
            Operations across {companyData.keyMetrics.cities} cities in {companyData.keyMetrics.states} states
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companyData.locations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{location.name}</h3>
                  <Badge variant="outline">{location.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{location.address}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {location.employees} employees
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Timeline & Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Company Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Incorporation</p>
                <p className="text-sm text-muted-foreground">{companyData.incorporationDate} - Company established</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Public Listing</p>
                <p className="text-sm text-muted-foreground">Listed on NSE and BSE</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Pan India Expansion</p>
                <p className="text-sm text-muted-foreground">Operations in {companyData.keyMetrics.totalLocations}+ locations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;