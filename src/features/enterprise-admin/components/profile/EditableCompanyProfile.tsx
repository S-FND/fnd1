
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, TrendingUp, Calendar, DollarSign, Mail, Phone, Globe, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  legalName: z.string().min(1, 'Legal name is required'),
  cin: z.string().min(1, 'CIN is required'),
  founded: z.string().min(1, 'Founded year is required'),
  incorporationDate: z.string().min(1, 'Incorporation date is required'),
  registeredOffice: z.string().min(1, 'Registered office address is required'),
  corporateOffice: z.string().min(1, 'Corporate office address is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().url('Invalid website URL'),
  financialYear: z.string().min(1, 'Financial year is required'),
  listedOn: z.string().min(1, 'Listed exchanges are required'),
  revenue: z.string().min(1, 'Revenue is required'),
  fundingStage: z.string().min(1, 'Funding stage is required'),
  employeeStrength: z.string().min(1, 'Employee strength is required'),
  industry: z.string().min(1, 'Industry is required'),
});

type CompanyFormData = z.infer<typeof companySchema>;

const EditableCompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const defaultData: CompanyFormData = {
    name: 'Translog India Ltd.',
    legalName: 'Translog India Ltd.',
    cin: 'L63030MH1995PLC089758',
    founded: '1995',
    incorporationDate: 'October 1995',
    registeredOffice: 'Translog House, Plot No. 84, Sector 44, Gurugram - 122003, Haryana, India',
    corporateOffice: 'Translog Towers, 14th Floor, Bandra Kurla Complex, Mumbai - 400051, Maharashtra, India',
    email: 'investor.relations@translogindia.com',
    phone: '+91-22-66780800',
    website: 'https://www.translogindia.com',
    financialYear: '2023-24',
    listedOn: 'National Stock Exchange of India (NSE) and Bombay Stock Exchange (BSE)',
    revenue: '₹2,500 Cr',
    fundingStage: 'Public Listed',
    employeeStrength: '2,500+',
    industry: 'Logistics & Transportation',
  };

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: defaultData,
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Mock API call - replace with actual API integration
      console.log('Updating company profile:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Company profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update company profile');
    }
  };

  const handleCancel = () => {
    form.reset(defaultData);
    setIsEditing(false);
  };

  const keyMetrics = {
    totalLocations: 15,
    cities: 8,
    states: 12,
    sustainability: 'ESG Compliant',
    stockExchanges: 2
  };

  const founders = [
    { name: 'Rajesh Kumar', title: 'Chairman & Managing Director', experience: '25+ years in Logistics' },
    { name: 'Priya Singh', title: 'Executive Director', experience: '20+ years in Operations' }
  ];

  if (isEditing) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Edit Company Profile</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="legalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIN</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="founded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founded Year</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="incorporationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incorporation Date</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="financialYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Financial Year</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="revenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Revenue</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="employeeStrength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Strength</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fundingStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Stage</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="listedOn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listed On</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="registeredOffice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registered Office Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="corporateOffice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corporate Office Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section with Key Company Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{form.getValues('name')}</CardTitle>
              <p className="text-lg text-muted-foreground mt-1">{form.getValues('industry')}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Founded {form.getValues('founded')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">CIN: {form.getValues('cin')}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                {keyMetrics.sustainability}
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {form.getValues('fundingStage')}
              </Badge>
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="text-xl font-semibold">{form.getValues('revenue')}</p>
                <p className="text-xs text-muted-foreground">FY {form.getValues('financialYear')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Employee Strength</p>
                <p className="text-xl font-semibold">{form.getValues('employeeStrength')}</p>
                <p className="text-xs text-muted-foreground">Across {keyMetrics.cities} cities</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Market Status</p>
                <p className="text-xl font-semibold">{form.getValues('fundingStage')}</p>
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
            <p className="text-muted-foreground mb-4">{form.getValues('registeredOffice')}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{form.getValues('phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{form.getValues('email')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{form.getValues('website')}</span>
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
            <p className="text-muted-foreground mb-4">{form.getValues('corporateOffice')}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Primary Operations Hub</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Listed on: {form.getValues('listedOn')}
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
            {founders.map((founder, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{founder.name}</h3>
                <p className="text-sm text-blue-600 mb-2">{founder.title}</p>
                <p className="text-sm text-muted-foreground">{founder.experience}</p>
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
                <p className="text-sm text-muted-foreground">{form.getValues('incorporationDate')} - Company established</p>
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
      </Card>
    </div>
  );
};

export default EditableCompanyProfile;
