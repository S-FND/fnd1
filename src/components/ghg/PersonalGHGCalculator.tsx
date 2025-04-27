
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { personalGHGParams } from '@/data';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const PersonalGHGCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("transport");
  const [calculatedEmissions, setCalculatedEmissions] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const personalEmissionsData = [
    { month: 'Jan', value: 1.2 },
    { month: 'Feb', value: 1.5 },
    { month: 'Mar', value: 1.3 },
    { month: 'Apr', value: 1.4 },
    { month: 'May', value: 1.2 },
    { month: 'Jun', value: 1.0 },
    { month: 'Jul', value: 0.9 },
    { month: 'Aug', value: 1.1 },
    { month: 'Sep', value: 1.3 },
    { month: 'Oct', value: 1.2 },
    { month: 'Nov', value: 1.4 },
    { month: 'Dec', value: 1.5 },
  ];

  const handleCalculate = () => {
    const result = Math.random() * 5 + 3;
    setCalculatedEmissions(parseFloat(result.toFixed(2)));
    setShowResults(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="transport" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="shopping">Shopping</TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transport" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transport Emissions</CardTitle>
              <CardDescription>
                Calculate the carbon impact of your daily commute and travel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commute-distance">Daily commute distance (km)</Label>
                  <Input id="commute-distance" type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commute-type">Primary commute method</Label>
                  <Select defaultValue="car">
                    <SelectTrigger id="commute-type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car (Petrol/Diesel)</SelectItem>
                      <SelectItem value="electric-car">Electric Car</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="train">Train/Metro</SelectItem>
                      <SelectItem value="bike">Bicycle</SelectItem>
                      <SelectItem value="walk">Walking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="flights-shorthaul">Short-haul flights per year</Label>
                  <Input id="flights-shorthaul" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flights-longhaul">Long-haul flights per year</Label>
                  <Input id="flights-longhaul" type="number" placeholder="0" />
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline">Reset</Button>
                <Button onClick={() => setActiveTab("home")}>Next: Home Energy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Energy Use</CardTitle>
              <CardDescription>
                Calculate emissions from your home electricity and heating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="electricity">Monthly electricity use (kWh)</Label>
                  <Input id="electricity" type="number" placeholder="250" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewable">Renewable energy percentage</Label>
                  <Input id="renewable" type="number" placeholder="0" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heating-type">Heating type</Label>
                  <Select defaultValue="natural-gas">
                    <SelectTrigger id="heating-type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural-gas">Natural Gas</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="oil">Oil</SelectItem>
                      <SelectItem value="lpg">LPG</SelectItem>
                      <SelectItem value="wood">Wood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="household-size">Number of people in household</Label>
                  <Input id="household-size" type="number" placeholder="2" />
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("transport")}>Previous</Button>
                <Button onClick={() => setActiveTab("food")}>Next: Food Consumption</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="food" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Food Consumption</CardTitle>
              <CardDescription>
                Calculate emissions from your diet and food choices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diet-type">Primary diet type</Label>
                  <Select defaultValue="omnivore">
                    <SelectTrigger id="diet-type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meat-heavy">Meat with every meal</SelectItem>
                      <SelectItem value="omnivore">Regular omnivore</SelectItem>
                      <SelectItem value="flexitarian">Flexitarian</SelectItem>
                      <SelectItem value="pescatarian">Pescatarian</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local-food">Local food percentage</Label>
                  <Input id="local-food" type="number" placeholder="20" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="food-waste">Food waste percentage</Label>
                  <Input id="food-waste" type="number" placeholder="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organic-food">Organic food percentage</Label>
                  <Input id="organic-food" type="number" placeholder="10" />
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("home")}>Previous</Button>
                <Button onClick={() => setActiveTab("shopping")}>Next: Shopping & Lifestyle</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shopping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shopping & Lifestyle</CardTitle>
              <CardDescription>
                Calculate emissions from your shopping habits and lifestyle choices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clothing">New clothing items per year</Label>
                  <Input id="clothing" type="number" placeholder="20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electronics">New electronics per year</Label>
                  <Input id="electronics" type="number" placeholder="1" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recycling">Recycling percentage</Label>
                  <Input id="recycling" type="number" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondhand">Second-hand purchases percentage</Label>
                  <Input id="secondhand" type="number" placeholder="10" />
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("food")}>Previous</Button>
                <Button onClick={handleCalculate}>Calculate Footprint</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Carbon Footprint</CardTitle>
                <CardDescription>
                  Annual emissions based on your lifestyle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <div className="text-4xl font-bold">{calculatedEmissions} tonnes</div>
                  <div className="text-sm text-muted-foreground mt-2">CO₂ equivalent per year</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div>Your footprint</div>
                    <div>Global average: 4.8 tonnes</div>
                  </div>
                  <Progress value={calculatedEmissions / 4.8 * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-sm font-medium">Transport</div>
                    <div className="text-2xl font-bold">{(calculatedEmissions * 0.3).toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">tonnes (30%)</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-sm font-medium">Home</div>
                    <div className="text-2xl font-bold">{(calculatedEmissions * 0.25).toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">tonnes (25%)</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-sm font-medium">Food</div>
                    <div className="text-2xl font-bold">{(calculatedEmissions * 0.3).toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">tonnes (30%)</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-sm font-medium">Shopping</div>
                    <div className="text-2xl font-bold">{(calculatedEmissions * 0.15).toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">tonnes (15%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Emission Trends</CardTitle>
                <CardDescription>
                  Your carbon footprint over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={personalEmissionsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Reduction Suggestions</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="rounded-full bg-green-100 p-1 text-xs text-green-600">-0.5t</span>
                      <span>Switch to public transportation twice a week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="rounded-full bg-green-100 p-1 text-xs text-green-600">-0.3t</span>
                      <span>Reduce meat consumption by 30%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="rounded-full bg-green-100 p-1 text-xs text-green-600">-0.2t</span>
                      <span>Use renewable energy for home electricity</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setActiveTab("transport")}>Recalculate</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalGHGCalculator;
