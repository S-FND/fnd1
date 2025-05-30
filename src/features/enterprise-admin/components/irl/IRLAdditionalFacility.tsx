
import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';

const facilityItems = [
  "Consent to Operate granted by State Pollution Control Board (SPCB); Attach the renewal application if CTO is expired or nearing expiration.",
  "Factories License issued by Factories Inspectorate",
  "Bore well water meter readings (if any)",
  "Building stability certificate",
  "Contractor's license under Contract Labour Act",
  "Approval from Electrical Inspector for operation of Generator set(s) (if any)",
  "Industrial Standing Order approved from Factory Inspector",
  "Security Agency appointed at the facility - PSARA license of the Security Agency (under Private Security Agency Regulation Act)",
  "Factory Approved Plan by DISH (Dept. of Industrial Safety & Health)",
  "Environmental Statement in Form V",
  "Records of on-site Air, Water and Noise quality monitoring",
  "DG Set Maintenance records, if applicable",
  "Copy of drinking water analysis records from third party NABL accredited laboratory",
  "Registration Certificate of bore well (if any)",
  "DG Stack monitoring report - two recent analysis reports",
  "Recent sample reports of earth pits resistance (connected to all electrical equipment)",
  "Test report of lightning arrestor",
  "Transformer test report",
  "Records for refilling of any refrigerant for maintenance of air conditioning / HVAC system",
  "Pest Control Records",
  "Photograph of the DG set",
  "Photograph of the Transformer",
  "Photograph of the Lightening arrestor and earth pits",
  "Photograph of the entire PPE kit",
  "Name of Contractors",
  "Transportation Checklist",
  "Name of Refrigerants",
  "Supplier Code of Conduct",
  "Partner Selection Criteria Checklist",
  "Diesel Generator set (provide details)",
  "Air Compressors (provide details)",
  "AHUs (provide details)",
  "Fire Hydrant (provide details of main pump, jockey pump, manual/ auto)",
  "Fire extinguisher (specify the types and number for each)",
  "Other Fire emergency infrastructure (state the ones present - smoke detectors, siren, public address system, sprinklers)",
  "Gas Cylinder used for any purpose? If yes, provide details",
  "Any bulk Fuel Storage? If yes, provide details",
  "Any chemicals stored in bulk quantities? If yes, provide details",
  "State types of waste generated across facilities along with annual quantity - hazardous waste, biomedical waste, plastic waste, e-waste, other solid waste",
  "Source of water (Groundwater, tanker, industrial water supply, other)"
];

const IRLAdditionalFacility = () => {
  return (
    <IRLComplianceTable
      title="Additional (Facility Level)"
      description="Facility Level Compliance- Office, Plant, Warehouse, Distribution Centre"
      items={facilityItems}
    />
  );
};

export default IRLAdditionalFacility;
