
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface FoodConsumptionFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const FoodConsumptionForm: React.FC<FoodConsumptionFormProps> = ({ onNext, onPrevious }) => {
  return (
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
          <Button variant="outline" onClick={onPrevious}>Previous</Button>
          <Button onClick={onNext}>Next: Shopping & Lifestyle</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodConsumptionForm;
