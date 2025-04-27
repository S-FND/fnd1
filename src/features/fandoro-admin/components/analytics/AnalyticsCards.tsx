
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, FileCheck } from 'lucide-react';

const analyticsCards = [
  {
    title: "Total Enterprises",
    value: "28",
    description: "Registered enterprise clients",
    change: 12,
    icon: Building,
    color: "text-blue-500",
  },
  {
    title: "Total Users",
    value: "4,320",
    description: "Active users across enterprises",
    change: 8,
    icon: Users,
    color: "text-green-500",
  },
  {
    title: "Compliance Rate",
    value: "74%",
    description: "Average compliance rate",
    change: -3,
    icon: FileCheck,
    color: "text-amber-500",
  },
];

const AnalyticsCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {analyticsCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
            <div className="mt-2 flex items-center gap-1">
              {card.change > 0 ? (
                <span className="text-xs text-green-500">+{card.change}%</span>
              ) : (
                <span className="text-xs text-red-500">{card.change}%</span>
              )}
              <span className="text-xs text-muted-foreground">from previous quarter</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsCards;
