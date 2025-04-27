
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ESGCapList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ESG Corrective Action Plans</CardTitle>
        <CardDescription>Manage ESG CAP items for enterprises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">CAP Item {i+1}</p>
                <p className="text-sm text-muted-foreground">
                  Enterprise {Math.floor(Math.random() * 5) + 1} • Due: {['2024-06-15', '2024-07-20', '2024-06-30', '2024-08-15', '2024-07-10'][i]}
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

export default ESGCapList;
