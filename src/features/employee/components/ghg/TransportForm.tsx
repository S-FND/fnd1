
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface TransportFormProps {
  onNext: () => void;
}

const TransportForm: React.FC<TransportFormProps> = ({ onNext }) => {
  return (
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
          <Button onClick={onNext}>Next: Home Energy</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportForm;
