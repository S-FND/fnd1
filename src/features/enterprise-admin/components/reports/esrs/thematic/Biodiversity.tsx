
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Biodiversity: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ESRS E4: Biodiversity & Ecosystems</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Biodiversity Strategy & Action Plan</h3>
            <p className="mb-4">
              Translog India Ltd. has developed a comprehensive biodiversity strategy aligned with 
              the Global Biodiversity Framework. Our approach focuses on avoiding and minimizing 
              impacts on biodiversity from our operations and supporting ecosystem restoration 
              in areas where we operate.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Biodiversity Commitments</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">
                      2025
                    </Badge>
                    <span>Complete biodiversity assessments for all sites</span>
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">
                      2026
                    </Badge>
                    <span>Implement site-specific biodiversity action plans</span>
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">
                      2028
                    </Badge>
                    <span>No net loss for all new developments</span>
                  </li>
                  <li className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">
                      2030
                    </Badge>
                    <span>Net positive impact on biodiversity</span>
                  </li>
                </ul>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Current Progress</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Biodiversity assessments completed for 65% of operations</li>
                  <li>18 biodiversity action plans implemented</li>
                  <li>80 hectares of habitat under restoration programs</li>
                  <li>12 partnerships with local conservation organizations</li>
                  <li>Zero operations in UNESCO World Heritage sites or protected areas</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Impacts on Biodiversity</h3>
            <p className="mb-4">
              We have identified the following primary impacts of our operations on biodiversity 
              and implemented mitigation measures to address them:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Impact Type</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Mitigation Measures</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Land Use Change</td>
                    <td className="p-2">Conversion of 15 hectares for logistics hub development</td>
                    <td className="p-2">Habitat restoration of 35 hectares in adjacent areas</td>
                    <td className="p-2">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">In Progress</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Habitat Fragmentation</td>
                    <td className="p-2">Transportation routes dividing natural habitats</td>
                    <td className="p-2">Constructed 8 wildlife crossings along major routes</td>
                    <td className="p-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Water Use</td>
                    <td className="p-2">Water extraction affecting local waterbodies</td>
                    <td className="p-2">Water efficiency measures and rainwater harvesting</td>
                    <td className="p-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Invasive Species</td>
                    <td className="p-2">Risk of transporting invasive species in cargo</td>
                    <td className="p-2">Inspection and biosecurity protocols</td>
                    <td className="p-2">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">Ongoing</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Biodiversity Enhancement Initiatives</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Eastern Green Corridor</h4>
                <p className="text-sm">
                  Restoration of 45 hectares of degraded land along our eastern logistics route, 
                  creating a continuous habitat corridor for native species.
                </p>
                <div className="mt-2">
                  <Badge>Habitat Restoration</Badge>
                  <Badge className="ml-2">Carbon Sequestration</Badge>
                </div>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Urban Pollinator Program</h4>
                <p className="text-sm">
                  Native wildflower gardens at 23 facilities supporting local pollinator 
                  species and enhancing urban biodiversity.
                </p>
                <div className="mt-2">
                  <Badge>Pollinator Conservation</Badge>
                  <Badge className="ml-2">Employee Engagement</Badge>
                </div>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Coastal Wetland Protection</h4>
                <p className="text-sm">
                  Partnership with Marine Conservation Society to protect and restore 
                  15 hectares of coastal wetlands near our port operations.
                </p>
                <div className="mt-2">
                  <Badge>Ecosystem Protection</Badge>
                  <Badge className="ml-2">Community Partnership</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Biodiversity;
