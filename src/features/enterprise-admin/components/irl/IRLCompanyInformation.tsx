
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ESGDDRequiredFields from './ESGDDRequiredFields';
import BasicCompanyFields from './BasicCompanyFields';
import OfficeSpaceSection from './OfficeSpaceSection';
import OutsourcedServicesSection from './OutsourcedServicesSection';
import { CompanyFormData, OfficeSpace, OutsourcedService, LocationDetails } from './types';
import { toast } from 'sonner';
import { fetchCompanyData, updateCompanyData } from '../../services/companyApi';
import { Loader2 } from 'lucide-react';
import { logger } from '@/hooks/logger';
const IRLCompanyInformation = ({ buttonEnabled }: { buttonEnabled: boolean }) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    legalEntityName: '',
    user_id: '',
    emailId: '',
    incorporationDate: '',
    companyName: '',
    contactNumber: '',
    paidUpCapital: '',
    currentTurnover: '',
    previousTurnover: '',
    parentCompany: '',
    productsServices: '',
    foundingTeam: '',
    totalBeneficiaries: '',
    litigationDetails: '',
    esgTeamMembers: '',
    facilitiesCompliance: '',
    labourCompliances: '',
    fireTraining: '',
    hrPoliciesTraining: '',
    mockDrills: '',
    employeeWellbeingHealthInsurance: '',
    employeeWellbeingAccidentInsurance: '',
    employeeWellbeingMaternityBenefits: '',
    employeeWellbeingPaternityBenefits: '',
    employeeWellbeingDayCare: '',
    employeeWellbeingLifeInsurance: '',
    retrenchmentDetails: '',
    gstNumber: '',
    assuranceProviderName: '',
    assuranceType: '',
    cinNumber: '',
    industry: '',
    registeredOfficeAddress: '',
    headOfficeAddress: '',
    website: '',
    financialYearReporting: '',
    businessActivitiesDescription: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getUserEntityId = () => {
    try {
      const user = localStorage.getItem('fandoro-user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser?.entityId || null;
      }
      return null;
    } catch (error) {
      logger.error("Error parsing user data:", error);
      return null;
    }
  };
  const entityId = getUserEntityId();
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (!entityId) {
          setError('Please complete your company profile in the Administration section before submitting IRL details.');
          setIsLoading(false);
          return;
        }
        const data: any = await fetchCompanyData();
        if (data) {
          setFormData(prev => ({
            ...prev,
            legalEntityName: data.legal_name || '',
            companyName: data.company_name || '',
            // user_id: data.user_id || '',
            user_id: data.user_id?._id || '',
            emailId: data.email || '',
            contactNumber: data.contact_number || '',
            incorporationDate: data.incorporation_date || '',
            paidUpCapital: data.paid_up_capital?.toString() || '',
            cinNumber: data.cin || '',
            gstNumber: data.gst || '',
            registeredOfficeAddress: data.registered_office || '',
            headOfficeAddress: data.head_office || '',
            assuranceProviderName: data.assurance_provider_name || '',
            assuranceType: data.assurance_type || '',
            industry: data.industry || '',
            website: data.website || '',
            currentTurnover: data.currentTurnover || '',
            previousTurnover: data.previousTurnover || '',
            parentCompany: data.parentCompany || '',
            productsServices: data.productsServices || '',
            foundingTeam: data.foundingTeam || '',
            totalBeneficiaries: data.totalBeneficiaries || '',
            litigationDetails: data.litigationDetails || '',
            esgTeamMembers: data.esgTeamMembers || '',
            facilitiesCompliance: data.facilitiesCompliance || '',
            labourCompliances: data.labourCompliances || '',
            fireTraining: data.fireTraining || '',
            hrPoliciesTraining: data.hrPoliciesTraining || '',
            mockDrills: data.mockDrills || '',
            employeeWellbeingHealthInsurance: data.employeeWellbeingHealthInsurance || '',
            employeeWellbeingAccidentInsurance: data.employeeWellbeingAccidentInsurance || '',
            employeeWellbeingMaternityBenefits: data.employeeWellbeingMaternityBenefits || '',
            employeeWellbeingPaternityBenefits: data.employeeWellbeingPaternityBenefits || '', // ✅ Now mapped
            employeeWellbeingDayCare: data.employeeWellbeingDayCare || '',
            employeeWellbeingLifeInsurance: data.employeeWellbeingLifeInsurance || '',
            retrenchmentDetails: data.retrenchmentDetails || '',
            financialYearReporting: data.financial_year || '',
            businessActivitiesDescription: data.businessActivitiesDescription || ''
          }));
        } else {
          logger.error('Error fetching company data');
        }
      } catch (error) {
        logger.error('Error fetching company data:', error);
        // setError('Failed to load company data');
        // toast.error('Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const buildCompanyPayload = (isDraft = false) => ({
    legal_name: formData.legalEntityName,
    user_id: formData.user_id,
    company_name: formData.companyName,
    email: formData.emailId,
    contact_number: formData.contactNumber,
    incorporation_date: formData.incorporationDate,
    paid_up_capital: formData.paidUpCapital,
    cin: formData.cinNumber,
    gst: formData.gstNumber,
    registered_office: formData.registeredOfficeAddress,
    head_office: formData.headOfficeAddress,
    assurance_provider_name: formData.assuranceProviderName,
    assurance_type: formData.assuranceType,
    industry: formData.industry,
    website: formData.website,
    currentTurnover: formData.currentTurnover,
    previousTurnover: formData.previousTurnover,
    parentCompany: formData.parentCompany,
    productsServices: formData.productsServices,
    foundingTeam: formData.foundingTeam,
    totalBeneficiaries: formData.totalBeneficiaries,
    litigationDetails: formData.litigationDetails,
    // workingHours: formData.workingHours,
    // shiftTiming: formData.shiftTiming,
    // otHoursCurrent: formData.otHoursCurrent,
    // otHoursPrevious: formData.otHoursPrevious,
    // otPayCompensation: formData.otPayCompensation,
    // facilitiesList: formData.facilitiesList,
    // productSafetyCertifications: formData.productSafetyCertifications,
    // emergencyIncidents: formData.emergencyIncidents,
    esgTeamMembers: formData.esgTeamMembers,
    facilitiesCompliance: formData.facilitiesCompliance,
    labourCompliances: formData.labourCompliances,
    fireTraining: formData.fireTraining,
    hrPoliciesTraining: formData.hrPoliciesTraining,
    mockDrills: formData.mockDrills,
    employeeWellbeingHealthInsurance: formData.employeeWellbeingHealthInsurance,
    employeeWellbeingAccidentInsurance: formData.employeeWellbeingAccidentInsurance,
    employeeWellbeingMaternityBenefits: formData.employeeWellbeingMaternityBenefits,
    employeeWellbeingPaternityBenefits: formData.employeeWellbeingPaternityBenefits,
    employeeWellbeingDayCare: formData.employeeWellbeingPaternityBenefits,
    employeeWellbeingLifeInsurance: formData.employeeWellbeingLifeInsurance,
    // transportationDetails: formData.transportationDetails,
    // youngWorkers: formData.youngWorkers,
    retrenchmentDetails: formData.retrenchmentDetails,
    financial_year: formData.financialYearReporting,
    businessActivitiesDescription: formData.businessActivitiesDescription,
    isDraft: isDraft
  });

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = buildCompanyPayload(true);
      const response = await updateCompanyData(data);

      toast.success('Draft saved successfully!');
      logger.log('Draft saved:', response);
    } catch (error) {
      logger.error('Error saving draft:', error);
      setError('Failed to save draft');
      toast.error('Failed to save draft');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    // if (!formData.legalEntityName || !formData.emailId) {
    //   setError('Please fill in all required fields');
    //   toast.error('Please fill in all required fields');
    //   return;
    // }

    setIsLoading(true);
    setError(null);
    try {
      const data = buildCompanyPayload(false);
      logger.log('Payload being sent:', data);
      const response = await updateCompanyData(data);

      toast.success('Form submitted successfully!');
      logger.log('Form submitted:', response);
    } catch (error) {
      logger.error('Error submitting form:', error);
      setError('Failed to submit form');
      toast.error('Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  const [officeSpaces, setOfficeSpaces] = useState<OfficeSpace[]>([
    { location: '', type: '', address: '', geotagLocation: '', numberOfSeats: '' }
  ]);

  const [outsourcedServices, setOutsourcedServices] = useState<OutsourcedService[]>([
    { agencyName: '', servicesDischarged: '', malePersons: '', femalePersons: '' }
  ]);

  const [locationDetails, setLocationDetails] = useState<LocationDetails[]>([
    { locationType: 'National', warehouses: '', offices: '', distributionCenters: '', total: '' },
    { locationType: 'International', warehouses: '', offices: '', distributionCenters: '', total: '' }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Please provide comprehensive information about your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
      {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2">Loading Hr operations data...</span>
          </div>
        ) : error ? (
          <p className="text-blue-500 font-medium text-sm text-center bg-blue-50 p-3 rounded-md">
            {error}
          </p>
        ) : (
          <>
        <ESGDDRequiredFields formData={formData} setFormData={setFormData} />

        <BasicCompanyFields formData={formData} setFormData={setFormData} />

        <div className="space-y-2">
          <Label htmlFor="totalBeneficiaries">11. Total Beneficiaries/Customer Base</Label>
          <Input
            id="totalBeneficiaries"
            value={formData.totalBeneficiaries}
            onChange={(e) => setFormData({ ...formData, totalBeneficiaries: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="litigationDetails">12. Provide details of litigation or financial penalties against Company/Board of Directors/Founders or KMPs, if any?</Label>
          <Textarea
            id="litigationDetails"
            value={formData.litigationDetails}
            onChange={(e) => setFormData({ ...formData, litigationDetails: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <Label>13. Team members/designation assigned the following responsibilities on ESG management?</Label>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facilitiesCompliance">(a) Compliances related to facility management (e-waste, waste management, water management, batteries, fire infra, occupancy certificate, fire NOC)</Label>
              <Input
                id="facilitiesCompliance"
                value={formData.facilitiesCompliance}
                onChange={(e) => setFormData({ ...formData, facilitiesCompliance: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labourCompliances">(b) Labour compliances (on-roll, on-contract)</Label>
              <Input
                id="labourCompliances"
                value={formData.labourCompliances}
                onChange={(e) => setFormData({ ...formData, labourCompliances: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fireTraining">(c) Fire training</Label>
              <Input
                id="fireTraining"
                value={formData.fireTraining}
                onChange={(e) => setFormData({ ...formData, fireTraining: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hrPoliciesTraining">(d) Training on HR policies</Label>
              <Input
                id="hrPoliciesTraining"
                value={formData.hrPoliciesTraining}
                onChange={(e) => setFormData({ ...formData, hrPoliciesTraining: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mockDrills">(e) Mock drills</Label>
              <Input
                id="mockDrills"
                value={formData.mockDrills}
                onChange={(e) => setFormData({ ...formData, mockDrills: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>14. Details of measures for the well-being of employees (including differently abled): % of employees covered by</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="healthInsurance">Health insurance</Label>
              <Input
                id="healthInsurance"
                value={formData.employeeWellbeingHealthInsurance}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingHealthInsurance: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accidentInsurance">Accident insurance</Label>
              <Input
                id="accidentInsurance"
                value={formData.employeeWellbeingAccidentInsurance}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingAccidentInsurance: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maternityBenefits">Maternity benefits</Label>
              <Input
                id="maternityBenefits"
                value={formData.employeeWellbeingMaternityBenefits}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingMaternityBenefits: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paternityBenefits">Paternity Benefits</Label>
              <Input
                id="paternityBenefits"
                value={formData.employeeWellbeingPaternityBenefits}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingPaternityBenefits: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dayCare">Day Care facilities</Label>
              <Input
                id="dayCare"
                value={formData.employeeWellbeingDayCare}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingDayCare: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lifeInsurance">Life Insurance</Label>
              <Input
                id="lifeInsurance"
                value={formData.employeeWellbeingLifeInsurance}
                onChange={(e) => setFormData({ ...formData, employeeWellbeingLifeInsurance: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button onClick={handleSave} variant="outline" className="flex-1" disabled={isLoading || !buttonEnabled}>
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={isLoading || !buttonEnabled}>
            Submit
          </Button>
        </div>
        </>
        )}
      </CardContent>
    </Card>
  );
};

export default IRLCompanyInformation;
