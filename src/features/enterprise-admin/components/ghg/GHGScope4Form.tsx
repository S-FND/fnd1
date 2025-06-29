
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { scope4Categories } from './mockData';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export const GHGScope4Form = () => {
  const [selectedCategory, setSelectedCategory] = useState(scope4Categories[0].id);
  const [formData, setFormData] = useState<Record<string, Record<string, number>>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  const currentCategory = scope4Categories.find(cat => cat.id === selectedCategory);
  
  const handleValueChange = (categoryId: string, itemId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] || {}),
        [itemId]: numValue
      }
    }));
  };
  
  const handleDescriptionChange = (categoryId: string, value: string) => {
    setDescriptions(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };
  
  const calculateEmissions = (categoryId: string, itemId: string) => {
    if (!formData[categoryId] || formData[categoryId][itemId] === undefined) return 0;
    
    const item = scope4Categories
      .find(cat => cat.id === categoryId)
      ?.items.find(i => i.id === itemId);
    
    if (!item) return 0;
    
    return formData[categoryId][itemId] * item.emissionFactor;
  };
  
  const handleSaveData = () => {
    toast({
      title: "Data Saved",
      description: "Your Scope 4 emissions data has been saved successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope 4: Avoided Emissions</CardTitle>
          <CardDescription>
            Record emissions avoided through your products, services, or initiatives (optional reporting)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {scope4Categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentCategory?.description}
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <Label>Initiative Description</Label>
                    <Textarea 
                      placeholder="Describe how this initiative avoids emissions..."
                      value={descriptions[selectedCategory] || ''}
                      onChange={(e) => handleDescriptionChange(selectedCategory, e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {currentCategory?.items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5">
                          <Label htmlFor={item.id}>{item.name}</Label>
                        </div>
                        <div className="col-span-3">
                          <div className="flex items-center space-x-2">
                            <Input
                              id={item.id}
                              type="number"
                              placeholder="0.00"
                              value={formData[selectedCategory]?.[item.id] || ''}
                              onChange={(e) => handleValueChange(selectedCategory, item.id, e.target.value)}
                            />
                            <span className="text-sm text-muted-foreground w-12">{item.unit}</span>
                          </div>
                        </div>
                        <div className="col-span-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-600">
                              -{calculateEmissions(selectedCategory, item.id).toFixed(2)} tCO₂e
                            </span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Details</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Avoided Emission Details</DialogTitle>
                                  <DialogDescription>
                                    Information about how this avoided emission is calculated
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Item</Label>
                                      <p className="text-sm">{item.name}</p>
                                    </div>
                                    <div>
                                      <Label>Unit</Label>
                                      <p className="text-sm">{item.unit}</p>
                                    </div>
                                    <div>
                                      <Label>Avoidance Factor</Label>
                                      <p className="text-sm">{item.emissionFactor} kgCO₂e per {item.unit}</p>
                                    </div>
                                    <div>
                                      <Label>Methodology</Label>
                                      <p className="text-sm">Comparative Baseline Analysis</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Calculation Method</Label>
                                    <p className="text-sm mt-1">
                                      Activity data ({formData[selectedCategory]?.[item.id] || 0} {item.unit}) × 
                                      Avoidance factor ({item.emissionFactor} kgCO₂e/{item.unit}) ÷ 
                                      1000 = {calculateEmissions(selectedCategory, item.id).toFixed(2)} tCO₂e avoided
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline">Import Data</Button>
        <div className="space-x-2">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={handleSaveData}>Save & Submit</Button>
        </div>
      </div>
    </div>
  );
};
