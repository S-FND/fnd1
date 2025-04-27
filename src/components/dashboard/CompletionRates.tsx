
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CompletionRates = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Rates</CardTitle>
        <CardDescription>Compliance and training status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>BRSR Compliance</div>
            <div className="font-medium">87%</div>
          </div>
          <Progress value={87} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>ESG Training</div>
            <div className="font-medium">62%</div>
          </div>
          <Progress value={62} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>GHG Reporting</div>
            <div className="font-medium">75%</div>
          </div>
          <Progress value={75} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionRates;
