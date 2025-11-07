import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, Circle, AlertCircle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GHGSource, DataCollectionSchedule, generatePeriodNames } from '@/types/ghg-data-collection';
import DataCollectionDialog from './DataCollectionDialog';

export const DataCollectionScheduleView: React.FC = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<DataCollectionSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<GHGSource | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, [selectedScope]);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Load sources
      let query = supabase
        .from('ghg_sources')
        .select('*')
        .eq('is_active', true)
        .order('source_name');

      if (selectedScope !== 'all') {
        query = query.eq('scope', selectedScope);
      }

      const { data: sources, error: sourcesError } = await query;
      if (sourcesError) throw sourcesError;

      if (!sources || sources.length === 0) {
        setSchedules([]);
        setLoading(false);
        return;
      }

      // Load activity data for all sources
      const { data: activityData, error: dataError } = await supabase
        .from('ghg_activity_data')
        .select('source_id, period_name, status, activity_value, id')
        .in('source_id', sources.map(s => s.id));

      if (dataError) throw dataError;

      // Create data map for quick lookup
      const dataMap = new Map<string, Map<string, any>>();
      activityData?.forEach(item => {
        if (!dataMap.has(item.source_id)) {
          dataMap.set(item.source_id, new Map());
        }
        dataMap.get(item.source_id)?.set(item.period_name, item);
      });

      // Build schedules
      const scheduleList: DataCollectionSchedule[] = sources.map(source => {
        const periods = generatePeriodNames(source.measurement_frequency as any);
        const sourceData = dataMap.get(source.id);

        const periodStatus = periods.map(periodName => {
          const data = sourceData?.get(periodName);
          return {
            period_name: periodName,
            status: data?.status || 'pending',
            activity_value: data?.activity_value,
            data_entry_id: data?.id,
            is_due: !data || data.status === 'pending',
          };
        });

        const completed = periodStatus.filter(p => p.status === 'submitted' || p.status === 'verified' || p.status === 'approved').length;
        const completion_percentage = (completed / periods.length) * 100;

        return {
          source: source as GHGSource,
          periods: periodStatus,
          completion_percentage,
        };
      });

      setSchedules(scheduleList);
    } catch (error: any) {
      toast({
        title: "Error Loading Schedule",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDataCollection = (source: GHGSource) => {
    setSelectedSource(source);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'verified':
        return 'bg-blue-500';
      case 'submitted':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'submitted':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading schedule...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Data Collection Schedule
              </CardTitle>
              <CardDescription>
                Track and manage period-wise data collection for all emission sources
              </CardDescription>
            </div>
            <Select value={selectedScope} onValueChange={setSelectedScope}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="Scope1">Scope 1</SelectItem>
                <SelectItem value="Scope2">Scope 2</SelectItem>
                <SelectItem value="Scope3">Scope 3</SelectItem>
                <SelectItem value="Scope4">Scope 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No active emission sources found.</p>
              <p className="text-sm">Create emission sources to start data collection.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {schedules.map(schedule => (
                <Card key={schedule.source.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Source Header */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{schedule.source.source_name}</h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">{schedule.source.scope}</Badge>
                            <Badge variant="secondary">{schedule.source.category}</Badge>
                            <Badge variant="outline">{schedule.source.measurement_frequency}</Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleOpenDataCollection(schedule.source)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Enter Data
                        </Button>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completion Status</span>
                          <span className="font-medium">
                            {schedule.periods.filter(p => p.status !== 'pending').length} / {schedule.periods.length} periods
                          </span>
                        </div>
                        <Progress value={schedule.completion_percentage} className="h-2" />
                      </div>

                      {/* Period Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {schedule.periods.map((period, index) => (
                          <div
                            key={index}
                            className={`
                              p-3 rounded-lg border-2 text-center space-y-1 transition-colors
                              ${period.status !== 'pending' ? 'border-primary bg-primary/5' : 'border-gray-200'}
                            `}
                          >
                            <div className="flex items-center justify-center">
                              {getStatusIcon(period.status)}
                            </div>
                            <div className="text-xs font-medium">{period.period_name}</div>
                            {period.activity_value !== undefined && (
                              <div className="text-xs text-muted-foreground">
                                {period.activity_value.toFixed(1)} {schedule.source.activity_unit}
                              </div>
                            )}
                            <div className={`text-xs font-medium capitalize ${getStatusColor(period.status).replace('bg-', 'text-')}`}>
                              {period.status}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="flex gap-4 text-sm pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-muted-foreground">
                            Approved/Verified: {schedule.periods.filter(p => p.status === 'approved' || p.status === 'verified').length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <span className="text-muted-foreground">
                            Submitted: {schedule.periods.filter(p => p.status === 'submitted').length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-300" />
                          <span className="text-muted-foreground">
                            Pending: {schedule.periods.filter(p => p.status === 'pending').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DataCollectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        source={selectedSource}
        onSuccess={loadSchedules}
      />
    </>
  );
};

export default DataCollectionScheduleView;
