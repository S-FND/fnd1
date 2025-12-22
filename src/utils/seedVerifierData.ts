import { supabase } from '@/integrations/supabase/client';

/**
 * Seeds test data for the verifier approvals workflow.
 * Run this function from the browser console: seedVerifierData()
 */
export async function seedVerifierData() {
  try {
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Must be authenticated to seed test data. Please log in first.');
    }

    console.log('🚀 Seeding verifier data for user:', user.email);

    // 1. Check/Create portfolio company
    let companyId: string;
    const { data: existingCompany } = await supabase
      .from('portfolio_companies')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existingCompany) {
      companyId = existingCompany.id;
      console.log('✅ Using existing company:', companyId);
    } else {
      console.log('❌ No portfolio company found. Please create one first.');
      throw new Error('No portfolio company exists.');
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
      console.log('✅ Using existing profile:', userProfileId);
      
      // Update to correct company if needed
      if (existingProfile.portfolio_company_id !== companyId) {
        await supabase
          .from('user_profiles')
          .update({ portfolio_company_id: companyId })
          .eq('user_id', user.id);
        console.log('✅ Updated profile company to:', companyId);
      }
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
      console.log('✅ Created user profile:', userProfileId);
    }

    // 3. Set up user role with VERIFIER permissions
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
        console.warn('⚠️ Could not create user_role:', roleError.message);
      } else {
        console.log('✅ Created user_role with verifier permissions');
      }
    } else {
      await supabase
        .from('user_roles')
        .update({ can_approve_actions: true })
        .eq('user_id', user.id);
      console.log('✅ Updated user_role with verifier permissions');
    }

    // 4. Create GHG sources for all scopes (including Scope 4)
    const scopeSources = [
      { scope: 'Scope 1', source_name: 'Diesel Generator - Main', source_type: 'Stationary Combustion', category: 'Stationary Combustion', activity_unit: 'liters', emission_factor: 2.68 },
      { scope: 'Scope 1', source_name: 'Company Fleet Vehicles', source_type: 'Mobile Combustion', category: 'Mobile Combustion', activity_unit: 'liters', emission_factor: 2.31 },
      { scope: 'Scope 2', source_name: 'Grid Electricity - Factory', source_type: 'Purchased Electricity', category: 'Purchased Electricity', activity_unit: 'kWh', emission_factor: 0.82 },
      { scope: 'Scope 2', source_name: 'Grid Electricity - Office', source_type: 'Purchased Electricity', category: 'Purchased Electricity', activity_unit: 'kWh', emission_factor: 0.82 },
      { scope: 'Scope 3', source_name: 'Employee Commuting', source_type: 'Employee Commuting', category: 'Employee Commuting', activity_unit: 'km', emission_factor: 0.21 },
      { scope: 'Scope 3', source_name: 'Business Travel - Air', source_type: 'Business Travel', category: 'Business Travel', activity_unit: 'km', emission_factor: 0.255 },
      { scope: 'Scope 4', source_name: 'Avoided Emissions - Solar', source_type: 'Avoided Emissions', category: 'Renewable Energy', activity_unit: 'kWh', emission_factor: -0.82 },
    ];

    const createdSources: { id: string; scope: string; source_name: string; emission_factor: number; activity_unit: string }[] = [];

    for (const sourceData of scopeSources) {
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
      } else {
        const { data: newSource, error: sourceError } = await supabase
          .from('ghg_sources')
          .insert({
            portfolio_company_id: companyId,
            source_name: sourceData.source_name,
            source_type: sourceData.source_type,
            scope: sourceData.scope,
            category: sourceData.category,
            description: `Test ${sourceData.source_name}`,
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

        if (!sourceError && newSource) {
          createdSources.push({ 
            id: newSource.id, 
            scope: sourceData.scope, 
            source_name: sourceData.source_name,
            emission_factor: sourceData.emission_factor,
            activity_unit: sourceData.activity_unit
          });
        }
      }
    }
    console.log('✅ Created/updated', createdSources.length, 'GHG sources');

    // 5. Create GHG activity data with 'submitted' status for verification
    const priorities = ['low', 'medium', 'high', 'critical'];
    
    for (const source of createdSources) {
      const periods = ['Jan 2024', 'Feb 2024', 'Mar 2024'];
      for (let i = 0; i < periods.length; i++) {
        const activityValue = Math.floor(Math.random() * 500) + 100;
        const emissions = activityValue * Math.abs(source.emission_factor);

        await supabase
          .from('ghg_activity_data')
          .upsert({
            source_id: source.id,
            portfolio_company_id: companyId,
            reporting_period: 'FY 2024-25',
            period_name: periods[i],
            activity_value: activityValue,
            activity_unit: source.activity_unit,
            emission_factor: source.emission_factor,
            emission_factor_source: 'IPCC 2006',
            calculated_emissions: emissions,
            data_collection_date: new Date().toISOString().split('T')[0],
            collected_by: user.id,
            status: 'submitted',
            created_by: user.id,
            notes: `${source.scope} data for ${source.source_name} - ${periods[i]}`,
          }, { onConflict: 'source_id,reporting_period,period_name' });
      }
    }
    console.log('✅ Created GHG activity data for verification');

    // 6. Create approval requests for ESG Metrics module
    const esgMetricsApprovals = [
      { title: 'Energy Consumption Update', summary: 'Updated total energy consumption from 45,000 to 48,500 GJ', priority: 'high' },
      { title: 'Water Usage Metrics', summary: 'Q3 water consumption data added - 125,000 m³', priority: 'medium' },
      { title: 'Waste Generation Data', summary: 'Annual waste data revised with recycling breakdown', priority: 'low' },
      { title: 'GHG Intensity Ratio', summary: 'Carbon intensity metric recalculated per revenue', priority: 'critical' },
    ];

    for (const item of esgMetricsApprovals) {
      await supabase.from('approval_requests').insert({
        module: 'esg_metrics' as const,
        record_id: crypto.randomUUID(),
        record_type: item.title,
        status: 'pending_review' as const,
        priority: item.priority as 'low' | 'medium' | 'high' | 'critical',
        maker_id: user.id,
        assigned_checker_id: user.id,
        current_data: { metric: item.title, value: Math.random() * 1000 },
        change_summary: item.summary,
        portfolio_company_id: companyId,
        submitted_at: new Date().toISOString(),
        due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    console.log('✅ Created ESG Metrics approval requests');

    // 7. Create approval requests for ESG DD module
    const esgDDApprovals = [
      { title: 'Supplier Risk Assessment', summary: 'New supplier due diligence completed - High risk identified', priority: 'critical' },
      { title: 'Environmental Compliance Review', summary: 'Annual compliance audit findings submitted', priority: 'high' },
      { title: 'Social Impact Assessment', summary: 'Community impact study for new facility', priority: 'medium' },
    ];

    for (const item of esgDDApprovals) {
      await supabase.from('approval_requests').insert({
        module: 'esg_dd' as const,
        record_id: crypto.randomUUID(),
        record_type: item.title,
        status: 'pending_review' as const,
        priority: item.priority as 'low' | 'medium' | 'high' | 'critical',
        maker_id: user.id,
        assigned_checker_id: user.id,
        current_data: { assessment: item.title, score: Math.random() * 100 },
        change_summary: item.summary,
        portfolio_company_id: companyId,
        submitted_at: new Date().toISOString(),
        due_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    console.log('✅ Created ESG DD approval requests');

    // 8. Create approval requests for GHG Accounting module (via approval_requests)
    const ghgApprovals = [
      { title: 'Scope 1 - Fleet Emissions Revision', summary: 'Vehicle fleet emissions recalculated with new emission factors', priority: 'high', scope: 'Scope 1' },
      { title: 'Scope 2 - Market-Based Update', summary: 'Switched to market-based accounting for electricity', priority: 'medium', scope: 'Scope 2' },
      { title: 'Scope 3 - Supply Chain Data', summary: 'Added upstream transportation emissions', priority: 'critical', scope: 'Scope 3' },
    ];

    for (const item of ghgApprovals) {
      await supabase.from('approval_requests').insert({
        module: 'ghg_accounting' as const,
        record_id: crypto.randomUUID(),
        record_type: item.title,
        status: 'pending_review' as const,
        priority: item.priority as 'low' | 'medium' | 'high' | 'critical',
        maker_id: user.id,
        assigned_checker_id: user.id,
        current_data: { scope: item.scope, description: item.title },
        change_summary: item.summary,
        portfolio_company_id: companyId,
        submitted_at: new Date().toISOString(),
        due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    console.log('✅ Created GHG Accounting approval requests');

    // 9. Create ESMS documents for verification (these will show as ESMS module)
    const esmsDocuments = [
      { title: 'Environmental Policy Document', section: 'policy', priority: 'high' },
      { title: 'Safety Procedures Manual', section: 'procedures', priority: 'medium' },
      { title: 'Emergency Response Plan', section: 'emergency', priority: 'critical' },
      { title: 'Training Records - Q4', section: 'training', priority: 'low' },
    ];

    for (const doc of esmsDocuments) {
      const { data: existing } = await supabase
        .from('esms_documents')
        .select('id')
        .eq('user_id', user.id)
        .eq('title', doc.title)
        .maybeSingle();

      if (!existing) {
        await supabase.from('esms_documents').insert({
          user_id: user.id,
          portfolio_company_id: companyId,
          section_id: doc.section,
          document_id: crypto.randomUUID(),
          title: doc.title,
          is_uploaded: true,
          is_not_applicable: false,
          file_name: `${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        });
      }
    }
    console.log('✅ Created ESMS documents for verification');

    console.log('');
    console.log('🎉 SUCCESS! Verifier data seeded successfully.');
    console.log('📋 Summary:');
    console.log('   - User has verifier permissions (can_approve_actions: true)');
    console.log('   - GHG sources created for Scope 1, 2, 3, 4');
    console.log('   - GHG activity data created with "submitted" status');
    console.log('   - ESG Metrics approval requests created');
    console.log('   - ESG DD approval requests created');
    console.log('   - GHG Accounting approval requests created');
    console.log('   - ESMS documents created for verification');
    console.log('');
    console.log('🔄 Refresh the /verifier-approvals page to see the data.');

    return { success: true };
  } catch (error: any) {
    console.error('❌ Error seeding verifier data:', error.message);
    throw error;
  }
}

// Make available globally in browser console
try {
  if (typeof window !== 'undefined') {
    (window as any).seedVerifierData = seedVerifierData;
    console.log('✅ seedVerifierData() is now available in the console. Type seedVerifierData() to run it.');
  }
} catch (e) {
  console.error('Failed to register seedVerifierData:', e);
}
