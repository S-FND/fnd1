import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { EmissionFactor, getEmissionFactorsByScope, searchEmissionFactors } from '@/data/ghg/emissionFactors';
interface EmissionFactorSelectorProps {
  scope: 1 | 2 | 3 | 4;
  category?: string;
  value?: string; // emission factor ID
  onSelect: (factor: EmissionFactor) => void;
}

const mapScope3CategoryToShort = (fullCategory: string): string | null => {
  if (!fullCategory) return null;
  
  // Extract category number from the full name
  const match = fullCategory.match(/Category\s*(\d+)/i);
  if (match) {
    return `Category ${match[1]}`;
  }
  return null;
};

export const EmissionFactorSelector: React.FC<EmissionFactorSelectorProps> = ({
  scope,
  category,
  value,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFactors, setFilteredFactors] = useState<EmissionFactor[]>([]);
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor | null>(null);

  useEffect(() => {
    let factors: EmissionFactor[];
    
    if (searchTerm) {
      factors = searchEmissionFactors(scope, searchTerm);
    } else {
      // Get all factors for this scope
      factors = getEmissionFactorsByScope(scope);
      
      // For Scope 3, filter by short category name (e.g., "Category 1")
      if (scope === 3 && category) {
        const shortCategory = mapScope3CategoryToShort(category);
        if (shortCategory) {
          factors = factors.filter(ef => ef.category === shortCategory);
        }
      } else if (category) {
        // For other scopes, use exact category match
        factors = factors.filter(ef => ef.category === category);
      }
    }
    
    setFilteredFactors(factors);
  }, [scope, category, searchTerm]);

  useEffect(() => {
    if (value) {
      const factor = getEmissionFactorsByScope(scope).find(f => f.id === value);
      if (factor) setSelectedFactor(factor);
    }
  }, [value, scope]);

  const handleSelect = (factorId: string) => {
    const factor = filteredFactors.find(f => f.id === factorId);
    if (factor) {
      setSelectedFactor(factor);
      onSelect(factor);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Search Emission Factor</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Select Emission Factor {filteredFactors.length > 0 && <span className="text-muted-foreground text-xs">({filteredFactors.length} available)</span>}</Label>
        <Select value={selectedFactor?.id} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select emission factor..." />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {/* {filteredFactors.map(factor => (
              <SelectItem key={factor.id} value={factor.id}>
                <div className="flex flex-col py-1">
                  <div className="font-medium">{factor.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {factor.factor} {factor.unit} • {factor.source} ({factor.year})
                  </div>
                  {factor.description && (
                    <div className="text-xs text-muted-foreground">{factor.description}</div>
                  )}
                </div>
              </SelectItem>
            ))} */}
            {filteredFactors.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">No emission factors found</div>
            ) : (
              filteredFactors.map(factor => (
                <SelectItem key={factor.id} value={factor.id}>
                  <div className="flex flex-col py-1">
                    <div className="font-medium">{factor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {factor.factor} {factor.unit} • {factor.source} ({factor.year})
                    </div>
                    {factor.description && (
                      <div className="text-xs text-muted-foreground">{factor.description}</div>
                    )}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedFactor && (
        <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{selectedFactor.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedFactor.description}</p>
            </div>
            <Badge variant="outline">{selectedFactor.category}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Emission Factor:</span>
              <p className="font-medium">{selectedFactor.factor} {selectedFactor.unit}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Source:</span>
              <p className="font-medium">{selectedFactor.source} ({selectedFactor.year})</p>
            </div>
            <div>
              <span className="text-muted-foreground">GHGs Included:</span>
              <p className="font-medium">{selectedFactor.gases}</p>
            </div>
            {selectedFactor.region && (
              <div>
                <span className="text-muted-foreground">Region:</span>
                <p className="font-medium">{selectedFactor.region}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionFactorSelector;