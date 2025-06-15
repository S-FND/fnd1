
import React from 'react';
import EmissionsByScope from './summary/EmissionsByScope';
import EmissionsOverTime from './summary/EmissionsOverTime';
import MonthlyEmissionsTrend from './summary/MonthlyEmissionsTrend';
import DataCompleteness from './summary/DataCompleteness';
import { emissionsByScope, emissionsTrend, monthlyEmissionsData, companyInfo, emissionsByLocation, emissionsByActivity } from './summary/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const GHGSummary = () => {
  const totalEmissions = emissionsByScope.reduce((sum, scope) => sum + scope.value, 0);
  
  return (
    <div className="space-y-6">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle>IMR Resources Emissions Overview</CardTitle>
          <CardDescription>
            Total carbon footprint across global operations in {new Date().getFullYear()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Total Carbon Footprint</h3>
              <p className="text-2xl font-bold">{(totalEmissions / 1000).toFixed(1)}k tCO₂e</p>
              <p className="text-xs text-muted-foreground">{emissionsTrend[emissionsTrend.length - 1].year} emissions</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">YoY Change</h3>
              <p className="text-2xl font-bold text-green-600">-1.9%</p>
              <p className="text-xs text-muted-foreground">From {emissionsTrend[emissionsTrend.length - 2].year} to {emissionsTrend[emissionsTrend.length - 1].year}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Emission Intensity</h3>
              <p className="text-2xl font-bold">{(totalEmissions / companyInfo.businessUnits.reduce((sum, unit) => sum + unit.employees, 0)).toFixed(1)} tCO₂e/employee</p>
              <p className="text-xs text-muted-foreground">Across {companyInfo.businessUnits.reduce((sum, unit) => sum + unit.employees, 0)} employees</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmissionsByScope emissionsByScope={emissionsByScope} />
        <EmissionsOverTime emissionsTrend={emissionsTrend} />
      </div>

      <MonthlyEmissionsTrend monthlyData={monthlyEmissionsData} />
      <DataCompleteness completenessData={emissionsByScope} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Location</CardTitle>
            <CardDescription>Carbon footprint by IMR Resources operational location</CardDescription>
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
            <CardDescription>Carbon footprint by IMR Resources business function</CardDescription>
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
    </div>
  );
};
