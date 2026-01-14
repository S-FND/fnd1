import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Download, Upload } from "lucide-react";
import { GHGSourceTemplate } from '@/types/ghg-source-template';
import { SourceType, EMISSION_SOURCE_CATEGORIES, FUEL_SUBSTANCE_TYPES, ACTIVITY_UNITS, MeasurementFrequency } from '@/types/scope1-ghg';
import EmissionFactorSelector from '../shared/EmissionFactorSelector';
import { EmissionFactor } from '@/data/ghg/emissionFactors';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentFY } from '@/types/scope1-ghg';
import { httpClient } from '@/lib/httpClient';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';


interface Facility {
  id: string;
  name: string;
  code: string | null;
  location: string | null;
  city: string | null;
  facility_type: string | null;
}

const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Meera Sharma' },
  { id: '2', name: 'Rajesh Kumar' },
  { id: '3', name: 'Priya Patel' },
  { id: '4', name: 'Amit Singh' },
  { id: '5', name: 'Sanjana Reddy' },
];

const formSchema = z.object({
  facilityNames: z.array(z.string()).min(1, 'At least one facility must be selected'),
  businessUnit: z.string().min(1, 'Business unit is required'),
  sourceCategory: z.string().min(1, 'Source category is required'),
  sourceType: z.string().min(1, 'Source type is required'),
  sourceDescription: z.string().min(1, 'Description is required'),
  fuelType: z.string().optional(),
  equipmentId: z.string().optional(),
  activityDataUnit: z.string().min(1, 'Activity unit is required'),
  measurementFrequency: z.string().min(1, 'Measurement frequency is required'),
  calculationMethodology: z.string().min(1, 'Methodology is required'),
  dataSource: z.string().min(1, 'Data source is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const SourceTemplateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { sourceType: initialSourceType, template: editTemplate } = location.state || {};

  // const [sourceType, setSourceType] = useState<SourceType>(editTemplate?.sourceType || initialSourceType || 'Stationary');
  const [selectedEmissionFactor, setSelectedEmissionFactor] = useState<EmissionFactor | null>(null);
  const [selectedCollectors, setSelectedCollectors] = useState<string[]>(editTemplate?.assignedDataCollectors || []);
  const [selectedVerifiers, setSelectedVerifiers] = useState<string[]>(editTemplate?.assignedVerifiers || []);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    editTemplate ? [editTemplate.facilityName] : []
  );

  const [teamMembers, setTeamMembers] = useState<{ _id: string; name: string }[]>([]);

  const isInitialRender = useRef(true);

  const [params] = useSearchParams();
  const sourceId = params.get('id');


  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editTemplate ? {
      facilityNames: [editTemplate.facilityName],
      businessUnit: editTemplate.businessUnit,
      sourceCategory: editTemplate.sourceCategory,
      sourceType: editTemplate.sourceType,
      sourceDescription: editTemplate.sourceDescription,
      fuelType: editTemplate.fuelType,
      equipmentId: editTemplate.equipmentId,
      activityDataUnit: editTemplate.activityDataUnit,
      measurementFrequency: editTemplate.measurementFrequency,
      calculationMethodology: editTemplate.calculationMethodology,
      dataSource: editTemplate.dataSource,
      notes: editTemplate.notes,
    } : {
      facilityNames: [],
      sourceType: initialSourceType || 'Stationary',
      calculationMethodology: 'GHG Protocol - Activity-based',
    }
  });

  const watchSourceType = watch('sourceType');

  // Fetch facilities on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        // const { data, error } = await supabase
        //   .from('facilities')
        //   .select('id, name, code, location, city, facility_type')
        //   .eq('is_active', true)
        //   .order('name');

        // if (error) throw error;
        let data=[]
        setFacilities(data || []);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        toast({
          title: "Error Loading Facilities",
          description: "Could not load facility list. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingFacilities(false);
      }
    };

    fetchFacilities();
  }, [toast]);

  // useEffect(() => {
  //   setSourceType(watchSourceType as SourceType);
    
  //   // Don't clear fields on initial render when editing
  //   if (isInitialRender.current && editTemplate) {
  //     isInitialRender.current = false;
  //     return;
  //   }
  //   if (!isInitialRender.current) {
  //     setValue('sourceCategory', '');
  //     setValue('fuelType', '');
  //     setValue('activityDataUnit', '');
  //   }
  // }, [watchSourceType, setValue, editTemplate]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
  
    setValue('sourceCategory', '');
    setValue('fuelType', '');
    setValue('activityDataUnit', '');
  }, [watchSourceType, setValue]);

  const handleEmissionFactorSelect = (factor: EmissionFactor) => {
    // console.log('object++++++++++++++',factor);
    setSelectedEmissionFactor(factor);
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

  const handleValidateAndSubmit = () => {
    // ✅ THIS WILL ALWAYS RUN
    console.log("BUTTON CLICKED");
  
    if (!selectedCollectors.length) {
      alert("Please select a Collector");
      toast({ description: "Please select a Collector" });
      return;
    }
  
    if (!selectedVerifiers.length) {
      alert("Please select a Verifier");
      toast({ description: "Please select a Verifier" });
      return;
    }

    if (selectedCollectors.some(id => selectedVerifiers.includes(id))) {
      toast({ description: "Collector and Verifier cannot be the same user" });
      return;
    }
  
    // Optional: manually trigger RHF submit
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedEmissionFactor) {
      toast({
        title: "Missing Emission Factor",
        description: "Please select an emission factor from the database.",
        variant: "destructive",
      });
      return;
    }

    if (selectedCollectors.length === 0) {
      toast({
        title: "Missing Data Collectors",
        description: "Please assign at least one data collector.",
        variant: "destructive",
      });
      return;
    }

    // Create templates for each selected facility
    const templates = data.facilityNames.map(facilityName => ({
      // id: editTemplate?.id || uuidv4(),
      _id: editTemplate?._id || undefined,
      scope: 1,
      facilityName,
      businessUnit: data.businessUnit,
      sourceCategory: data.sourceCategory,
      sourceDescription: data.sourceDescription,
      sourceType: data.sourceType,
      fuelType: data.fuelType,
      equipmentId: data.equipmentId,
      emissionFactorId: selectedEmissionFactor.id,
      emissionFactor: selectedEmissionFactor.factor,
      emissionFactorUnit: selectedEmissionFactor.unit,
      emissionFactorSource: selectedEmissionFactor.source,
      activityDataUnit: data.activityDataUnit,
      measurementFrequency: data.measurementFrequency as MeasurementFrequency,
      assignedDataCollectors: selectedCollectors,
      assignedVerifiers: selectedVerifiers,
      ghgIncluded: selectedEmissionFactor.gases,
      calculationMethodology: data.calculationMethodology,
      dataSource: data.dataSource,
      isActive: true,
      createdDate: editTemplate?.createdDate || new Date().toISOString(),
      createdBy: editTemplate?.createdBy || 'Current User',
      notes: data.notes || '',
    }));

    // Save to localStorage
    const key = 'scope1_source_templates';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    
    // if (editTemplate) {
    //   const index = existing.findIndex((t: GHGSourceTemplate) => t._id === templates[0]._id);
    //   if (index >= 0) {
    //     existing[index] = templates[0];
    //   }
    // } else {
    //   existing.push(...templates);
    // }
    
    // localStorage.setItem(key, JSON.stringify(existing));

    // toast({
    //   title: editTemplate ? "Source Updated" : `Source${templates.length > 1 ? 's' : ''} Defined`,
    //   description: `Emission source "${templates[0].sourceDescription}" has been ${editTemplate ? 'updated' : `saved for ${templates.length} facilit${templates.length > 1 ? 'ies' : 'y'}`}. You can now collect data against ${templates.length > 1 ? 'these sources' : 'this source'}.`,
    // });

    // navigate('/ghg-accounting', { state: { activeTab: 'scope1' } });
    try {
      let createUpdateSource = await httpClient.post('ghg-accounting/define-source', {templates});
      // console.log("createUpdateSource", createUpdateSource);
      toast({
        title: editTemplate ? "Source Updated" : "Source Defined",
        description: `Emission source "${templates[0].sourceDescription}" has been ${editTemplate ? 'updated' : 'saved'}. You can now collect data against this source.`,
      });

      // navigate('/ghg-accounting', { state: { activeTab: 'scope1' } });
      navigate(-1);
    } catch (error) {
      console.error('Error saving source template:', error);
      toast({
        title: "Error",
        description: "Failed to save the source template. Please try again.",
        variant: "destructive",
      });
    }
  };
  let getDataSource = async (id) => {
    try {
      let dataSourceResponse: { status: number; data: any[] } = await httpClient.get(`ghg-accounting/source/1?id=${id}`);
      console.log("dataSourceResponse", dataSourceResponse);
      if (dataSourceResponse.status === 200) {
        // const dataCollections: GHGSourceTemplate[] = dataSourceResponse.data.map(item => ({
        //   _id: item._id,
        //   scope: 1, // or from item if available
        //   facilityName: item.facilityName,
        //   businessUnit: item.businessUnit,
        //   sourceCategory: item.sourceCategory,
        //   sourceDescription: item.sourceDescription,
        //   emissionFactorId: item.emissionFactorId,
        //   emissionFactor: item.emissionFactor,
        //   emissionFactorUnit: item.emissionFactorUnit,
        //   emissionFactorSource: item.emissionFactorSource,
        //   activityDataUnit: item.activityDataUnit,
        //   measurementFrequency: item.measurementFrequency,
        //   assignedDataCollectors: item.assignedDataCollectors,
        //   assignedVerifiers: item.assignedVerifiers,
        //   ghgIncluded: item.ghgIncluded,
        //   calculationMethodology: item.calculationMethodology,
        //   dataSource: item.dataSource,
        //   isActive: item.isActive,
        //   notes: item.notes,

        //   createdDate: item.createdAt,  // mapping backend → frontend naming
        //   createdBy: "",                // backend doesn’t have this value
        // }));
        // let dataCollections: GHGSourceTemplate[] = dataSourceResponse.data;
        // setSourceType(dataCollections[0]?.sourceType as SourceType);

        const item = dataSourceResponse.data[0];


        setValue('sourceType', item.sourceType, {
          shouldDirty: false,
          shouldTouch: false,
        });
        
        setValue('sourceCategory', item.sourceCategory, {
          shouldDirty: false,
          shouldTouch: false,
        });
        
        setValue('fuelType', item.fuelType ?? '', {
          shouldDirty: false,
          shouldTouch: false,
        });
        
        setValue('activityDataUnit', item.activityDataUnit, {
          shouldDirty: false,
          shouldTouch: false,
        });
        
        setValue('measurementFrequency', item.measurementFrequency, {
          shouldDirty: false,
          shouldTouch: false,
        });
        
        setValue('calculationMethodology', item.calculationMethodology);
        setValue('dataSource', item.dataSource);
        setValue('sourceDescription', item.sourceDescription);
        setValue('businessUnit', item.businessUnit);
        setValue('facilityNames', [item.facilityName]);
        

        // ✅ SET EMISSION FACTOR STATE
        setSelectedEmissionFactor({
          id: item.emissionFactorId,
          name: item.emissionFactorSource,
          factor: item.emissionFactor,
          unit: item.emissionFactorUnit,
          fuelType: item.fuelType,
          source: item.emissionFactorSource,
          year: item.year || '',
          gases: item.ghgIncluded,
          category: item.sourceCategory,
        } as EmissionFactor);
      }
    } catch (error) {
      console.error("Error fetching data collections:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data collections.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    getTeamList();
    getFacilities();
  }, []);

  useEffect(() => {
    if (sourceId) {
      getDataSource(sourceId);
    }
  }, [sourceId]);

  return (
    <UnifiedSidebarLayout>
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {/* {editTemplate ? 'Edit' : 'Define'} Emission Source - Scope 1 */}
            Define Emission Source - Scope 1
          </h1>
          <p className="text-muted-foreground">
            Step 1: Define the emission source and measurement parameters
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Identify the emission source and its location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facilityNames">Facilities *</Label>
              <Select
                value={selectedFacilities.length === 1 ? selectedFacilities[0] : undefined}
                onValueChange={(value) => {
                  // Toggle selection for multi-select behavior
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
                  {/* <SelectItem value="Others">Others</SelectItem> */}
                  {loadingFacilities ? (
                    <div className="p-2 text-sm text-muted-foreground">Loading facilities...</div>
                  ) : (
                    facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.name}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedFacilities.includes(facility.name)}
                            onChange={() => {}}
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
                <Input
                  id="businessUnit"
                  placeholder="e.g., Operations – West India"
                  {...register('businessUnit')}
                />
                {errors.businessUnit && (
                  <p className="text-sm text-destructive">{errors.businessUnit.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type *</Label>
                <Select 
                  value={watch('sourceType')}
                  onValueChange={(value) => setValue('sourceType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stationary">Stationary Combustion</SelectItem>
                    <SelectItem value="Mobile">Mobile Combustion</SelectItem>
                    <SelectItem value="Fugitive">Fugitive Emissions</SelectItem>
                    <SelectItem value="Process">Process Emissions</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sourceType && (
                  <p className="text-sm text-destructive">{errors.sourceType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceCategory"> Source Category *</Label>
                <Select
                  value={watch('sourceCategory')}
                  onValueChange={(value) => setValue('sourceCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EMISSION_SOURCE_CATEGORIES[watchSourceType]?.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sourceCategory && (
                  <p className="text-sm text-destructive">{errors.sourceCategory.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel/Substance Type</Label>
                <Select
                  value={watch('fuelType')}
                  onValueChange={(value) => setValue('fuelType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_SUBSTANCE_TYPES[watchSourceType]?.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>
                        {fuel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceDescription">Emission Source Description *</Label>
              <Textarea
                id="sourceDescription"
                placeholder="Detailed description of the emission source..."
                rows={3}
                {...register('sourceDescription')}
              />
              {errors.sourceDescription && (
                <p className="text-sm text-destructive">{errors.sourceDescription.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emission Factor</CardTitle>
            <CardDescription>Select emission factor from open databases (IPCC, DEFRA, EPA, etc.)</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionFactorSelector
              scope={1}
              category={watchSourceType}
              value={selectedEmissionFactor?.id}
              onSelect={handleEmissionFactorSelect}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Measurement Parameters</CardTitle>
            <CardDescription>Define how data will be collected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityDataUnit">Activity Data Unit *</Label>
                <Select
                  value={watch('activityDataUnit')}
                  onValueChange={(value) => setValue('activityDataUnit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_UNITS[watchSourceType]?.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.activityDataUnit && (
                  <p className="text-sm text-destructive">{errors.activityDataUnit.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurementFrequency">Measurement Frequency *</Label>
                <Select
                  value={watch('measurementFrequency')}
                  onValueChange={(value) => {
                    setValue('measurementFrequency', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
                {errors.measurementFrequency && (
                  <p className="text-sm text-destructive">{errors.measurementFrequency.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="calculationMethodology">Calculation Methodology *</Label>
                <Input
                  id="calculationMethodology"
                  placeholder="e.g., GHG Protocol"
                  {...register('calculationMethodology')}
                />
                {errors.calculationMethodology && (
                  <p className="text-sm text-destructive">{errors.calculationMethodology.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataSource">Data Source *</Label>
                <Input
                  id="dataSource"
                  placeholder="e.g., Fuel purchase invoices"
                  {...register('dataSource')}
                />
                {errors.dataSource && (
                  <p className="text-sm text-destructive">{errors.dataSource.message}</p>
                )}
              </div>
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
                      disabled={selectedVerifiers.includes(member._id)}
                      className="rounded"
                    />
                    <span>{member.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Verifiers *</Label>
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
                      disabled={selectedCollectors.includes(member._id)}
                    />
                    <span>{member.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any additional notes or comments..."
              rows={4}
              {...register('notes')}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleValidateAndSubmit}>
            <Save className="mr-2 h-4 w-4" />
            {editTemplate ? 'Update Source' : 'Save Source Definition'}
          </Button>
        </div>
      </form>
    </div>
    </UnifiedSidebarLayout>
  );
};

export default SourceTemplateForm;