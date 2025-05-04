
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { personalEmissionsData } from './ghg/PersonalGHGData';

// Import the refactored components
import TransportForm from './ghg/TransportForm';
import HomeEnergyForm from './ghg/HomeEnergyForm';
import FoodConsumptionForm from './ghg/FoodConsumptionForm';
import ShoppingLifestyleForm from './ghg/ShoppingLifestyleForm';
import EmissionsResults from './ghg/EmissionsResults';

const PersonalGHGCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState("transport");
  const [calculatedEmissions, setCalculatedEmissions] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCalculate = () => {
    const result = Math.random() * 5 + 3;
    setCalculatedEmissions(parseFloat(result.toFixed(2)));
    setShowResults(true);
    setActiveTab("results");
  };

  const handleRecalculate = () => {
    setActiveTab("transport");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="transport" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="shopping">Shopping</TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transport">
          <TransportForm onNext={() => handleNavigateToTab("home")} />
        </TabsContent>
        
        <TabsContent value="home">
          <HomeEnergyForm 
            onNext={() => handleNavigateToTab("food")} 
            onPrevious={() => handleNavigateToTab("transport")} 
          />
        </TabsContent>
        
        <TabsContent value="food">
          <FoodConsumptionForm 
            onNext={() => handleNavigateToTab("shopping")} 
            onPrevious={() => handleNavigateToTab("home")} 
          />
        </TabsContent>
        
        <TabsContent value="shopping">
          <ShoppingLifestyleForm 
            onCalculate={handleCalculate} 
            onPrevious={() => handleNavigateToTab("food")} 
          />
        </TabsContent>
        
        <TabsContent value="results">
          <EmissionsResults 
            calculatedEmissions={calculatedEmissions}
            onRecalculate={handleRecalculate}
            personalEmissionsData={personalEmissionsData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalGHGCalculator;
