import { supabase } from '@/integrations/supabase/client';

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
    const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const statuses = ['submitted', 'submitted', 'submitted', 'pending', 'verified'];

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

    console.log('\n✅ Test data seeding complete!');
    console.log(`Created ${createdSources.length} GHG sources with activity data.`);
    console.log('Navigate to /verifier-approvals to see pending approvals.');
    console.log('Navigate to /verifier-admin to manage verifier settings.');

    return {
      success: true,
      companyId,
      userProfileId,
      sourcesCreated: createdSources.length,
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
