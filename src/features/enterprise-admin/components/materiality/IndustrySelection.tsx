
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
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
  const handleSelectIndustry = (industryId: string) => {
    if (!selectedIndustries.includes(industryId)) {
      onIndustryChange(industryId, true);
    }
  };

  const handleRemoveIndustry = (industryId: string) => {
    onIndustryChange(industryId, false);
  };

  const availableIndustries = industries.filter(
    industry => !selectedIndustries.includes(industry.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Selection</CardTitle>
        <CardDescription>Select industries relevant to your organization to customize materiality assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="industry-select" className="block text-sm font-medium mb-2">
              Add Industries
            </label>
            <Select onValueChange={handleSelectIndustry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an industry to add..." />
              </SelectTrigger>
              <SelectContent>
                {availableIndustries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedIndustries.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Selected Industries ({selectedIndustries.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedIndustries.map((industryId) => {
                  const industry = industries.find(i => i.id === industryId);
                  return (
                    <Badge 
                      key={industryId} 
                      variant="secondary" 
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {industry?.name || industryId}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveIndustry(industryId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
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
