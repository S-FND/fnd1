import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SDGOutcome {
  id: string;
  what: string;
  who: string;
  abcGoal: 'A' | 'B' | 'C';
  impactThesis: string;
}

export interface SDGOutcomeMapping {
  id: string;
  sdgTargetNumber: string;
  description: string;
  abcGoal: 'A' | 'B' | 'C';
  stakeholder: string;
  impactThesis: string;
  outputOutcome: string;
  metricSource: string;
  outcomeThreshold: string;
  thresholdSetBy: string;
  targetType: string;
  targetValue: string;
  internalBaseline: string;
  counterfactual: string;
  counterfactualSource: string;
  stakeholderMateriality: 'High' | 'Medium' | 'Low';
  riskLevel?: 'High' | 'Medium' | 'Low';
  riskDescription?: string;
  performanceData?: string;
  targetComparison?: string;
  thresholdComparison?: string;
  peerComparison?: string;
  // Reference to the strategy outcome that created this mapping
  strategyOutcomeId?: string;
}

interface SDGContextType {
  // Strategy outcomes
  outcomes: SDGOutcome[];
  setOutcomes: (outcomes: SDGOutcome[]) => void;
  addOutcome: (outcome: SDGOutcome) => void;
  updateOutcome: (id: string, outcome: Partial<SDGOutcome>) => void;
  deleteOutcome: (id: string) => void;
  
  // Outcome mappings
  outcomeMappings: SDGOutcomeMapping[];
  setOutcomeMappings: (mappings: SDGOutcomeMapping[]) => void;
  addOutcomeMapping: (mapping: SDGOutcomeMapping) => void;
  updateOutcomeMapping: (id: string, mapping: Partial<SDGOutcomeMapping>) => void;
  deleteOutcomeMapping: (id: string) => void;
  
  // Utility functions
  createMappingFromOutcome: (outcome: SDGOutcome) => SDGOutcomeMapping;
  getUnmappedOutcomes: () => SDGOutcome[];
}

const SDGContext = createContext<SDGContextType | undefined>(undefined);

export const useSDG = () => {
  const context = useContext(SDGContext);
  if (!context) {
    throw new Error('useSDG must be used within an SDGProvider');
  }
  return context;
};

export const SDGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [outcomes, setOutcomes] = useState<SDGOutcome[]>([
    {
      id: '1',
      what: 'SDG 4: Quality Education - Target 4.7',
      who: 'Local community students and educators',
      abcGoal: 'B',
      impactThesis: 'If we provide comprehensive sustainability education programs, then we believe local communities will develop stronger environmental awareness and sustainable practices.'
    },
    {
      id: '2',
      what: 'SDG 13: Climate Action - Target 13.3',
      who: 'Employees and supply chain partners',
      abcGoal: 'A',
      impactThesis: 'If we implement carbon reduction training and incentive programs, then we believe our workforce will significantly reduce organizational carbon footprint.'
    }
  ]);

  const [outcomeMappings, setOutcomeMappings] = useState<SDGOutcomeMapping[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedOutcomes = localStorage.getItem('sdg-outcomes');
    const savedMappings = localStorage.getItem('sdg-outcome-mappings');
    
    if (savedOutcomes) {
      try {
        setOutcomes(JSON.parse(savedOutcomes));
      } catch (error) {
        console.error('Failed to load SDG outcomes from localStorage:', error);
      }
    }
    
    if (savedMappings) {
      try {
        setOutcomeMappings(JSON.parse(savedMappings));
      } catch (error) {
        console.error('Failed to load SDG outcome mappings from localStorage:', error);
      }
    }
  }, []);

  // Save outcomes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sdg-outcomes', JSON.stringify(outcomes));
  }, [outcomes]);

  // Save mappings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sdg-outcome-mappings', JSON.stringify(outcomeMappings));
  }, [outcomeMappings]);

  const addOutcome = (outcome: SDGOutcome) => {
    setOutcomes(prev => [...prev, outcome]);
  };

  const updateOutcome = (id: string, updatedOutcome: Partial<SDGOutcome>) => {
    setOutcomes(prev => prev.map(outcome => 
      outcome.id === id ? { ...outcome, ...updatedOutcome } : outcome
    ));
  };

  const deleteOutcome = (id: string) => {
    setOutcomes(prev => prev.filter(outcome => outcome.id !== id));
    // Also remove any related mappings
    setOutcomeMappings(prev => prev.filter(mapping => mapping.strategyOutcomeId !== id));
  };

  const addOutcomeMapping = (mapping: SDGOutcomeMapping) => {
    setOutcomeMappings(prev => [...prev, mapping]);
  };

  const updateOutcomeMapping = (id: string, updatedMapping: Partial<SDGOutcomeMapping>) => {
    setOutcomeMappings(prev => prev.map(mapping => 
      mapping.id === id ? { ...mapping, ...updatedMapping } : mapping
    ));
  };

  const deleteOutcomeMapping = (id: string) => {
    setOutcomeMappings(prev => prev.filter(mapping => mapping.id !== id));
  };

  const createMappingFromOutcome = (outcome: SDGOutcome): SDGOutcomeMapping => {
    // Extract SDG target number from the 'what' field
    const targetMatch = outcome.what.match(/Target\s+(\d+\.\d+)/i);
    const sdgTargetNumber = targetMatch ? targetMatch[1] : '';

    return {
      id: `mapping-${Date.now()}`,
      sdgTargetNumber,
      description: outcome.what,
      abcGoal: outcome.abcGoal,
      stakeholder: outcome.who,
      impactThesis: outcome.impactThesis,
      outputOutcome: '',
      metricSource: '',
      outcomeThreshold: '',
      thresholdSetBy: '',
      targetType: '',
      targetValue: '',
      internalBaseline: '',
      counterfactual: '',
      counterfactualSource: '',
      stakeholderMateriality: 'Medium',
      strategyOutcomeId: outcome.id
    };
  };

  const getUnmappedOutcomes = (): SDGOutcome[] => {
    const mappedOutcomeIds = new Set(
      outcomeMappings
        .filter(mapping => mapping.strategyOutcomeId)
        .map(mapping => mapping.strategyOutcomeId)
    );
    
    return outcomes.filter(outcome => !mappedOutcomeIds.has(outcome.id));
  };

  const value: SDGContextType = {
    outcomes,
    setOutcomes,
    addOutcome,
    updateOutcome,
    deleteOutcome,
    outcomeMappings,
    setOutcomeMappings,
    addOutcomeMapping,
    updateOutcomeMapping,
    deleteOutcomeMapping,
    createMappingFromOutcome,
    getUnmappedOutcomes
  };

  return <SDGContext.Provider value={value}>{children}</SDGContext.Provider>;
};