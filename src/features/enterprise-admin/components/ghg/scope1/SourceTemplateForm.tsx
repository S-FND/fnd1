import React, { useState, useEffect, useRef } from 'react';
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
import { ArrowLeft, Save, Download, Upload } from "lucide-react";
import { GHGSourceTemplate } from '@/types/ghg-source-template';
import { SourceType, EMISSION_SOURCE_CATEGORIES, FUEL_SUBSTANCE_TYPES, ACTIVITY_UNITS, MeasurementFrequency } from '@/types/scope1-ghg';
import EmissionFactorSelector from '../shared/EmissionFactorSelector';
import { EmissionFactor } from '@/data/ghg/emissionFactors';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentFY } from '@/types/scope1-ghg';
import { supabase } from '@/integrations/supabase/client';


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

  const [sourceType, setSourceType] = useState<SourceType>(editTemplate?.sourceType || initialSourceType || 'Stationary');
  const [selectedEmissionFactor, setSelectedEmissionFactor] = useState<EmissionFactor | null>(null);
  const [selectedCollectors, setSelectedCollectors] = useState<string[]>(editTemplate?.assignedDataCollectors || []);
  const [selectedVerifiers, setSelectedVerifiers] = useState<string[]>(editTemplate?.assignedVerifiers || []);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    editTemplate ? [editTemplate.facilityName] : []
  );
  const isInitialRender = useRef(true);


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
        const { data, error } = await supabase
          .from('facilities')
          .select('id, name, code, location, city, facility_type')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
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

  useEffect(() => {
    setSourceType(watchSourceType as SourceType);
    
    // Don't clear fields on initial render when editing
    if (isInitialRender.current && editTemplate) {
      isInitialRender.current = false;
      return;
    }
    
    setValue('sourceCategory', '');
    setValue('fuelType', '');
    setValue('activityDataUnit', '');
  }, [watchSourceType, setValue, editTemplate]);

  const handleEmissionFactorSelect = (factor: EmissionFactor) => {
    setSelectedEmissionFactor(factor);
  };


  const onSubmit = (data: FormData) => {
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
      id: editTemplate?.id || uuidv4(),
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
    
    if (editTemplate) {
      const index = existing.findIndex((t: GHGSourceTemplate) => t.id === templates[0].id);
      if (index >= 0) {
        existing[index] = templates[0];
      }
    } else {
      existing.push(...templates);
    }
    
    localStorage.setItem(key, JSON.stringify(existing));

    toast({
      title: editTemplate ? "Source Updated" : `Source${templates.length > 1 ? 's' : ''} Defined`,
      description: `Emission source "${templates[0].sourceDescription}" has been ${editTemplate ? 'updated' : `saved for ${templates.length} facilit${templates.length > 1 ? 'ies' : 'y'}`}. You can now collect data against ${templates.length > 1 ? 'these sources' : 'this source'}.`,
    });

    navigate('/ghg-accounting', { state: { activeTab: 'scope1' } });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {editTemplate ? 'Edit' : 'Define'} Emission Source - Scope 1
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
                <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                  {loadingFacilities ? (
                    <p className="text-sm text-muted-foreground">Loading facilities...</p>
                  ) : (
                    <>
                      {facilities.map((facility) => (
                        <label key={facility.id} className="flex items-start gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedFacilities.includes(facility.name)}
                            onChange={(e) => {
                              const newSelected = e.target.checked
                                ? [...selectedFacilities, facility.name]
                                : selectedFacilities.filter(f => f !== facility.name);
                              setSelectedFacilities(newSelected);
                              setValue('facilityNames', newSelected);
                            }}
                            className="rounded mt-1"
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
                        </label>
                      ))}
                      {facilities.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No facilities found. Contact admin to add facilities.
                        </p>
                      )}
                    </>
                  )}
                </div>
                {errors.facilityNames && (
                  <p className="text-sm text-destructive">{errors.facilityNames.message}</p>
                )}
                {selectedFacilities.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedFacilities.length} facilit{selectedFacilities.length > 1 ? 'ies' : 'y'} selected
                  </p>
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
                <Label htmlFor="sourceCategory">Emission Source Category *</Label>
                <Select
                  value={watch('sourceCategory')}
                  onValueChange={(value) => setValue('sourceCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EMISSION_SOURCE_CATEGORIES[sourceType]?.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                    {FUEL_SUBSTANCE_TYPES[sourceType]?.map((fuel) => (
                      <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
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
              category={sourceType}
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
                    {ACTIVITY_UNITS[sourceType]?.map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
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
                {MOCK_TEAM_MEMBERS.map(member => (
                  <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCollectors.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCollectors([...selectedCollectors, member.id]);
                        } else {
                          setSelectedCollectors(selectedCollectors.filter(id => id !== member.id));
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
                {MOCK_TEAM_MEMBERS.map(member => (
                  <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedVerifiers.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVerifiers([...selectedVerifiers, member.id]);
                        } else {
                          setSelectedVerifiers(selectedVerifiers.filter(id => id !== member.id));
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
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {editTemplate ? 'Update Source' : 'Save Source Definition'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SourceTemplateForm;
