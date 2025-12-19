import { supabase } from '@/integrations/supabase/client';
import { GHGSourceTemplate } from '@/types/ghg-source-template';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seeds test data for the approval workflow.
 * Run this function from the browser console: seedTestData()
 */
export async function seedTestData() {
  try {
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Must be authenticated to seed test data. Please log in first.');
    }

    console.log('Seeding test data for user:', user.email);

    // 1. Check/Create portfolio company
    let companyId: string;
    const { data: existingCompany } = await supabase
      .from('portfolio_companies')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existingCompany) {
      companyId = existingCompany.id;
      console.log('Using existing company:', companyId);
    } else {
      console.log('No portfolio company found. Creating one via SQL is required.');
      console.log('Run this in the Supabase SQL Editor:');
      console.log(`
INSERT INTO portfolio_companies (name, slug, is_approved, approval_status)
VALUES ('Test Company', 'test-company', true, 'approved');
      `);
      throw new Error('No portfolio company exists. Please create one first via Supabase SQL Editor.');
    }

    // 2. Check/Create user profile
    let userProfileId: string;
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('user_id, portfolio_company_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingProfile) {
      userProfileId = existingProfile.user_id;
      console.log('Using existing profile:', userProfileId);
    } else {
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || 'Test Verifier',
          role: 'portfolio_company_admin',
          portfolio_company_id: companyId,
          is_active: true,
        })
        .select()
        .single();

      if (profileError) throw profileError;
      userProfileId = newProfile.user_id;
      console.log('Created user profile:', userProfileId);
    }

    // 3. Set up user role with verifier permissions
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existingRole) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin',
          can_make_actions: true,
          can_approve_actions: true,
        });

      if (roleError) {
        console.warn('Could not create user_role:', roleError.message);
      } else {
        console.log('Created user_role with verifier permissions');
      }
    } else {
      await supabase
        .from('user_roles')
        .update({ can_approve_actions: true })
        .eq('user_id', user.id);
      console.log('Updated user_role with verifier permissions');
    }

    // 4. Create test GHG sources for different scopes
    const scopeSources = [
      { scope: 'Scope 1', source_name: 'Diesel Generator - Main Building', source_type: 'Stationary Combustion', category: 'Stationary Combustion', activity_unit: 'liters', emission_factor: 2.68 },
      { scope: 'Scope 1', source_name: 'Company Fleet Vehicles', source_type: 'Mobile Combustion', category: 'Mobile Combustion', activity_unit: 'liters', emission_factor: 2.31 },
      { scope: 'Scope 2', source_name: 'Grid Electricity - Factory', source_type: 'Purchased Electricity', category: 'Purchased Electricity', activity_unit: 'kWh', emission_factor: 0.82 },
      { scope: 'Scope 2', source_name: 'Grid Electricity - Office', source_type: 'Purchased Electricity', category: 'Purchased Electricity', activity_unit: 'kWh', emission_factor: 0.82 },
      { scope: 'Scope 3', source_name: 'Employee Commuting', source_type: 'Employee Commuting', category: 'Employee Commuting', activity_unit: 'km', emission_factor: 0.21 },
      { scope: 'Scope 3', source_name: 'Business Travel - Air', source_type: 'Business Travel', category: 'Business Travel', activity_unit: 'km', emission_factor: 0.255 },
    ];

    const createdSources: { id: string; scope: string; source_name: string; emission_factor: number; activity_unit: string }[] = [];

    for (const sourceData of scopeSources) {
      // Check if source exists
      const { data: existingSource } = await supabase
        .from('ghg_sources')
        .select('id')
        .eq('portfolio_company_id', companyId)
        .eq('source_name', sourceData.source_name)
        .maybeSingle();

      if (existingSource) {
        await supabase
          .from('ghg_sources')
          .update({ assigned_verifiers: [user.id] })
          .eq('id', existingSource.id);
        createdSources.push({ 
          id: existingSource.id, 
          scope: sourceData.scope, 
          source_name: sourceData.source_name,
          emission_factor: sourceData.emission_factor,
          activity_unit: sourceData.activity_unit
        });
        console.log('Updated existing source:', sourceData.source_name);
      } else {
        const { data: newSource, error: sourceError } = await supabase
          .from('ghg_sources')
          .insert({
            portfolio_company_id: companyId,
            source_name: sourceData.source_name,
            source_type: sourceData.source_type,
            scope: sourceData.scope,
            category: sourceData.category,
            description: `Test ${sourceData.source_name} for approval workflow`,
            activity_unit: sourceData.activity_unit,
            measurement_frequency: 'Monthly',
            emission_factor: sourceData.emission_factor,
            emission_factor_source: 'IPCC 2006',
            emission_factor_unit: `kgCO2e/${sourceData.activity_unit}`,
            assigned_data_collectors: [user.id],
            assigned_verifiers: [user.id],
            is_active: true,
            reporting_period: 'FY 2024-25',
            created_by: user.id,
          })
          .select()
          .single();

        if (sourceError) {
          console.warn(`Could not create source ${sourceData.source_name}:`, sourceError.message);
        } else {
          createdSources.push({ 
            id: newSource.id, 
            scope: sourceData.scope, 
            source_name: sourceData.source_name,
            emission_factor: sourceData.emission_factor,
            activity_unit: sourceData.activity_unit
          });
          console.log('Created GHG source:', sourceData.source_name);
        }
      }
    }

    // 5. Create submitted activity data for testing approvals
    const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const statuses = ['submitted', 'submitted', 'submitted', 'pending', 'verified', 'approved', 'pending', 'submitted'];

    for (const source of createdSources) {
      for (let i = 0; i < periods.length; i++) {
        const periodName = periods[i];
        const status = statuses[i % statuses.length];
        const activityValue = Math.floor(Math.random() * 500) + 100;
        const emissions = activityValue * source.emission_factor;

        const { error: dataError } = await supabase
          .from('ghg_activity_data')
          .upsert({
            source_id: source.id,
            portfolio_company_id: companyId,
            reporting_period: 'FY 2024-25',
            period_name: periodName,
            activity_value: activityValue,
            activity_unit: source.activity_unit,
            emission_factor: source.emission_factor,
            emission_factor_source: 'IPCC 2006',
            calculated_emissions: emissions,
            data_collection_date: new Date().toISOString().split('T')[0],
            collected_by: user.id,
            status: status,
            created_by: user.id,
            notes: `Test data for ${source.source_name} - ${periodName}`,
          }, { onConflict: 'source_id,reporting_period,period_name' });

        if (dataError) {
          console.warn(`Could not create data for ${source.source_name} ${periodName}:`, dataError.message);
        }
      }
      console.log(`Created activity data for ${source.source_name}`);
    }

    // 6. Create additional test user profiles for the admin page
    const testUsers = [
      { email: 'john.doe@test.com', full_name: 'John Doe', role: 'portfolio_team_editor' as const },
      { email: 'jane.smith@test.com', full_name: 'Jane Smith', role: 'portfolio_team_viewer' as const },
      { email: 'bob.wilson@test.com', full_name: 'Bob Wilson', role: 'portfolio_company_admin' as const },
    ];

    // Note: We can't create fake users in auth.users, so we'll just log this info
    console.log('Note: Additional test users would need to be created via Supabase Auth.');
    console.log('Current user has been set up as admin with verifier permissions.');

    // 7. Create Scope 1 source templates in localStorage for UI workflow
    const scope1Templates: GHGSourceTemplate[] = [
      {
        id: uuidv4(),
        scope: 1,
        facilityName: 'Main Manufacturing Plant',
        businessUnit: 'Operations',
        sourceCategory: 'Stationary Combustion',
        sourceDescription: 'Natural Gas Boiler - Heating',
        sourceType: 'Stationary',
        fuelSubstanceType: 'Natural Gas',
        emissionFactorId: 'ef-001',
        emissionFactor: 2.02,
        emissionFactorUnit: 'kgCO2e/m³',
        emissionFactorSource: 'IPCC 2006',
        activityDataUnit: 'm³',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Activity Data × Emission Factor',
        dataSource: 'Utility Bills',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Primary heating system for manufacturing facility',
      },
      {
        id: uuidv4(),
        scope: 1,
        facilityName: 'Corporate Headquarters',
        businessUnit: 'Administration',
        sourceCategory: 'Stationary Combustion',
        sourceDescription: 'Diesel Generator - Backup Power',
        sourceType: 'Stationary',
        fuelSubstanceType: 'Diesel',
        emissionFactorId: 'ef-002',
        emissionFactor: 2.68,
        emissionFactorUnit: 'kgCO2e/L',
        emissionFactorSource: 'IPCC 2006',
        activityDataUnit: 'liters',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Activity Data × Emission Factor',
        dataSource: 'Fuel Purchase Records',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Emergency backup generator',
      },
      {
        id: uuidv4(),
        scope: 1,
        facilityName: 'Distribution Center',
        businessUnit: 'Logistics',
        sourceCategory: 'Mobile Combustion',
        sourceDescription: 'Delivery Fleet - Diesel Trucks',
        sourceType: 'Mobile',
        fuelSubstanceType: 'Diesel',
        emissionFactorId: 'ef-003',
        emissionFactor: 2.68,
        emissionFactorUnit: 'kgCO2e/L',
        emissionFactorSource: 'IPCC 2006',
        activityDataUnit: 'liters',
        measurementFrequency: 'Weekly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Fuel Consumption × Emission Factor',
        dataSource: 'Fleet Fuel Cards',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Heavy-duty delivery vehicles',
      },
      {
        id: uuidv4(),
        scope: 1,
        facilityName: 'Corporate Headquarters',
        businessUnit: 'Sales',
        sourceCategory: 'Mobile Combustion',
        sourceDescription: 'Company Cars - Petrol',
        sourceType: 'Mobile',
        fuelSubstanceType: 'Petrol/Gasoline',
        emissionFactorId: 'ef-004',
        emissionFactor: 2.31,
        emissionFactorUnit: 'kgCO2e/L',
        emissionFactorSource: 'IPCC 2006',
        activityDataUnit: 'liters',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Fuel Consumption × Emission Factor',
        dataSource: 'Expense Reports',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Sales team company vehicles',
      },
      {
        id: uuidv4(),
        scope: 1,
        facilityName: 'Cold Storage Facility',
        businessUnit: 'Operations',
        sourceCategory: 'Fugitive Emissions',
        sourceDescription: 'Refrigerant Leakage - R410A',
        sourceType: 'Fugitive',
        fuelSubstanceType: 'R-410A Refrigerant',
        emissionFactorId: 'ef-005',
        emissionFactor: 2088,
        emissionFactorUnit: 'kgCO2e/kg',
        emissionFactorSource: 'IPCC AR5 GWP',
        activityDataUnit: 'kg',
        measurementFrequency: 'Quarterly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'HFCs',
        calculationMethodology: 'Refrigerant Loss × GWP',
        dataSource: 'HVAC Service Records',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Industrial refrigeration system',
      },
      {
        id: uuidv4(),
        scope: 1,
        facilityName: 'Chemical Plant',
        businessUnit: 'Production',
        sourceCategory: 'Process Emissions',
        sourceDescription: 'Chemical Process - CO2 Release',
        sourceType: 'Process',
        fuelSubstanceType: 'Industrial Process',
        emissionFactorId: 'ef-006',
        emissionFactor: 1.0,
        emissionFactorUnit: 'kgCO2e/kg product',
        emissionFactorSource: 'Engineering Estimates',
        activityDataUnit: 'kg product',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2',
        calculationMethodology: 'Mass Balance',
        dataSource: 'Production Records',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Process emissions from chemical reactions',
      },
    ];

    // 8. Create Scope 2 source templates in localStorage
    const scope2Templates: GHGSourceTemplate[] = [
      {
        id: uuidv4(),
        scope: 2,
        facilityName: 'Main Manufacturing Plant',
        businessUnit: 'Operations',
        sourceCategory: 'Purchased Electricity',
        sourceDescription: 'Grid Electricity - Production',
        sourceType: 'Purchased Electricity',
        fuelSubstanceType: 'Electricity (Grid)',
        emissionFactorId: 'ef-s2-001',
        emissionFactor: 0.82,
        emissionFactorUnit: 'kgCO2e/kWh',
        emissionFactorSource: 'National Grid Average 2024',
        activityDataUnit: 'kWh',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Location-Based Method',
        dataSource: 'Electricity Bills',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Primary electricity consumption for manufacturing',
      },
      {
        id: uuidv4(),
        scope: 2,
        facilityName: 'Corporate Headquarters',
        businessUnit: 'Administration',
        sourceCategory: 'Purchased Electricity',
        sourceDescription: 'Grid Electricity - Office',
        sourceType: 'Purchased Electricity',
        fuelSubstanceType: 'Electricity (Grid)',
        emissionFactorId: 'ef-s2-002',
        emissionFactor: 0.82,
        emissionFactorUnit: 'kgCO2e/kWh',
        emissionFactorSource: 'National Grid Average 2024',
        activityDataUnit: 'kWh',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Location-Based Method',
        dataSource: 'Electricity Bills',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Office building electricity consumption',
      },
      {
        id: uuidv4(),
        scope: 2,
        facilityName: 'Distribution Center',
        businessUnit: 'Logistics',
        sourceCategory: 'Purchased Electricity',
        sourceDescription: 'Grid Electricity - Warehouse',
        sourceType: 'Purchased Electricity',
        fuelSubstanceType: 'Electricity (Grid)',
        emissionFactorId: 'ef-s2-003',
        emissionFactor: 0.75,
        emissionFactorUnit: 'kgCO2e/kWh',
        emissionFactorSource: 'Regional Grid Factor',
        activityDataUnit: 'kWh',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Location-Based Method',
        dataSource: 'Electricity Bills',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Warehouse and cold storage electricity',
      },
      {
        id: uuidv4(),
        scope: 2,
        facilityName: 'Main Manufacturing Plant',
        businessUnit: 'Operations',
        sourceCategory: 'Purchased Steam',
        sourceDescription: 'District Steam - Heating',
        sourceType: 'Purchased Heat/Steam',
        fuelSubstanceType: 'Steam',
        emissionFactorId: 'ef-s2-004',
        emissionFactor: 0.067,
        emissionFactorUnit: 'kgCO2e/kWh thermal',
        emissionFactorSource: 'District Heating Provider',
        activityDataUnit: 'kWh thermal',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Location-Based Method',
        dataSource: 'Steam Invoices',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Purchased steam for industrial heating',
      },
    ];

    // 9. Create Scope 3 source templates in localStorage
    const scope3Templates: GHGSourceTemplate[] = [
      {
        id: uuidv4(),
        scope: 3,
        facilityName: 'All Locations',
        businessUnit: 'Human Resources',
        sourceCategory: 'Employee Commuting',
        sourceDescription: 'Employee Commute - Car',
        sourceType: 'Employee Commuting',
        fuelSubstanceType: 'Petrol/Diesel Mix',
        emissionFactorId: 'ef-s3-001',
        emissionFactor: 0.21,
        emissionFactorUnit: 'kgCO2e/km',
        emissionFactorSource: 'DEFRA 2024',
        activityDataUnit: 'km',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Distance-Based Method',
        dataSource: 'Employee Surveys',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Category 7: Employee commuting by private vehicles',
      },
      {
        id: uuidv4(),
        scope: 3,
        facilityName: 'Corporate',
        businessUnit: 'All Departments',
        sourceCategory: 'Business Travel',
        sourceDescription: 'Business Travel - Air (Short Haul)',
        sourceType: 'Business Travel',
        fuelSubstanceType: 'Aviation Fuel',
        emissionFactorId: 'ef-s3-002',
        emissionFactor: 0.255,
        emissionFactorUnit: 'kgCO2e/km',
        emissionFactorSource: 'DEFRA 2024',
        activityDataUnit: 'passenger-km',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Distance-Based Method',
        dataSource: 'Travel Booking System',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Category 6: Short-haul flights (<1500km)',
      },
      {
        id: uuidv4(),
        scope: 3,
        facilityName: 'Corporate',
        businessUnit: 'All Departments',
        sourceCategory: 'Business Travel',
        sourceDescription: 'Business Travel - Air (Long Haul)',
        sourceType: 'Business Travel',
        fuelSubstanceType: 'Aviation Fuel',
        emissionFactorId: 'ef-s3-003',
        emissionFactor: 0.195,
        emissionFactorUnit: 'kgCO2e/km',
        emissionFactorSource: 'DEFRA 2024',
        activityDataUnit: 'passenger-km',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Distance-Based Method',
        dataSource: 'Travel Booking System',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Category 6: Long-haul flights (>1500km)',
      },
      {
        id: uuidv4(),
        scope: 3,
        facilityName: 'Procurement',
        businessUnit: 'Supply Chain',
        sourceCategory: 'Purchased Goods & Services',
        sourceDescription: 'Raw Materials - Steel',
        sourceType: 'Purchased Goods',
        fuelSubstanceType: 'Steel Products',
        emissionFactorId: 'ef-s3-004',
        emissionFactor: 1.85,
        emissionFactorUnit: 'kgCO2e/kg',
        emissionFactorSource: 'Ecoinvent 3.9',
        activityDataUnit: 'tonnes',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Spend-Based Method',
        dataSource: 'Procurement Records',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Category 1: Purchased raw materials',
      },
      {
        id: uuidv4(),
        scope: 3,
        facilityName: 'Distribution Center',
        businessUnit: 'Logistics',
        sourceCategory: 'Upstream Transportation',
        sourceDescription: 'Inbound Freight - Road',
        sourceType: 'Transportation',
        fuelSubstanceType: 'Diesel (Freight)',
        emissionFactorId: 'ef-s3-005',
        emissionFactor: 0.107,
        emissionFactorUnit: 'kgCO2e/tonne-km',
        emissionFactorSource: 'GLEC Framework',
        activityDataUnit: 'tonne-km',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4, N2O',
        calculationMethodology: 'Distance-Based Method',
        dataSource: 'Freight Invoices',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Category 4: Upstream transportation by road',
      },
      {
        id: uuidv4(),
        scope: 3,
        facilityName: 'All Locations',
        businessUnit: 'Operations',
        sourceCategory: 'Waste Generated',
        sourceDescription: 'Waste Disposal - Landfill',
        sourceType: 'Waste',
        fuelSubstanceType: 'Mixed Waste',
        emissionFactorId: 'ef-s3-006',
        emissionFactor: 0.587,
        emissionFactorUnit: 'kgCO2e/kg',
        emissionFactorSource: 'EPA 2024',
        activityDataUnit: 'tonnes',
        measurementFrequency: 'Monthly',
        assignedDataCollectors: [user.id],
        assignedVerifiers: [user.id],
        ghgIncluded: 'CO2, CH4',
        calculationMethodology: 'Waste-Type Method',
        dataSource: 'Waste Management Reports',
        isActive: true,
        createdDate: new Date().toISOString(),
        createdBy: user.email || 'System',
        notes: 'Category 5: Waste sent to landfill',
      },
    ];

    // Store templates in localStorage
    localStorage.setItem('scope1_source_templates', JSON.stringify(scope1Templates));
    localStorage.setItem('scope2_source_templates', JSON.stringify(scope2Templates));
    localStorage.setItem('scope3_source_templates', JSON.stringify(scope3Templates));
    console.log(`Created ${scope1Templates.length} Scope 1, ${scope2Templates.length} Scope 2, ${scope3Templates.length} Scope 3 source templates in localStorage`);

    // Create sample data collections for some templates
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    scope1Templates.slice(0, 3).forEach((template, index) => {
      const sampleData = {
        id: uuidv4(),
        sourceTemplateId: template.id,
        reportingPeriod: `FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
        reportingMonth: currentMonth,
        reportingYear: currentYear,
        activityDataValue: [1500, 250, 3200][index],
        emissionCO2: [3030, 670, 8576][index],
        emissionCH4: [2.5, 0.5, 5.0][index],
        emissionN2O: [0.3, 0.05, 0.6][index],
        totalEmission: [3032.8, 670.55, 8581.6][index],
        dataQuality: 'Medium',
        collectedDate: new Date().toISOString(),
        collectedBy: user.email || 'System',
        verifiedBy: '',
        verificationStatus: 'Pending',
        notes: 'Sample data for testing',
      };
      
      const dataKey = `scope1_data_collections_${template.id}_${currentMonth}_${currentYear}`;
      localStorage.setItem(dataKey, JSON.stringify([sampleData]));
      localStorage.setItem(`scope1_status_${template.id}_${currentMonth}_${currentYear}`, 'Draft');
    });
    console.log('Created sample Scope 1 data collections for first 3 templates');

    console.log('\n✅ Test data seeding complete!');
    console.log(`Created ${createdSources.length} GHG sources with activity data in Supabase.`);
    console.log(`Created ${scope1Templates.length} Scope 1 source templates in localStorage.`);
    console.log('Navigate to /ghg-accounting to see Scope 1 sources.');
    console.log('Navigate to /verifier-approvals to see pending approvals.');
    console.log('Navigate to /verifier-admin to manage verifier settings.');

    return {
      success: true,
      companyId,
      userProfileId,
      sourcesCreated: createdSources.length,
      scope1TemplatesCreated: scope1Templates.length,
    };
  } catch (error: any) {
    console.error('Error seeding test data:', error);
    return { success: false, error: error.message };
  }
}

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).seedTestData = seedTestData;
}
