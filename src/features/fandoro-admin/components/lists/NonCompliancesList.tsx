
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NonCompliancesList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Non-Compliances</CardTitle>
        <CardDescription>Manage non-compliances across enterprises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Non-Compliance {i+1}</p>
                <p className="text-sm text-muted-foreground">
                  Enterprise {Math.floor(Math.random() * 5) + 1} • {['High', 'Medium', 'High', 'Critical', 'Medium'][i]} Severity
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

export default NonCompliancesList;
