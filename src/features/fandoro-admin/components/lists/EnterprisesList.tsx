
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EnterprisesList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Enterprises</CardTitle>
        <CardDescription>All registered enterprise clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Enterprise {i+1}</p>
                <p className="text-sm text-muted-foreground">
                  {['Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Finance'][i]} Sector • {['200', '450', '120', '380', '275'][i]} Users
                </p>
              </div>
              <button className="text-sm text-primary hover:underline">View Details</button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterprisesList;
