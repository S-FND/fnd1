import { supabase } from '@/integrations/supabase/client';

/**
 * Seeds test data for the approval workflow.
 * Run this function from the browser console or a button click.
 */
export async function seedTestData() {
  try {
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Must be authenticated to seed test data');
    }

    console.log('Seeding test data for user:', user.email);

    // 1. Check if portfolio company exists, create if not
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
      // Note: This may fail due to RLS - admin needs to create company
      console.log('No company found. Please create a portfolio company manually or via admin.');
      throw new Error('No portfolio company exists. Admin must create one first.');
    }

    // 2. Check if user profile exists, create if not
    let userProfileId: string;
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingProfile) {
      userProfileId = existingProfile.user_id;
      console.log('Using existing profile:', userProfileId);
    } else {
      // Create user profile
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || 'Test User',
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

    // 3. Set up user as verifier in user_roles
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
      // Update to be a verifier
      await supabase
        .from('user_roles')
        .update({ can_approve_actions: true })
        .eq('user_id', user.id);
      console.log('Updated user_role with verifier permissions');
    }

    // 4. Create a GHG source with the user as verifier
    const { data: existingSource } = await supabase
      .from('ghg_sources')
      .select('id')
      .eq('portfolio_company_id', companyId)
      .limit(1)
      .maybeSingle();

    let sourceId: string;
    if (existingSource) {
      sourceId = existingSource.id;
      // Update to assign current user as verifier
      await supabase
        .from('ghg_sources')
        .update({ assigned_verifiers: [user.id] })
        .eq('id', sourceId);
      console.log('Updated existing source with verifier:', sourceId);
    } else {
      const { data: newSource, error: sourceError } = await supabase
        .from('ghg_sources')
        .insert({
          portfolio_company_id: companyId,
          source_name: 'Test Diesel Generator',
          source_type: 'Stationary Combustion',
          scope: 'Scope 1',
          category: 'Stationary Combustion',
          description: 'Test diesel generator for approval workflow',
          activity_unit: 'liters',
          measurement_frequency: 'Monthly',
          emission_factor: 2.68,
          emission_factor_source: 'IPCC 2006',
          emission_factor_unit: 'kgCO2e/liter',
          assigned_data_collectors: [user.id],
          assigned_verifiers: [user.id],
          is_active: true,
          reporting_period: 'FY 2024-25',
          created_by: user.id,
        })
        .select()
        .single();

      if (sourceError) throw sourceError;
      sourceId = newSource.id;
      console.log('Created GHG source:', sourceId);
    }

    // 5. Create submitted activity data for testing approvals
    const periodsToCreate = ['Apr', 'May', 'Jun'];
    
    for (const periodName of periodsToCreate) {
      const activityValue = Math.floor(Math.random() * 500) + 100;
      const emissions = activityValue * 2.68;

      const { error: dataError } = await supabase
        .from('ghg_activity_data')
        .upsert({
          source_id: sourceId,
          portfolio_company_id: companyId,
          reporting_period: 'FY 2024-25',
          period_name: periodName,
          activity_value: activityValue,
          activity_unit: 'liters',
          emission_factor: 2.68,
          emission_factor_source: 'IPCC 2006',
          calculated_emissions: emissions,
          data_collection_date: new Date().toISOString().split('T')[0],
          collected_by: user.id,
          status: 'submitted', // Ready for verification
          created_by: user.id,
          notes: `Test data for ${periodName}`,
        }, { onConflict: 'source_id,reporting_period,period_name' });

      if (dataError) {
        console.warn(`Could not create data for ${periodName}:`, dataError.message);
      } else {
        console.log(`Created/updated activity data for ${periodName}`);
      }
    }

    console.log('Test data seeding complete!');
    return {
      success: true,
      companyId,
      userProfileId,
      sourceId,
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
