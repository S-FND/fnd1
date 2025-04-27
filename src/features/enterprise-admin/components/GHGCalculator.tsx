import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { personalGHGParams } from '@/data';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface GHGValues {
  commute: string;
  commuteDistance: number;
  electricity: number;
  flights: number;
  diet: string;
}

interface GHGResult {
  totalEmissions: number;
  categories: {
    transport: number;
    energy: number;
    food: number;
  };
}

const defaultValues: GHGValues = {
  commute: 'public',
  commuteDistance: 10,
  electricity: 300,
  flights: 2,
  diet: 'vegetarian',
};

const COLORS = ['#22c55e', '#60a5fa', '#f59e0b'];

const GHGCalculator: React.FC = () => {
  const [values, setValues] = useState<GHGValues>(defaultValues);
  const [result, setResult] = useState<GHGResult | null>(null);
  
  const handleChange = (field: keyof GHGValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const calculateEmissions = () => {
    const commuteOption = personalGHGParams[0].options?.find(
      (opt) => opt.value === values.commute
    );
    const commuteEmissions = commuteOption
      ? commuteOption.co2Factor * values.commuteDistance * 220 // assuming 220 working days
      : 0;
    
    const electricityEmissions = values.electricity * 0.5; // simple factor for demo
    
    const flightsEmissions = values.flights * 1.5; // simple factor for demo
    
    const dietOption = personalGHGParams[3].options?.find(
      (opt) => opt.value === values.diet
    );
    const dietEmissions = dietOption ? dietOption.co2Factor * 365 : 0; // annual
    
    const transport = commuteEmissions + flightsEmissions;
    const energy = electricityEmissions;
    const food = dietEmissions;
    
    const totalEmissions = transport + energy + food;
    
    setResult({
      totalEmissions: parseFloat(totalEmissions.toFixed(2)),
      categories: {
        transport: parseFloat(transport.toFixed(2)),
        energy: parseFloat(energy.toFixed(2)),
        food: parseFloat(food.toFixed(2)),
      },
    });
  };
  
  const pieData = result
    ? [
        { name: 'Transport', value: result.categories.transport },
        { name: 'Energy', value: result.categories.energy },
        { name: 'Food', value: result.categories.food },
      ]
    : [];

  const graphData = [
    {
      name: 'You',
      emissions: result?.totalEmissions || 0,
    },
    {
      name: 'Avg Employee',
      emissions: 4.2,
    },
    {
      name: 'Avg Indian',
      emissions: 2.4,
    },
    {
      name: 'Global Target',
      emissions: 1.5,
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Carbon Footprint Calculator</CardTitle>
          <CardDescription>
            Calculate your annual carbon emissions based on your lifestyle choices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="commute">Daily Commute</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="h-5 w-5 p-0 ml-1">
                        <HelpCircle className="h-3 w-3" />
                        <span className="sr-only">Help</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Your primary mode of transportation to work
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={values.commute}
                onValueChange={(value) => handleChange('commute', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transport mode" />
                </SelectTrigger>
                <SelectContent>
                  {personalGHGParams[0].options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commuteDistance">Daily Commute Distance (km)</Label>
              <Input
                id="commuteDistance"
                type="number"
                min="0"
                value={values.commuteDistance}
                onChange={(e) => handleChange('commuteDistance', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="electricity">Monthly Electricity Usage (kWh)</Label>
              <Input
                id="electricity"
                type="number"
                min="0"
                value={values.electricity}
                onChange={(e) => handleChange('electricity', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="flights">Flights per Year</Label>
              <Input
                id="flights"
                type="number"
                min="0"
                value={values.flights}
                onChange={(e) => handleChange('flights', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diet">Dietary Preference</Label>
              <Select
                value={values.diet}
                onValueChange={(value) => handleChange('diet', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  {personalGHGParams[3].options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setValues(defaultValues)}
          >
            Reset
          </Button>
          <Button onClick={calculateEmissions} className="gap-2">
            Calculate <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Carbon Footprint</CardTitle>
              <CardDescription>Annual greenhouse gas emissions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">
                {result.totalEmissions} <span className="text-lg font-normal">tonnes CO₂e</span>
              </div>
              <div className="text-sm text-muted-foreground mb-6">
                {result.totalEmissions < 4 
                  ? "Better than company average!" 
                  : "Above company average - consider reduction strategies"}
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 w-full mt-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">Transport</div>
                  <div>{result.categories.transport} tonnes</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Energy</div>
                  <div>{result.categories.energy} tonnes</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Food</div>
                  <div>{result.categories.food} tonnes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How You Compare</CardTitle>
              <CardDescription>Your emissions vs benchmarks</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <h4 className="font-medium mb-2">Reduction Tips:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Consider carpooling or public transport for your commute</li>
                <li>Switch to energy-efficient appliances to reduce electricity usage</li>
                <li>Reduce meat consumption to lower your dietary carbon footprint</li>
              </ul>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GHGCalculator;
