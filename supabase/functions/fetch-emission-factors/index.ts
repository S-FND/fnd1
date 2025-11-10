import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmissionFactor {
  scope: string;
  category: string;
  activity_type: string;
  factor: number;
  unit: string;
  source: string;
  year: number;
  region?: string;
}

/**
 * Fetch emission factors from EPA GHGRP (Greenhouse Gas Reporting Program)
 * This is a simplified example - in production, you'd integrate with actual APIs
 */
const fetchEPAEmissionFactors = async (): Promise<EmissionFactor[]> => {
  // EPA GHGRP API example
  // In production, use: https://data.epa.gov/efservice/
  
  // Mock data representing EPA factors
  const epaFactors: EmissionFactor[] = [
    {
      scope: 'Scope1',
      category: 'Stationary Combustion',
      activity_type: 'Natural Gas',
      factor: 0.0531,
      unit: 'kg CO2e/kWh',
      source: 'EPA GHGRP',
      year: 2024,
      region: 'US',
    },
    {
      scope: 'Scope1',
      category: 'Mobile Combustion',
      activity_type: 'Gasoline',
      factor: 8.89,
      unit: 'kg CO2e/gallon',
      source: 'EPA GHGRP',
      year: 2024,
      region: 'US',
    },
    {
      scope: 'Scope2',
      category: 'Purchased Electricity',
      activity_type: 'Grid Electricity',
      factor: 0.385,
      unit: 'kg CO2e/kWh',
      source: 'EPA eGRID',
      year: 2024,
      region: 'US',
    },
  ];

  return epaFactors;
};

/**
 * Fetch emission factors from DEFRA (UK)
 * UK Government GHG Conversion Factors
 */
const fetchDEFRAEmissionFactors = async (): Promise<EmissionFactor[]> => {
  // DEFRA API example
  // In production, use: https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors
  
  const defraFactors: EmissionFactor[] = [
    {
      scope: 'Scope1',
      category: 'Stationary Combustion',
      activity_type: 'Natural Gas',
      factor: 0.18316,
      unit: 'kg CO2e/kWh',
      source: 'DEFRA 2024',
      year: 2024,
      region: 'UK',
    },
    {
      scope: 'Scope1',
      category: 'Mobile Combustion',
      activity_type: 'Petrol',
      factor: 2.31,
      unit: 'kg CO2e/litre',
      source: 'DEFRA 2024',
      year: 2024,
      region: 'UK',
    },
    {
      scope: 'Scope2',
      category: 'Purchased Electricity',
      activity_type: 'Grid Electricity',
      factor: 0.23314,
      unit: 'kg CO2e/kWh',
      source: 'DEFRA 2024',
      year: 2024,
      region: 'UK',
    },
  ];

  return defraFactors;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source, scope, category, region } = await req.json();

    console.log('Fetching emission factors:', { source, scope, category, region });

    let factors: EmissionFactor[] = [];

    // Fetch from specified source
    switch (source?.toLowerCase()) {
      case 'epa':
        factors = await fetchEPAEmissionFactors();
        break;
      case 'defra':
        factors = await fetchDEFRAEmissionFactors();
        break;
      case 'all':
      default:
        // Fetch from all sources
        const [epaFactors, defraFactors] = await Promise.all([
          fetchEPAEmissionFactors(),
          fetchDEFRAEmissionFactors(),
        ]);
        factors = [...epaFactors, ...defraFactors];
        break;
    }

    // Filter by scope if provided
    if (scope) {
      factors = factors.filter(f => f.scope === scope);
    }

    // Filter by category if provided
    if (category) {
      factors = factors.filter(f => f.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Filter by region if provided
    if (region) {
      factors = factors.filter(f => !f.region || f.region === region);
    }

    console.log(`Found ${factors.length} emission factors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: factors,
        count: factors.length,
        timestamp: new Date().toISOString(),
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching emission factors:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
