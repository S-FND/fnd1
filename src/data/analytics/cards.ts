
import { BarChart, LineChart, PieChart } from "lucide-react";
import { type FC } from 'react';

export interface AnalyticsCard {
  title: string;
  value: string | number;
  change: number;
  icon: FC;
  description: string;
  color: string;
}

export const analyticsCards: AnalyticsCard[] = [
  { 
    title: "ESG Score", 
    value: "78/100", 
    change: 5.2, 
    icon: BarChart, 
    description: "Overall ESG performance", 
    color: "bg-green-50 text-green-700" 
  },
  { 
    title: "Carbon Footprint", 
    value: "11,200 tCO2e", 
    change: -8.4, 
    icon: LineChart, 
    description: "Annual emissions", 
    color: "bg-blue-50 text-blue-700" 
  },
  { 
    title: "Compliance Rate", 
    value: "92%", 
    change: 2.1, 
    icon: PieChart, 
    description: "Regulatory adherence", 
    color: "bg-amber-50 text-amber-700" 
  },
];
