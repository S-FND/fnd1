
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ESGRisksList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All ESG Risks</CardTitle>
        <CardDescription>Manage ESG risks across enterprises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">ESG Risk {i+1}</p>
                <p className="text-sm text-muted-foreground">
                  Enterprise {Math.floor(Math.random() * 5) + 1} • {['Environmental', 'Social', 'Governance', 'Environmental', 'Social'][i]} Category
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-blue-600 hover:underline">Edit</button>
                <button className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ESGRisksList;
