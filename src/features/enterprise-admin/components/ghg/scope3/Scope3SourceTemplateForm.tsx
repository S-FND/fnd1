import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { GHGSourceTemplate } from '@/types/ghg-source-template';
import { v4 as uuidv4 } from 'uuid';
import EmissionFactorSelector from '../shared/EmissionFactorSelector';
import { EmissionFactor } from '@/data/ghg/emissionFactors';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { httpClient } from '@/lib/httpClient';

interface Facility {
  id: string;
  name: string;
  code: string | null;
  location: string | null;
}

const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Meera Sharma' },
  { id: '2', name: 'Rajesh Kumar' },
  { id: '3', name: 'Priya Singh' },
  { id: '4', name: 'Amit Patel' },
  { id: '5', name: 'Sustainability Team' },
];

const SCOPE3_CATEGORIES = [
  'Category 1 – Purchased Goods and Services',
  'Category 2 – Capital Goods',
  'Category 3 – Fuel- and Energy-Related Activities',
  'Category 4 – Upstream Transportation and Distribution',
  'Category 5 – Waste Generated in Operations',
  'Category 6 – Business Travel',
  'Category 7 – Employee Commuting',
  'Category 8 – Upstream Leased Assets',
  'Category 9 – Downstream Transportation and Distribution',
  'Category 10 – Processing of Sold Products',
  'Category 11 – Use of Sold Products',
  'Category 12 – End-of-Life Treatment of Sold Products',
  'Category 13 – Downstream Leased Assets',
  'Category 14 – Franchises',
  'Category 15 – Investments'
];

const SOURCE_TYPES_BY_CATEGORY: Record<string, string[]> = {
  'Category 1 – Purchased Goods and Services': ['Raw Material Purchases', 'Packaging Materials', 'Office Supplies'],
  'Category 4 – Upstream Transportation and Distribution': ['Freight Transport', 'Warehousing', 'Distribution'],
  'Category 6 – Business Travel': ['Employee Air Travel', 'Rail Travel', 'Rental Cars', 'Hotel Stays'],
  'Category 12 – End-of-Life Treatment of Sold Products': ['Product Disposal', 'Recycling', 'Waste Treatment']
};

const MEASUREMENT_FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];
const ACTIVITY_UNITS = ['kg', 'tonnes', 'kWh', 'tonne-km', 'passenger-km', 'units', 'INR'];

const formSchema = z.object({
  facilityNames: z.array(z.string()).min(1, 'At least one facility must be selected'),
  businessUnit: z.string().min(1, 'Business unit is required'),
  scope3Category: z.string().min(1, 'Scope 3 category is required'),
  sourceType: z.string().min(1, 'Source type is required'),
  sourceDescription: z.string().min(1, 'Description is required'),
  supplierName: z.string().optional(),
  countryRegion: z.string().min(1, 'Country/Region is required'),
  activityDataUnit: z.string().min(1, 'Activity unit is required'),
  measurementFrequency: z.string().min(1, 'Measurement frequency is required'),
  calculationMethodology: z.string().min(1, 'Methodology is required'),
  dataSource: z.string().min(1, 'Data source is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const Scope3SourceTemplateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { template: editTemplate } = location.state || {};

  const [scope3Category, setScope3Category] = useState(editTemplate?.scope3Category || SCOPE3_CATEGORIES[0]);
  const [selectedEmissionFactor, setSelectedEmissionFactor] = useState<EmissionFactor | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    editTemplate ? [editTemplate.facilityName] : ['Others']
  );
  const [selectedCollectors, setSelectedCollectors] = useState<string[]>(editTemplate?.assignedDataCollectors || []);
  const [selectedVerifiers, setSelectedVerifiers] = useState<string[]>(editTemplate?.assignedVerifiers || []);
  const [teamMembers, setTeamMembers] = useState<{ _id: string; name: string }[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editTemplate ? {
      facilityNames: [editTemplate.facilityName],
      businessUnit: editTemplate.businessUnit,
      scope3Category: editTemplate.scope3Category,
      sourceType: editTemplate.sourceType,
      sourceDescription: editTemplate.sourceDescription,
      supplierName: editTemplate.supplierName,
      countryRegion: editTemplate.countryRegion,
      activityDataUnit: editTemplate.activityDataUnit,
      measurementFrequency: editTemplate.measurementFrequency,
      calculationMethodology: editTemplate.calculationMethodology,
      dataSource: editTemplate.dataSource,
      notes: editTemplate.notes,
    } : {
      facilityNames: ['Others'],
      scope3Category: SCOPE3_CATEGORIES[0],
      calculationMethodology: 'GHG Protocol - Activity-based',
      countryRegion: 'India',
    }
  });

  const watchScope3Category = watch('scope3Category');

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    setScope3Category(watchScope3Category);
  }, [watchScope3Category]);

  const fetchFacilities = async () => {
    try {
      // const { data, error } = await supabase
      //   .from('facilities')
      //   .select('id, name, code, location')
      //   .eq('is_active', true)
      //   .order('name');

      // if (error) throw error;
      let data = []
      setFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: "Error",
        description: "Failed to load facilities",
        variant: "destructive",
      });
    } finally {
      setLoadingFacilities(false);
    }
  };

  const getTeamList = async () => {
    try {
      let teamList = await httpClient.get('subuser');
      console.log("teamList", teamList);
      console.log("teamList.data['data']", teamList.data['data']);
      if (teamList && teamList.status === 200) {
        // setTeamMembers(teamList.data);
        if (teamList.data && teamList.data['data'] && Array.isArray(teamList.data['data'])) {
          console.log("teamList.data['data']['subusers']", teamList.data['data'][0]['subuser']);
          setTeamMembers(teamList.data['data'][0]['subuser']);
        }

      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error Loading Team Members",
        description: "Could not load team members. Please try again.",
        variant: "destructive",
      });
    }
  }

  const getFacilities = async () => {
    try {
      let facilitiesData = await httpClient.get('company/locations');
      console.log("facilitiesData", facilitiesData);
      if (facilitiesData && facilitiesData.status === 200) {
        setFacilities(facilitiesData.data['data']);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: "Error Loading Facilities",
        description: "Could not load facility list. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    debugger;
    if (!selectedEmissionFactor) {
      toast({
        title: "Emission Factor Required",
        description: "Please select an emission factor",
        variant: "destructive",
      });
      return;
    }

    const templates = data.facilityNames.map(facilityName => ({
      // id: editTemplate?.id || uuidv4(),
      scope: 3 as 3,
      facilityName,
      businessUnit: data.businessUnit,
      sourceCategory: data.scope3Category,
      sourceDescription: data.sourceDescription,
      sourceType: data.sourceType,
      scope3Category: data.scope3Category,
      supplierName: data.supplierName,
      countryRegion: data.countryRegion,
      emissionFactorId: selectedEmissionFactor.id,
      emissionFactor: selectedEmissionFactor.factor,
      emissionFactorUnit: selectedEmissionFactor.unit,
      emissionFactorSource: selectedEmissionFactor.source,
      activityDataUnit: data.activityDataUnit,
      measurementFrequency: data.measurementFrequency as any,
      assignedDataCollectors: selectedCollectors,
      assignedVerifiers: selectedVerifiers,
      ghgIncluded: 'CO₂, CH₄, N₂O',
      calculationMethodology: data.calculationMethodology,
      dataSource: data.dataSource,
      isActive: true,
      createdDate: editTemplate?.createdDate || new Date().toISOString(),
      createdBy: 'Current User',
      notes: data.notes || '',
    }));

    // const key = 'scope3_source_templates';
    // const stored = localStorage.getItem(key);
    // const existingTemplates: GHGSourceTemplate[] = stored ? JSON.parse(stored) : [];

    // if (editTemplate) {
    //   const index = existingTemplates.findIndex(t => t._id === templates[0].id);
    //   if (index >= 0) existingTemplates[index] = templates[0];
    // } else {
    //   existingTemplates.push(...templates);
    // }

    // localStorage.setItem(key, JSON.stringify(existingTemplates));

    // toast({
    //   title: editTemplate ? "Source Updated" : `Source${templates.length > 1 ? 's' : ''} Defined`,
    //   description: `${templates[0].sourceDescription} has been ${editTemplate ? 'updated' : `saved for ${templates.length} facilit${templates.length > 1 ? 'ies' : 'y'}`}.`,
    // });

    // navigate('/ghg-accounting');
    try {
      let createUpdateSource = await httpClient.post('ghg-accounting/define-source', { templates });
      console.log("createUpdateSource", createUpdateSource);
      toast({
        title: editTemplate ? "Source Updated" : "Source Defined",
        description: `Emission source "${templates[0].sourceDescription}" has been ${editTemplate ? 'updated' : 'saved'}. You can now collect data against this source.`,
      });

      navigate('/ghg-accounting', { state: { activeTab: 'scope2' } });
    } catch (error) {
      console.error('Error saving source template:', error);
      toast({
        title: "Error",
        description: "Failed to save the source template. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getTeamList();
    getFacilities();
  }, []);

  return (
    <UnifiedSidebarLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ghg-accounting')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {editTemplate ? 'Edit' : 'Define New'} Scope 3 Emission Source
            </h1>
            <p className="text-muted-foreground">
              Step 1: Define the emission source for data collection
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Define the emission source details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facilityNames">Facilities *</Label>
                  <Select
                    value={selectedFacilities.length === 1 ? selectedFacilities[0] : undefined}
                    onValueChange={(value) => {
                      const newSelected = selectedFacilities.includes(value)
                        ? selectedFacilities.filter(f => f !== value)
                        : [...selectedFacilities, value];
                      setSelectedFacilities(newSelected);
                      setValue('facilityNames', newSelected);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {selectedFacilities.length === 0
                          ? "Select facilities..."
                          : `${selectedFacilities.length} facilit${selectedFacilities.length > 1 ? 'ies' : 'y'} selected`}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="Others">Others</SelectItem>
                      {loadingFacilities ? (
                        <div className="p-2 text-sm text-muted-foreground">Loading facilities...</div>
                      ) : (
                        facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.name}>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedFacilities.includes(facility.name)}
                                onChange={() => { }}
                                className="rounded pointer-events-none"
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{facility.name}</span>
                                {(facility.code || facility.location) && (
                                  <span className="text-xs text-muted-foreground">
                                    {facility.code && `${facility.code}`}
                                    {facility.code && facility.location && ' • '}
                                    {facility.location && facility.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.facilityNames && (
                    <p className="text-sm text-destructive">{errors.facilityNames.message}</p>
                  )}
                  {selectedFacilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedFacilities.map((facility) => (
                        <span
                          key={facility}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded-md text-sm"
                        >
                          {facility}
                          <button
                            type="button"
                            onClick={() => {
                              const newSelected = selectedFacilities.filter(f => f !== facility);
                              setSelectedFacilities(newSelected);
                              setValue('facilityNames', newSelected);
                            }}
                            className="hover:text-destructive"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessUnit">Business Unit *</Label>
                  <Input {...register('businessUnit')} placeholder="e.g., Procurement" />
                  {errors.businessUnit && <p className="text-sm text-destructive">{errors.businessUnit.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope3Category">Scope 3 Category *</Label>
                <Select onValueChange={(value) => setValue('scope3Category', value)} defaultValue={scope3Category}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCOPE3_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.scope3Category && <p className="text-sm text-destructive">{errors.scope3Category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type *</Label>
                <Select onValueChange={(value) => setValue('sourceType', value)} defaultValue={editTemplate?.sourceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(SOURCE_TYPES_BY_CATEGORY[scope3Category] || ['General']).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sourceType && <p className="text-sm text-destructive">{errors.sourceType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceDescription">Source Description *</Label>
                <Input {...register('sourceDescription')} placeholder="e.g., Purchase of aluminum sheets" />
                {errors.sourceDescription && <p className="text-sm text-destructive">{errors.sourceDescription.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier/Partner Name</Label>
                  <Input {...register('supplierName')} placeholder="e.g., AluMines Ltd." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countryRegion">Country/Region *</Label>
                  <Input {...register('countryRegion')} placeholder="e.g., India" />
                  {errors.countryRegion && <p className="text-sm text-destructive">{errors.countryRegion.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emission Factor Selection</CardTitle>
              <CardDescription>Select the appropriate emission factor for calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <EmissionFactorSelector
                scope={3}
                category={scope3Category}
                value={selectedEmissionFactor?.id}
                onSelect={setSelectedEmissionFactor}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Measurement & Calculation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activityDataUnit">Activity Data Unit *</Label>
                  <Select onValueChange={(value) => setValue('activityDataUnit', value)} defaultValue={editTemplate?.activityDataUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_UNITS.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.activityDataUnit && <p className="text-sm text-destructive">{errors.activityDataUnit.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="measurementFrequency">Measurement Frequency *</Label>
                  <Select onValueChange={(value) => setValue('measurementFrequency', value)} defaultValue={editTemplate?.measurementFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEASUREMENT_FREQUENCIES.map(freq => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.measurementFrequency && <p className="text-sm text-destructive">{errors.measurementFrequency.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calculationMethodology">Calculation Methodology *</Label>
                <Input {...register('calculationMethodology')} />
                {errors.calculationMethodology && <p className="text-sm text-destructive">{errors.calculationMethodology.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataSource">Data Source *</Label>
                <Input {...register('dataSource')} placeholder="e.g., Supplier invoice, Purchase records" />
                {errors.dataSource && <p className="text-sm text-destructive">{errors.dataSource.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea {...register('notes')} placeholder="Additional information about this emission source" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
              <CardDescription>Assign team members for data collection and verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Collectors *</Label>
                <div className="border rounded-lg p-4 space-y-2">
                  {teamMembers.map(member => (
                    <label key={member._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCollectors.includes(member._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCollectors([...selectedCollectors, member._id]);
                          } else {
                            setSelectedCollectors(selectedCollectors.filter(id => id !== member._id));
                          }
                        }}
                        className="rounded"
                      />
                      <span>{member.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Verifiers (Optional)</Label>
                <div className="border rounded-lg p-4 space-y-2">
                  {teamMembers.map(member => (
                    <label key={member._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVerifiers.includes(member._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVerifiers([...selectedVerifiers, member._id]);
                          } else {
                            setSelectedVerifiers(selectedVerifiers.filter(id => id !== member._id));
                          }
                        }}
                        className="rounded"
                      />
                      <span>{member.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/ghg-accounting')}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {editTemplate ? 'Update' : 'Save'} Source
            </Button>
          </div>
        </form>
      </div>
    </UnifiedSidebarLayout>
  );
};

export default Scope3SourceTemplateForm;