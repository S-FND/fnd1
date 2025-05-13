
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClimateChange from './thematic/ClimateChange';
import Pollution from './thematic/Pollution';
import Biodiversity from './thematic/Biodiversity';
import HumanRights from './thematic/HumanRights';

const ThematicStandards: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">ESRS 3-12: Thematic Standards</h2>
      
      <Tabs defaultValue="climate" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="climate">Climate Change</TabsTrigger>
          <TabsTrigger value="pollution">Pollution</TabsTrigger>
          <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
          <TabsTrigger value="humanrights">Human Rights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="climate">
          <ClimateChange />
        </TabsContent>
        
        <TabsContent value="pollution">
          <Pollution />
        </TabsContent>
        
        <TabsContent value="biodiversity">
          <Biodiversity />
        </TabsContent>
        
        <TabsContent value="humanrights">
          <HumanRights />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ThematicStandards;
