
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DeadlinesList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Critical compliance and reporting dates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { title: 'BRSR Annual Report', date: 'June 30, 2024', status: 'Pending' },
            { title: 'EHS Quarterly Audit', date: 'May 15, 2024', status: 'In Progress' },
            { title: 'GHG Inventory Verification', date: 'August 12, 2024', status: 'Not Started' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
              <span className={`text-sm ${
                item.status === 'Pending' ? 'text-amber-500' : 
                item.status === 'In Progress' ? 'text-blue-500' : 
                'text-red-500'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeadlinesList;
