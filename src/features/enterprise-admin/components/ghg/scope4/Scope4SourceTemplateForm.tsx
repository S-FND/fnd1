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
// import { supabase } from '@/integrations/supabase/client';
import EmissionFactorSelector from '../shared/EmissionFactorSelector';
import { EmissionFactor } from '@/data/ghg/emissionFactors';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { httpClient } from '@/lib/httpClient';

interface Facility {
  id: string;
  name: string;
  code: string | null;
  location: string | null;
}

const SCOPE4_SOURCE_TYPES = [
  'Product Use',
  'Product Manufacturing',
  'Product End-of-Life',
  'Transportation',
  'Energy Generation',
  'Other'
];

const MEASUREMENT_FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'];
const ACTIVITY_UNITS = ['kg CO₂e', 'tonnes CO₂e', 'kWh', 'units', 'INR'];

const formSchema = z.object({
  facilityName: z.string().min(1, 'Facility name is required'),
  businessUnit: z.string().min(1, 'Business unit is required'),
  sourceType: z.string().min(1, 'Source type is required'),
  sourceDescription: z.string().min(1, 'Description is required'),
  avoidedEmissionType: z.string().min(1, 'Avoided emission type is required'),
  baselineScenario: z.string().min(1, 'Baseline scenario is required'),
  activityDataUnit: z.string().min(1, 'Activity unit is required'),
  measurementFrequency: z.string().min(1, 'Measurement frequency is required'),
  calculationMethodology: z.string().min(1, 'Methodology is required'),
  dataSource: z.string().min(1, 'Data source is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const Scope4SourceTemplateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { template: editTemplate } = location.state || {};

  const [selectedEmissionFactor, setSelectedEmissionFactor] = useState<EmissionFactor | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [teamMembers, setTeamMembers] = useState<{ _id: string; name: string,employeeId: string }[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editTemplate ? {
      facilityName: editTemplate.facilityName,
      businessUnit: editTemplate.businessUnit,
      sourceType: editTemplate.sourceType,
      sourceDescription: editTemplate.sourceDescription,
      avoidedEmissionType: editTemplate.avoidedEmissionType,
      baselineScenario: editTemplate.baselineScenario,
      activityDataUnit: editTemplate.activityDataUnit,
      measurementFrequency: editTemplate.measurementFrequency,
      calculationMethodology: editTemplate.calculationMethodology,
      dataSource: editTemplate.dataSource,
      notes: editTemplate.notes,
    } : {
      sourceType: 'Product Use',
      calculationMethodology: 'GHG Protocol - Avoided Emissions',
    }
  });

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
  
    useEffect(() => {
      getFacilities();
      getTeamList()
    }, []);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
    //   const { data, error } = await supabase
    //     .from('facilities')
    //     .select('id, name, code, location')
    //     .eq('is_active', true)
    //     .order('name');

    //   if (error) throw error;
    let data=[]
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
    //   id: editTemplate?.id || uuidv4(),
      scope: 4,
      facilityName: data.facilityName,
      businessUnit: data.businessUnit,
      sourceCategory: data.sourceType,
      sourceDescription: data.sourceDescription,
      sourceType: data.sourceType,
      avoidedEmissionType: data.avoidedEmissionType,
      baselineScenario: data.baselineScenario,
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

    // const key = 'scope4_source_templates';
    // const stored = localStorage.getItem(key);
    // const templates: GHGSourceTemplate[] = stored ? JSON.parse(stored) : [];

    // if (editTemplate) {
    //   const index = templates.findIndex(t => t.id === editTemplate.id);
    //   if (index >= 0) templates[index] = template;
    // } else {
    //   templates.push(template);
    // }

    // localStorage.setItem(key, JSON.stringify(templates));

    toast({
      title: editTemplate ? "Source Updated" : "Source Defined",
      description: `${template.sourceDescription} has been ${editTemplate ? 'updated' : 'saved'} successfully.`,
    });

    navigate('/ghg-accounting');
  };

  return (
    <UnifiedSidebarLayout>
        <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/ghg-accounting')}>
            <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
            <h1 className="text-3xl font-bold">
                {editTemplate ? 'Edit' : 'Define New'} Scope 4 Emission Source
            </h1>
            <p className="text-muted-foreground">
                Step 1: Define the avoided emission source for data collection
            </p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Define the avoided emission source details</CardDescription>
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
                    <Input {...register('businessUnit')} placeholder="e.g., Sustainability Innovation" />
                    {errors.businessUnit && <p className="text-sm text-destructive">{errors.businessUnit.message}</p>}
                </div>
                </div>

                <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type *</Label>
                <Select onValueChange={(value) => setValue('sourceType', value)} defaultValue={editTemplate?.sourceType}>
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    {SCOPE4_SOURCE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                {errors.sourceType && <p className="text-sm text-destructive">{errors.sourceType.message}</p>}
                </div>

                <div className="space-y-2">
                <Label htmlFor="sourceDescription">Source Description *</Label>
                <Input {...register('sourceDescription')} placeholder="e.g., Energy-efficient product deployment" />
                {errors.sourceDescription && <p className="text-sm text-destructive">{errors.sourceDescription.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="avoidedEmissionType">Avoided Emission Type *</Label>
                    <Input {...register('avoidedEmissionType')} placeholder="e.g., Reduced electricity consumption" />
                    {errors.avoidedEmissionType && <p className="text-sm text-destructive">{errors.avoidedEmissionType.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="baselineScenario">Baseline Scenario *</Label>
                    <Input {...register('baselineScenario')} placeholder="e.g., Conventional product" />
                    {errors.baselineScenario && <p className="text-sm text-destructive">{errors.baselineScenario.message}</p>}
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
                scope={4}
                category="Product Use"
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
                <Input {...register('dataSource')} placeholder="e.g., Product testing data, Customer surveys" />
                {errors.dataSource && <p className="text-sm text-destructive">{errors.dataSource.message}</p>}
                </div>

                <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea {...register('notes')} placeholder="Additional information about this avoided emission source" />
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

export default Scope4SourceTemplateForm;