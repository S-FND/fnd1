
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface HomeEnergyFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const HomeEnergyForm: React.FC<HomeEnergyFormProps> = ({ onNext, onPrevious }) => {
  return (
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
          <Button variant="outline" onClick={onPrevious}>Previous</Button>
          <Button onClick={onNext}>Next: Food Consumption</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeEnergyForm;
