
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Users, TrendingUp, Calendar, DollarSign, Mail, Phone, Globe, Edit } from 'lucide-react';
import { CompanyFormData } from './schemas/companySchema';
import { keyMetrics, founders } from './data/defaultCompanyData';

interface CompanyDisplayProps {
  data: CompanyFormData;
  onEdit: () => void;
  isLoading?: boolean;
}


const CompanyDisplay = ({ data, onEdit, isLoading = false }: CompanyDisplayProps) => {
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading company data...</div>;
  }

  return (
    <div className="space-y-6">
       {/* Header Section with Key Company Info */}
       <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{data.legalName}</CardTitle>
              <p className="text-lg text-muted-foreground mt-1">{data.industry}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Founded {data.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">CIN: {data.cin}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* <Badge variant="outline" className="text-green-600 border-green-600">
                {keyMetrics.sustainability}
              </Badge> */}
              {/* <Badge variant="outline" className="text-blue-600 border-blue-600">
                {data.fundingStage}
              </Badge> */}
              <Button onClick={onEdit} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        {/* <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="text-xl font-semibold">{data.revenue}</p>
                <p className="text-xs text-muted-foreground">FY {data.financialYear}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Employee Strength</p>
                <p className="text-xl font-semibold">{data.employeeStrength}</p>
                <p className="text-xs text-muted-foreground">Across {keyMetrics.cities} cities</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Market Status</p>
                <p className="text-xl font-semibold">{data.fundingStage}</p>
                <p className="text-xs text-muted-foreground">NSE & BSE Listed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Locations</p>
                <p className="text-xl font-semibold">{keyMetrics.totalLocations}</p>
                <p className="text-xs text-muted-foreground">Pan India presence</p>
              </div>
            </div>
          </div>
        </CardContent> */}
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
            <p className="text-muted-foreground mb-4">{data.registeredOffice}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{data.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{data.website}</span>
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
            <p className="text-muted-foreground mb-4">{data.corporateOffice}</p>
            {/* <div className="flex items-center gap-2">
              <Badge variant="secondary">Primary Operations Hub</Badge>
            </div> */}
            {/* <p className="text-sm text-muted-foreground mt-2">
              Listed on: {data.listedOn}
            </p> */}
          </CardContent>
        </Card>
      </div>

      {/* Founder Profiles */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Leadership Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {founders.map((founder, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{founder.name}</h3>
                <p className="text-sm text-blue-600 mb-2">{founder.title}</p>
                <p className="text-sm text-muted-foreground">{founder.experience}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Company Timeline & Milestones */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Company Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Incorporation</p>
                <p className="text-sm text-muted-foreground">{data.incorporationDate} - Company established</p>
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
                <p className="text-sm text-muted-foreground">Operations in {keyMetrics.totalLocations}+ locations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default CompanyDisplay;
