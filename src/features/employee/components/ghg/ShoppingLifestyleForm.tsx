
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ShoppingLifestyleFormProps {
  onPrevious: () => void;
  onCalculate: () => void;
}

const ShoppingLifestyleForm: React.FC<ShoppingLifestyleFormProps> = ({ onPrevious, onCalculate }) => {
  return (
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
          <Button variant="outline" onClick={onPrevious}>Previous</Button>
          <Button onClick={onCalculate}>Calculate Footprint</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingLifestyleForm;
