import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

export const EmissionFactorUpdater: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>('all');
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchEmissionFactors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-emission-factors', {
        body: { source, scope: null, category: null, region: 'US' },
      });

      if (error) throw error;

      if (data.success) {
        setFactors(data.data);
        setLastUpdate(data.timestamp);
        toast({
          title: "Emission Factors Updated",
          description: `Successfully fetched ${data.count} emission factors from ${source.toUpperCase()}.`,
        });
      } else {
        throw new Error(data.error || 'Failed to fetch emission factors');
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFactorsToSources = async () => {
    if (factors.length === 0) {
      toast({
        title: "No Factors Available",
        description: "Fetch emission factors first before applying to sources.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's portfolio company
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('portfolio_company_id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Fetch all sources
      const { data: sources, error: sourcesError } = await supabase
        .from('ghg_sources')
        .select('id, scope, category, source_type, activity_unit')
        .eq('portfolio_company_id', profile.portfolio_company_id)
        .eq('is_active', true);

      if (sourcesError) throw sourcesError;

      let updatedCount = 0;
      const updates = [];

      // Match sources with emission factors
      for (const source of sources || []) {
        const matchingFactor = factors.find(f => 
          f.scope === source.scope && 
          f.category.toLowerCase().includes(source.category.toLowerCase())
        );

        if (matchingFactor) {
          updates.push({
            id: source.id,
            emission_factor: matchingFactor.factor,
            emission_factor_source: `${matchingFactor.source} ${matchingFactor.year}`,
            emission_factor_unit: matchingFactor.unit,
          });
          updatedCount++;
        }
      }

      // Apply updates
      for (const update of updates) {
        const { error } = await supabase
          .from('ghg_sources')
          .update({
            emission_factor: update.emission_factor,
            emission_factor_source: update.emission_factor_source,
            emission_factor_unit: update.emission_factor_unit,
          })
          .eq('id', update.id);

        if (error) {
          console.error('Error updating source:', error);
        }
      }

      toast({
        title: "Factors Applied",
        description: `Updated ${updatedCount} sources with latest emission factors.`,
      });
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Emission Factor Updates
        </CardTitle>
        <CardDescription>
          Fetch and apply latest emission factors from EPA and DEFRA databases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Emission factors are periodically updated by regulatory agencies. Regular updates ensure accurate emissions calculations.
          </AlertDescription>
        </Alert>

        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Data Source</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="epa">EPA (USA)</SelectItem>
                <SelectItem value="defra">DEFRA (UK)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={fetchEmissionFactors}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            {loading ? 'Fetching...' : 'Fetch Factors'}
          </Button>
        </div>

        {lastUpdate && (
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(lastUpdate).toLocaleString()}
          </div>
        )}

        {factors.length > 0 && (
          <>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Available Emission Factors ({factors.length})</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {factors.slice(0, 10).map((factor, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{factor.activity_type}</div>
                        <div className="text-xs text-muted-foreground">
                          {factor.scope} • {factor.category}
                        </div>
                      </div>
                      <Badge variant="outline">{factor.source}</Badge>
                    </div>
                    <div className="mt-2 text-xs">
                      <span className="font-semibold">{factor.factor}</span> {factor.unit}
                    </div>
                  </div>
                ))}
                {factors.length > 10 && (
                  <div className="text-xs text-muted-foreground text-center">
                    + {factors.length - 10} more factors
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={applyFactorsToSources}
              disabled={loading}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Apply to Sources
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
