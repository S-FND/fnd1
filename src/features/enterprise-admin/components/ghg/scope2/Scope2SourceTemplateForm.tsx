import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Save } from "lucide-react";
import { GHGSourceTemplate } from '@/types/ghg-source-template';
import { v4 as uuidv4 } from 'uuid';
import EmissionFactorSelector from '../shared/EmissionFactorSelector';
import { EmissionFactor } from '@/data/ghg/emissionFactors';
import { httpClient } from '@/lib/httpClient';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';

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

const SCOPE2_SOURCE_TYPES = ['Purchased Electricity', 'Purchased Steam', 'Purchased Heating', 'Purchased Cooling'];
const SCOPE2_CATEGORIES = {
  'Purchased Electricity': ['Grid Electricity', 'Renewable PPA', 'Off-grid Solar', 'Off-grid Wind'],
  'Purchased Steam': ['Imported Steam', 'District Heating Steam'],
  'Purchased Heating': ['District Heating', 'Purchased Hot Water'],
  'Purchased Cooling': ['District Cooling', 'Purchased Chilled Water']
};

const MEASUREMENT_FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];
const ACTIVITY_UNITS = ['kWh', 'MWh', 'GJ', 'tonnes', 'kg'];

const formSchema = z.object({
  facilityNames: z.array(z.string()).min(1, 'At least one facility must be selected'),
  businessUnit: z.string().min(1, 'Business unit is required'),
  sourceType: z.string().min(1, 'Source type is required'),
  sourceCategory: z.string().min(1, 'Source category is required'),
  sourceDescription: z.string().min(1, 'Description is required'),
  utilityProviderName: z.string().min(1, 'Utility provider is required'),
  countryRegion: z.string().min(1, 'Country/Region is required'),
  gridEmissionFactorSource: z.string().optional(),
  scope2Category: z.enum(['Location-Based', 'Market-Based']),
  activityDataUnit: z.string().min(1, 'Activity unit is required'),
  measurementFrequency: z.string().min(1, 'Measurement frequency is required'),
  calculationMethodology: z.string().min(1, 'Methodology is required'),
  dataSource: z.string().min(1, 'Data source is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const Scope2SourceTemplateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  let  { template: editTemplate } = location.state || {};

  const [sourceType, setSourceType] = useState(editTemplate?.sourceType || 'Purchased Electricity');
  const [selectedEmissionFactor, setSelectedEmissionFactor] = useState<EmissionFactor | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    editTemplate ? [editTemplate.facilityName] : []
  );
  const [selectedCollectors, setSelectedCollectors] = useState<string[]>(editTemplate?.assignedDataCollectors || []);
  const [selectedVerifiers, setSelectedVerifiers] = useState<string[]>(editTemplate?.assignedVerifiers || []);

  const [teamMembers, setTeamMembers] = useState<{ _id: string; name: string }[]>([]);

  const [params] = useSearchParams();
  const sourceId = params.get('id');


  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editTemplate ? {
      facilityNames: [editTemplate.facilityName],
      businessUnit: editTemplate.businessUnit,
      sourceType: editTemplate.sourceType,
      sourceCategory: editTemplate.sourceCategory,
      sourceDescription: editTemplate.sourceDescription,
      utilityProviderName: editTemplate.utilityProviderName,
      countryRegion: editTemplate.countryRegion,
      gridEmissionFactorSource: editTemplate.gridEmissionFactorSource,
      scope2Category: editTemplate.scope2Category,
      activityDataUnit: editTemplate.activityDataUnit,
      measurementFrequency: editTemplate.measurementFrequency,
      calculationMethodology: editTemplate.calculationMethodology,
      dataSource: editTemplate.dataSource,
      notes: editTemplate.notes,
    } : {
      facilityNames: [],
      sourceType: 'Purchased Electricity',
      scope2Category: 'Location-Based',
      calculationMethodology: 'GHG Protocol - Scope 2',
      countryRegion: 'India',
    }
  });

  const watchSourceType = watch('sourceType');

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    setSourceType(watchSourceType);
  }, [watchSourceType]);

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

  const onSubmit = async(data: FormData) => {
    if (!selectedEmissionFactor) {
      toast({
        title: "Emission Factor Required",
        description: "Please select an emission factor",
        variant: "destructive",
      });
      return;
    }

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
      alert("Collector and Verifier cannot be the same user");
      toast({ description: "Collector and Verifier cannot be the same user" });
      return;
    }

    const templates = data.facilityNames.map(facilityName => ({
      // id: editTemplate?.id || uuidv4(),
      _id: editTemplate?._id || undefined,
      scope: 2 as 2,
      facilityName,
      businessUnit: data.businessUnit,
      sourceCategory: data.sourceCategory,
      sourceDescription: data.sourceDescription,
      sourceType: data.sourceType,
      utilityProviderName: data.utilityProviderName,
      countryRegion: data.countryRegion,
      gridEmissionFactorSource: data.gridEmissionFactorSource || selectedEmissionFactor.source,
      scope2Category: data.scope2Category,
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

    // ****************
    // const key = 'scope2_source_templates';
    // const stored = localStorage.getItem(key);
    // const existingTemplates: GHGSourceTemplate[] = stored ? JSON.parse(stored) : [];

    // if (editTemplate) {
    //   const index = existingTemplates.findIndex(t => t._id === templates[0].id);
    //   if (index >= 0) existingTemplates[index] = templates[0];
    // } else {
    //   existingTemplates.push(...templates);
    // }

    // localStorage.setItem(key, JSON.stringify(existingTemplates));
    // ****************
    try {
      let createUpdateSource = await httpClient.post('ghg-accounting/define-source', { templates });
      console.log("createUpdateSource", createUpdateSource);
      toast({
        title: editTemplate ? "Source Updated" : "Source Defined",
        description: `Emission source "${templates[0].sourceDescription}" has been ${editTemplate ? 'updated' : 'saved'}. You can now collect data against this source.`,
      });

      // navigate('/ghg-accounting', { state: { activeTab: 'scope2' } });
      navigate(-1);
    } catch (error) {
      console.error('Error saving source template:', error);
      toast({
        title: "Error",
        description: "Failed to save the source template. Please try again.",
        variant: "destructive",
      });
    }
    // toast({
    //   title: editTemplate ? "Source Updated" : `Source${templates.length > 1 ? 's' : ''} Defined`,
    //   description: `${templates[0].sourceDescription} has been ${editTemplate ? 'updated' : `saved for ${templates.length} facilit${templates.length > 1 ? 'ies' : 'y'}`}.`,
    // });

    // navigate('/ghg-accounting');
  };

  useEffect(() => {
    getTeamList();
    getFacilities();
  }, []);

  let getDataSource = async (id) => {
    try {
      let dataSourceResponse: { status: number; data: any[] } = await httpClient.get(`ghg-accounting/source/2?id=${id}`);
      console.log("dataSourceResponse", dataSourceResponse);
      if (dataSourceResponse.status === 200) {
        if(dataSourceResponse.data && dataSourceResponse.data.length>0){
          // editTemplate=dataSourceResponse.data[0];
          if(dataSourceResponse.data[0]['sourceType']){
            setSourceType(dataSourceResponse.data[0]['sourceType'])
          }
          setValue('utilityProviderName',dataSourceResponse.data[0]['utilityProviderName'])
          setValue('countryRegion',dataSourceResponse.data[0]['countryRegion'])
          setValue('scope2Category',dataSourceResponse.data[0]['scope2Category'])
          setValue('businessUnit',dataSourceResponse.data[0]['businessUnit'])
          setValue('sourceType',dataSourceResponse.data[0]['sourceType'])
          setValue('sourceDescription',dataSourceResponse.data[0]['sourceDescription'])
          // setValue('supplierName',dataSourceResponse.data[0]['supplierName'])
          setValue('activityDataUnit',dataSourceResponse.data[0]['activityDataUnit'])
          setValue('measurementFrequency',dataSourceResponse.data[0]['measurementFrequency'])
          setValue('calculationMethodology',dataSourceResponse.data[0]['calculationMethodology'])
          setValue('dataSource',dataSourceResponse.data[0]['dataSource'])
          setValue('notes',dataSourceResponse.data[0]['notes'])
          setSelectedFacilities([dataSourceResponse.data[0]['facilityName']])
          setSourceType(dataSourceResponse.data[0]['sourceType'])
          setValue('countryRegion',dataSourceResponse.data[0]['countryRegion'])
          // setValue('emissionFactorSource',dataSourceResponse.data[0]['emissionFactorSource'])
        }
        // const dataCollections: GHGSourceTemplate[] = dataSourceResponse.data.map(item => ({
        //   _id: item._id,
        //   scope: 2, // or from item if available
        //   facilityNames: [editTemplate.facilityName],
        //   businessUnit: editTemplate.businessUnit,
        //   sourceType: editTemplate.sourceType,
        //   sourceCategory: editTemplate.sourceCategory,
        //   sourceDescription: editTemplate.sourceDescription,
        //   utilityProviderName: editTemplate.utilityProviderName,
        //   countryRegion: editTemplate.countryRegion,
        //   gridEmissionFactorSource: editTemplate.gridEmissionFactorSource,
        //   scope2Category: editTemplate.scope2Category,
        //   activityDataUnit: editTemplate.activityDataUnit,
        //   measurementFrequency: editTemplate.measurementFrequency,
        //   calculationMethodology: editTemplate.calculationMethodology,
        //   dataSource: editTemplate.dataSource,
        //   notes: editTemplate.notes,

        //   createdDate: item.createdAt,  // mapping backend → frontend naming
        //   createdBy: "",                // backend doesn’t have this value
        // }));
        // let dataCollections: GHGSourceTemplate[] = dataSourceResponse.data;
        // setSourceType(dataCollections[0]?.sourceType as SourceType);

        const item = dataSourceResponse.data[0];

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
    if (sourceId) {
      getDataSource(sourceId);
    }
  }, [sourceId]);

  useEffect(()=>{
    console.log('Edit Template => ',editTemplate)
  },[editTemplate])

  return (
    <UnifiedSidebarLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {/* {editTemplate ? 'Edit' : 'Define'} Emission Source - Scope 2 */}
              Define Emission Source - Scope 2
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
                      {selectedFacilities
                      .filter((f) => f.trim() !== "")
                      .map((facility) => (
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
                  {!loadingFacilities && facilities.length === 0 && (
                    <p className="text-sm text-blue-600">
                      No facilities found. Please add a facility from Location Tab.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessUnit">Business Unit *</Label>
                  <Input {...register('businessUnit')} placeholder="e.g., Operations – West India" />
                  {errors.businessUnit && <p className="text-sm text-destructive">{errors.businessUnit.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceType">Source Category *</Label>
                  <Select onValueChange={(value) => setValue('sourceType', value)} value={sourceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCOPE2_SOURCE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sourceType && <p className="text-sm text-destructive">{errors.sourceType.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourceCategory">Source Type *</Label>
                  <Select onValueChange={(value) => setValue('sourceCategory', value)} value={editTemplate?.sourceCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(SCOPE2_CATEGORIES[sourceType as keyof typeof SCOPE2_CATEGORIES] || []).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sourceCategory && <p className="text-sm text-destructive">{errors.sourceCategory.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceDescription">Source Description *</Label>
                <Input {...register('sourceDescription')} placeholder="e.g., Electricity purchased from grid" />
                {errors.sourceDescription && <p className="text-sm text-destructive">{errors.sourceDescription.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="utilityProviderName">Utility Provider Name *</Label>
                  <Input {...register('utilityProviderName')} placeholder="e.g., MSEDCL" />
                  {errors.utilityProviderName && <p className="text-sm text-destructive">{errors.utilityProviderName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countryRegion">Country/Region *</Label>
                  <Input {...register('countryRegion')} placeholder="e.g., India" />
                  {errors.countryRegion && <p className="text-sm text-destructive">{errors.countryRegion.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scope2Category">Scope 2 Category *</Label>
                  <Select onValueChange={(value) => setValue('scope2Category', value as any)} value={editTemplate?.scope2Category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Location-Based">Location-Based</SelectItem>
                      <SelectItem value="Market-Based">Market-Based</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.scope2Category && <p className="text-sm text-destructive">{errors.scope2Category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gridEmissionFactorSource">Grid Emission Factor Source</Label>
                  <Input {...register('gridEmissionFactorSource')} placeholder="e.g., CEA India Baseline 2023" />
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
                scope={2}
                category={sourceType}
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
                <Input {...register('dataSource')} placeholder="e.g., Electricity bills, Meter readings" />
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
              { teamMembers && teamMembers.length>0 &&<div className="space-y-2">
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
              </div>}

              { teamMembers && teamMembers.length>0 &&<div className="space-y-2">
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
                      />
                      <span>{member.name}</span>
                    </label>
                  ))}
                </div>
              </div>}

              { !teamMembers || teamMembers.length===0 &&<div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                <span className="text-lg leading-none">ℹ️</span>

                <p className="m-0">
                  Please add team members first in Team Management section so they can be selected as 
                  <span className="font-semibold"> Collectors </span> and 
                  <span className="font-semibold"> Verifiers </span>
                  while creating a source.
                </p>
              </div>}
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

export default Scope2SourceTemplateForm;