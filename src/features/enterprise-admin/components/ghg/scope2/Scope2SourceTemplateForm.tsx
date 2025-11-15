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
import { supabase } from '@/integrations/supabase/client';
import EmissionFactorSelector from '../shared/EmissionFactorSelector';
import { EmissionFactor } from '@/data/ghg/emissionFactors';

interface Facility {
  id: string;
  name: string;
  code: string | null;
  location: string | null;
}

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
  facilityName: z.string().min(1, 'Facility name is required'),
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
  const { template: editTemplate } = location.state || {};

  const [sourceType, setSourceType] = useState(editTemplate?.sourceType || 'Purchased Electricity');
  const [selectedEmissionFactor, setSelectedEmissionFactor] = useState<EmissionFactor | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editTemplate ? {
      facilityName: editTemplate.facilityName,
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
      const { data, error } = await supabase
        .from('facilities')
        .select('id, name, code, location')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
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

  const onSubmit = (data: FormData) => {
    if (!selectedEmissionFactor) {
      toast({
        title: "Emission Factor Required",
        description: "Please select an emission factor",
        variant: "destructive",
      });
      return;
    }

    const template: GHGSourceTemplate = {
      id: editTemplate?.id || uuidv4(),
      scope: 2,
      facilityName: data.facilityName,
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
      assignedDataCollectors: [],
      assignedVerifiers: [],
      ghgIncluded: 'CO₂, CH₄, N₂O',
      calculationMethodology: data.calculationMethodology,
      dataSource: data.dataSource,
      isActive: true,
      createdDate: editTemplate?.createdDate || new Date().toISOString(),
      createdBy: 'Current User',
      notes: data.notes || '',
    };

    const key = 'scope2_source_templates';
    const stored = localStorage.getItem(key);
    const templates: GHGSourceTemplate[] = stored ? JSON.parse(stored) : [];

    if (editTemplate) {
      const index = templates.findIndex(t => t.id === editTemplate.id);
      if (index >= 0) templates[index] = template;
    } else {
      templates.push(template);
    }

    localStorage.setItem(key, JSON.stringify(templates));

    toast({
      title: editTemplate ? "Source Updated" : "Source Defined",
      description: `${template.sourceDescription} has been ${editTemplate ? 'updated' : 'saved'} successfully.`,
    });

    navigate('/ghg-accounting');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/ghg-accounting')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {editTemplate ? 'Edit' : 'Define New'} Scope 2 Emission Source
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
                <Label htmlFor="facilityName">Facility/Location *</Label>
                <Select onValueChange={(value) => setValue('facilityName', value)} defaultValue={editTemplate?.facilityName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map(facility => (
                      <SelectItem key={facility.id} value={facility.name}>
                        {facility.name} {facility.code && `(${facility.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.facilityName && <p className="text-sm text-destructive">{errors.facilityName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessUnit">Business Unit *</Label>
                <Input {...register('businessUnit')} placeholder="e.g., Operations – West India" />
                {errors.businessUnit && <p className="text-sm text-destructive">{errors.businessUnit.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type *</Label>
                <Select onValueChange={(value) => setValue('sourceType', value)} defaultValue={sourceType}>
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
                <Label htmlFor="sourceCategory">Source Category *</Label>
                <Select onValueChange={(value) => setValue('sourceCategory', value)} defaultValue={editTemplate?.sourceCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                <Select onValueChange={(value) => setValue('scope2Category', value as any)} defaultValue={editTemplate?.scope2Category}>
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
  );
};

export default Scope2SourceTemplateForm;
