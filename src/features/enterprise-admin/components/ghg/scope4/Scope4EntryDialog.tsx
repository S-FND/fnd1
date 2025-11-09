import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { 
  Scope4Entry, 
  AvoidedEmissionSourceType, 
  MethodologyUsed,
  DataQuality,
  VerificationStatus,
  MeasurementFrequency,
  getCurrentFY,
  defaultEmissionFactorSource,
  calculateAvoidedEmissionPerUnit,
  calculateTotalAvoidedEmission
} from '@/types/scope4-ghg';
import { supabase } from '@/integrations/supabase/client';

interface Scope4EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Scope4Entry) => void;
  entry?: Scope4Entry;
  teamMembers: Array<{ id: string; name: string; }>;
}

const sourceTypes: AvoidedEmissionSourceType[] = [
  "Product Use",
  "Product Manufacturing",
  "Product End-of-Life",
  "Transportation",
  "Energy Generation",
  "Other"
];

const methodologies: MethodologyUsed[] = [
  "Comparative LCA",
  "Baseline and Credit",
  "Project-Based",
  "Activity-Based",
  "Other"
];

const dataQualities: DataQuality[] = ["High", "Medium", "Low"];
const verificationStatuses: VerificationStatus[] = ["Verified", "Pending", "Not Verified"];

const Scope4EntryDialog: React.FC<Scope4EntryDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  entry,
  teamMembers
}) => {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<Array<{ id: string; name: string; code?: string; location?: string }>>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [formData, setFormData] = useState<Scope4Entry>({
    id: '',
    facilityName: '',
    businessUnit: '',
    reportingPeriod: getCurrentFY(),
    sourceType: 'Product Use',
    emissionDescription: '',
    baselineScenario: '',
    functionalUnit: '',
    referenceStandard: '',
    productOutput: 0,
    activityDataUnit: '',
    baselineEmissionFactor: 0,
    projectEmissionFactor: 0,
    avoidedEmissionPerUnit: 0,
    totalAvoidedEmission: 0,
    methodology: 'Comparative LCA',
    emissionFactorSource: defaultEmissionFactorSource,
    dataSource: '',
    measurementFrequency: 'Annually',
    dataQuality: 'Medium',
    verifiedBy: '',
    verificationStatus: 'Pending',
    dataEntryDate: new Date().toISOString().split('T')[0],
    enteredBy: '',
    notes: ''
  });


  // Fetch facilities on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      setLoadingFacilities(true);
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
          title: "Error Loading Facilities",
          description: "Could not load facilities. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingFacilities(false);
      }
    };

    if (open) {
      fetchFacilities();
    }
  }, [open, toast]);

  useEffect(() => {
    if (entry) {
      setFormData(entry);
    } else {
      setFormData({
        id: Date.now().toString(),
        facilityName: '',
        businessUnit: '',
        reportingPeriod: getCurrentFY(),
        sourceType: 'Product Use',
        emissionDescription: '',
        baselineScenario: '',
        functionalUnit: '',
        referenceStandard: '',
        productOutput: 0,
        activityDataUnit: '',
        baselineEmissionFactor: 0,
        projectEmissionFactor: 0,
        avoidedEmissionPerUnit: 0,
        totalAvoidedEmission: 0,
        methodology: 'Comparative LCA',
        emissionFactorSource: defaultEmissionFactorSource,
        dataSource: '',
        dataQuality: 'Medium',
        verifiedBy: '',
        verificationStatus: 'Pending',
        dataEntryDate: new Date().toISOString().split('T')[0],
        enteredBy: '',
        notes: ''
      });
    }
  }, [entry, open]);

  useEffect(() => {
    const avoidedPerUnit = calculateAvoidedEmissionPerUnit(
      formData.baselineEmissionFactor,
      formData.projectEmissionFactor
    );
    const totalAvoided = calculateTotalAvoidedEmission(
      formData.productOutput,
      avoidedPerUnit
    );

    setFormData(prev => ({
      ...prev,
      avoidedEmissionPerUnit: avoidedPerUnit,
      totalAvoidedEmission: totalAvoided
    }));
  }, [formData.baselineEmissionFactor, formData.projectEmissionFactor, formData.productOutput]);


  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit' : 'Add'} Scope 4 Entry</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div>
            <Label htmlFor="facilityName">Facility / Location Name *</Label>
            <Select
              value={formData.facilityName}
              onValueChange={(value) => setFormData({ ...formData, facilityName: value })}
              disabled={loadingFacilities}
            >
              <SelectTrigger id="facilityName">
                <SelectValue placeholder={loadingFacilities ? "Loading facilities..." : "Select facility..."} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="Other">
                  <span className="font-medium">Other</span>
                </SelectItem>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.name}>
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
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="businessUnit">Business Unit / Division *</Label>
            <Input
              id="businessUnit"
              value={formData.businessUnit}
              onChange={(e) => setFormData({ ...formData, businessUnit: e.target.value })}
              placeholder="e.g., Sustainable Products Division"
            />
          </div>

          <div>
            <Label htmlFor="reportingPeriod">Reporting Period</Label>
            <Input
              id="reportingPeriod"
              value={formData.reportingPeriod}
              onChange={(e) => setFormData({ ...formData, reportingPeriod: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="sourceType">Avoided Emission Source Type *</Label>
            <Select
              value={formData.sourceType}
              onValueChange={(value: AvoidedEmissionSourceType) => 
                setFormData({ ...formData, sourceType: value })
              }
            >
              <SelectTrigger id="sourceType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sourceTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="emissionDescription">Avoided Emission Description *</Label>
            <Textarea
              id="emissionDescription"
              value={formData.emissionDescription}
              onChange={(e) => setFormData({ ...formData, emissionDescription: e.target.value })}
              placeholder="e.g., Energy-efficient refrigerators replacing standard models"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="baselineScenario">Comparative Baseline Scenario *</Label>
            <Input
              id="baselineScenario"
              value={formData.baselineScenario}
              onChange={(e) => setFormData({ ...formData, baselineScenario: e.target.value })}
              placeholder="e.g., Conventional refrigerator (250 kWh/year)"
            />
          </div>

          <div>
            <Label htmlFor="functionalUnit">Functional Unit *</Label>
            <Input
              id="functionalUnit"
              value={formData.functionalUnit}
              onChange={(e) => setFormData({ ...formData, functionalUnit: e.target.value })}
              placeholder="e.g., 1 unit"
            />
          </div>

          <div>
            <Label htmlFor="referenceStandard">Reference Standard or Study *</Label>
            <Input
              id="referenceStandard"
              value={formData.referenceStandard}
              onChange={(e) => setFormData({ ...formData, referenceStandard: e.target.value })}
              placeholder="e.g., LCA Report 2024"
            />
          </div>

          <div>
            <Label htmlFor="productOutput">Product or Service Output *</Label>
            <Input
              id="productOutput"
              type="number"
              value={formData.productOutput}
              onChange={(e) => setFormData({ ...formData, productOutput: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 10000"
            />
          </div>

          <div>
            <Label htmlFor="activityDataUnit">Activity Data Unit *</Label>
            <Input
              id="activityDataUnit"
              value={formData.activityDataUnit}
              onChange={(e) => setFormData({ ...formData, activityDataUnit: e.target.value })}
              placeholder="e.g., units, kWh, deliveries"
            />
          </div>

          {/* Emission Factors */}
          <div>
            <Label htmlFor="baselineEmissionFactor">Baseline Emission Factor (kg CO₂e/unit) *</Label>
            <Input
              id="baselineEmissionFactor"
              type="number"
              step="0.01"
              value={formData.baselineEmissionFactor}
              onChange={(e) => setFormData({ ...formData, baselineEmissionFactor: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 250"
            />
          </div>

          <div>
            <Label htmlFor="projectEmissionFactor">Project Emission Factor (kg CO₂e/unit) *</Label>
            <Input
              id="projectEmissionFactor"
              type="number"
              step="0.01"
              value={formData.projectEmissionFactor}
              onChange={(e) => setFormData({ ...formData, projectEmissionFactor: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 150"
            />
          </div>

          <div>
            <Label>Avoided Emission per Unit (kg CO₂e/unit)</Label>
            <Input
              value={formData.avoidedEmissionPerUnit.toFixed(2)}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label>Total Avoided Emission (tCO₂e)</Label>
            <Input
              value={formData.totalAvoidedEmission.toFixed(2)}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Methodology and Data Quality */}
          <div>
            <Label htmlFor="methodology">Methodology Used *</Label>
            <Select
              value={formData.methodology}
              onValueChange={(value: MethodologyUsed) => 
                setFormData({ ...formData, methodology: value })
              }
            >
              <SelectTrigger id="methodology">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {methodologies.map((method) => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="emissionFactorSource">Emission Factor Source</Label>
            <Input
              id="emissionFactorSource"
              value={formData.emissionFactorSource}
              onChange={(e) => setFormData({ ...formData, emissionFactorSource: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="dataSource">Data Source *</Label>
            <Input
              id="dataSource"
              value={formData.dataSource}
              onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
              placeholder="e.g., Internal test data, Customer data"
            />
          </div>

          <div>
            <Label htmlFor="measurementFrequency">Measurement Frequency</Label>
            <Select
              value={formData.measurementFrequency}
              onValueChange={(value: MeasurementFrequency) => {
                setFormData({ ...formData, measurementFrequency: value });
              }}
            >
              <SelectTrigger id="measurementFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dataQuality">Data Quality / Confidence *</Label>
            <Select
              value={formData.dataQuality}
              onValueChange={(value: DataQuality) => 
                setFormData({ ...formData, dataQuality: value })
              }
            >
              <SelectTrigger id="dataQuality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataQualities.map((quality) => (
                  <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Verification and Entry Info */}
          <div>
            <Label htmlFor="verifiedBy">Verifier / Reviewed By *</Label>
            <Select
              value={formData.verifiedBy}
              onValueChange={(value) => setFormData({ ...formData, verifiedBy: value })}
            >
              <SelectTrigger id="verifiedBy">
                <SelectValue placeholder="Select verifier" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="verificationStatus">Verification Status *</Label>
            <Select
              value={formData.verificationStatus}
              onValueChange={(value: VerificationStatus) => 
                setFormData({ ...formData, verificationStatus: value })
              }
            >
              <SelectTrigger id="verificationStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {verificationStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dataEntryDate">Data Entry Date</Label>
            <Input
              id="dataEntryDate"
              type="date"
              value={formData.dataEntryDate}
              onChange={(e) => setFormData({ ...formData, dataEntryDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="enteredBy">Entered By *</Label>
            <Select
              value={formData.enteredBy}
              onValueChange={(value) => setFormData({ ...formData, enteredBy: value })}
            >
              <SelectTrigger id="enteredBy">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">Notes / Comments</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes or comments..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {entry ? 'Update' : 'Add'} Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Scope4EntryDialog;
