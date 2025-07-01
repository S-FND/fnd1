
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { industries } from '../../data/materiality';
import industryList from "../../../../data/industry.json";

interface IndustrySelectionProps {
  selectedIndustries: string[];
  onIndustryChange: (industryId: string, checked: boolean) => void;
  onClearSelection: () => void;
  onUpdateMatrix: () => void;
}

const IndustrySelection: React.FC<IndustrySelectionProps> = ({
  selectedIndustries,
  onIndustryChange,
  onClearSelection,
  onUpdateMatrix
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Selection</CardTitle>
        <CardDescription>Select industries relevant to your organization to customize materiality assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {industryList.map((industry,index) => (
            <div key={index} className="flex items-start space-x-2">
              <Checkbox 
                id={`industry-${industry.id}`}
                checked={selectedIndustries.includes(industry.name)}
                onCheckedChange={(checked) => onIndustryChange(industry.name, checked === true)}
              />
              <label 
                htmlFor={`industry-${industry.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {industry.name}
              </label>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            {selectedIndustries.length} {selectedIndustries.length === 1 ? 'Industry' : 'Industries'} Selected
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onUpdateMatrix}
          >
            Update Matrix
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustrySelection;
