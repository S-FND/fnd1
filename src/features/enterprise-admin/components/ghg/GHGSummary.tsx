import React, { useState, useEffect } from 'react';
import EmissionsByScope from './summary/EmissionsByScope';
import EmissionsOverTime from './summary/EmissionsOverTime';
import MonthlyEmissionsTrend from './summary/MonthlyEmissionsTrend';
import DataCompleteness from './summary/DataCompleteness';
import { emissionsTrend, monthlyEmissionsData, companyInfo, emissionsByLocation, emissionsByActivity } from './summary/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scope1Entry } from '@/types/scope1-ghg';
import { Scope2Entry } from '@/types/scope2-ghg';
import { Scope3Entry } from '@/types/scope3-ghg';
import { Scope4Entry } from '@/types/scope4-ghg';
import { toast } from 'sonner';
import { httpClient } from '@/lib/httpClient';
import { logger } from '@/hooks/logger';

interface EmissionsByScope {
  scope: string;
  value: number;
  percentage: number;
  color: string;
}

interface CompletenessItem {
  scope: string;
  completeness: number;
  statusColor: string;
}

export interface EmissionSummary {
  totalEmission: number;
  avoidedEmission: number;
  emissionByScope: {
    'Scope 1': number;
    'Scope 2': number;
    'Scope 3': number;
    'Scope 4': number;
  };
}


export const GHGSummary = () => {
  const [emissionsByScope, setEmissionsByScope] = useState<EmissionsByScope[]>([]);
  const [completenessData, setCompletenessData] = useState<CompletenessItem[]>([]);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [scope4AvoidedEmissions, setScope4AvoidedEmissions] = useState(0);
  const [ghgSummary,setGhgSummary]=useState<EmissionSummary>(null)

  useEffect(() => {
    // Load data from localStorage for all scopes
    const scope1Data: Scope1Entry[] = JSON.parse(localStorage.getItem('scope1Entries') || '[]');
    const scope2Data: Scope2Entry[] = JSON.parse(localStorage.getItem('scope2Entries') || '[]');
    const scope3Data: Scope3Entry[] = JSON.parse(localStorage.getItem('scope3Entries') || '[]');
    const scope4Data: Scope4Entry[] = JSON.parse(localStorage.getItem('scope4Entries') || '[]');

    // Calculate totals for each scope
    const scope1Total = scope1Data.reduce((sum, entry) => sum + entry.totalEmission, 0);
    const scope2Total = scope2Data.reduce((sum, entry) => sum + entry.totalEmission, 0);
    const scope3Total = scope3Data.reduce((sum, entry) => sum + entry.totalEmission, 0);
    const scope4Total = scope4Data.reduce((sum, entry) => sum + entry.totalAvoidedEmission, 0);

    const total = scope1Total + scope2Total + scope3Total;
    setTotalEmissions(total);
    setScope4AvoidedEmissions(scope4Total);

    // Calculate percentages
    const scopes: EmissionsByScope[] = [
      {
        scope: 'Scope 1',
        value: scope1Total,
        percentage: total > 0 ? (scope1Total / total) * 100 : 0,
        color: '#8B5CF6'
      },
      {
        scope: 'Scope 2',
        value: scope2Total,
        percentage: total > 0 ? (scope2Total / total) * 100 : 0,
        color: '#EC4899'
      },
      {
        scope: 'Scope 3',
        value: scope3Total,
        percentage: total > 0 ? (scope3Total / total) * 100 : 0,
        color: '#F59E0B'
      }
    ];

    setEmissionsByScope(scopes);

    // Calculate data completeness for each scope
    const completeness: CompletenessItem[] = [
      {
        scope: 'Scope 1',
        completeness: scope1Data.length > 0 ? 100 : 0,
        statusColor: scope1Data.length > 0 ? 'bg-green-500' : 'bg-gray-300'
      },
      {
        scope: 'Scope 2',
        completeness: scope2Data.length > 0 ? 100 : 0,
        statusColor: scope2Data.length > 0 ? 'bg-green-500' : 'bg-gray-300'
      },
      {
        scope: 'Scope 3',
        completeness: scope3Data.length > 0 ? 100 : 0,
        statusColor: scope3Data.length > 0 ? 'bg-green-500' : 'bg-gray-300'
      },
      {
        scope: 'Scope 4',
        completeness: scope4Data.length > 0 ? 100 : 0,
        statusColor: scope4Data.length > 0 ? 'bg-green-500' : 'bg-gray-300'
      }
    ];

    setCompletenessData(completeness);
  }, []);

  const netEmissions = totalEmissions - scope4AvoidedEmissions;

  let getSummaryDetails= async()=>{
    try {
      let summaryResponse=await httpClient.get('ghg-accounting/summary');
      logger.log(`summaryResponse`,summaryResponse)
      if(summaryResponse['status'] == 200){
        setGhgSummary(summaryResponse['data']['emmissonData'])
      }
    } catch (error) {
      toast(error.message)
    }
  }

  useEffect(()=>{
    getSummaryDetails()
  },[])

  // useEffect(()=>{
  //   setEmissionsByScope(emissionsByScope.map((emmission)=>{
  //     if(Object.keys(ghgSummary.emissionByScope).includes(emmission.scope)){
  //       return {...emmission,value:ghgSummary.emissionByScope[emmission.scope],percentage:(ghgSummary.emissionByScope[emmission.scope]/ghgSummary.totalEmission)*100}
  //     }
  //     else{
  //       return emmission
  //     }
  //   }))
  // },[ghgSummary])
  
  return (
    <div className="space-y-6">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle>GHG Emissions Overview</CardTitle>
          <CardDescription>
            Total carbon footprint across operations in {new Date().getFullYear()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Total Emissions</h3>
              <p className="text-2xl font-bold">{ghgSummary?.totalEmission.toFixed(2)} tCO₂e</p>
              <p className="text-xs text-muted-foreground">Scope 1, 2 & 3</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Avoided Emissions</h3>
              <p className="text-2xl font-bold text-green-600">-{ghgSummary?.avoidedEmission.toFixed(2)} tCO₂e</p>
              <p className="text-xs text-muted-foreground">Scope 4 reductions</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Net Emissions</h3>
              <p className="text-2xl font-bold text-primary">{(ghgSummary?.totalEmission-ghgSummary?.avoidedEmission).toFixed(2)} tCO₂e</p>
              <p className="text-xs text-muted-foreground">After avoided emissions</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Emission Intensity</h3>
              <p className="text-2xl font-bold">
                {companyInfo.businessUnits.reduce((sum, unit) => sum + unit.employees, 0) > 0
                  ? (totalEmissions / companyInfo.businessUnits.reduce((sum, unit) => sum + unit.employees, 0)).toFixed(2)
                  : '0.00'} 
              </p>
              <p className="text-xs text-muted-foreground">tCO₂e/employee</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* {ghgSummary?.emissionByScope && <EmissionsByScope emissionsByScope={emissionsByScope} scopeByData={ghgSummary?.emissionByScope} />} */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions Breakdown</CardTitle>
            <CardDescription>Carbon footprint by scope</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emissionsByScope.map((scope, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-28 min-w-[112px] mr-4">
                    <p className="text-sm font-medium">{scope.scope}</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-2.5"
                        style={{ 
                          width: `${scope.percentage}%`,
                          backgroundColor: scope.color
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{ghgSummary?.emissionByScope[scope.scope].toFixed(2)} tCO₂e</span>
                      <span className="text-muted-foreground">{((ghgSummary?.emissionByScope[scope.scope]/ghgSummary.totalEmission)*100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              ))}
              {scope4AvoidedEmissions > 0 && (
                <div className="flex items-center border-t pt-4">
                  <div className="w-28 min-w-[112px] mr-4">
                    <p className="text-sm font-medium text-green-600">Scope 4</p>
                    <p className="text-xs text-muted-foreground">Avoided</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-2.5 bg-green-600"
                        style={{ 
                          width: `${totalEmissions > 0 ? (scope4AvoidedEmissions / totalEmissions) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-green-600">-{scope4AvoidedEmissions.toFixed(2)} tCO₂e</span>
                      <span className="text-muted-foreground">
                        {totalEmissions > 0 ? ((scope4AvoidedEmissions / totalEmissions) * 100).toFixed(1) : '0'}% reduction
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <MonthlyEmissionsTrend monthlyData={monthlyEmissionsData} />
      
      {completenessData.length > 0 && (
        <DataCompleteness completenessData={completenessData} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Location</CardTitle>
            <CardDescription>Carbon footprint by operational location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emissionsByLocation.map((location, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-40 min-w-[160px] mr-4">
                    <p className="text-sm font-medium">{location.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {location.employees} employees
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-2.5 bg-primary"
                        style={{ width: `${(location.total / emissionsByLocation[0].total) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{(location.total / 1000).toFixed(1)}k tCO₂e</span>
                      <span className="text-muted-foreground">
                        {location.intensity.toFixed(1)} tCO₂e/employee
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emissions by Business Activity</CardTitle>
            <CardDescription>Carbon footprint by business function</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emissionsByActivity.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-40 min-w-[160px] mr-4">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.percentage}% of total
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-2.5 bg-primary"
                        style={{ width: `${(activity.value / emissionsByActivity[0].value) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{(activity.value / 1000).toFixed(1)}k tCO₂e</span>
                      <span className="text-muted-foreground">{activity.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {totalEmissions === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">No emission data available</p>
            <p className="text-sm text-muted-foreground">
              Start by adding entries in Scope 1, 2, 3, or 4 tabs to see your emissions summary
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};