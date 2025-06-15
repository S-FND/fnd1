
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Pollution: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ESRS E2: Pollution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Air Pollution Management</h3>
            <p className="mb-4">
              Translog India Ltd. has implemented comprehensive measures to minimize air pollution 
              from our logistics operations. Our air quality management plan focuses on reducing 
              emissions of nitrogen oxides (NOx), particulate matter (PM), and volatile organic 
              compounds (VOCs).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">NOx Emissions</p>
                <p className="font-bold mb-1">125.3 tons</p>
                <p className="text-xs text-green-600 mb-2">-15.2% vs. 2023</p>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">65% to 2028 target</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PM Emissions</p>
                <p className="font-bold mb-1">18.7 tons</p>
                <p className="text-xs text-green-600 mb-2">-22.4% vs. 2023</p>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">75% to 2028 target</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VOC Emissions</p>
                <p className="font-bold mb-1">32.5 tons</p>
                <p className="text-xs text-green-600 mb-2">-9.7% vs. 2023</p>
                <Progress value={45} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">45% to 2028 target</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Water Pollution Prevention</h3>
            <p className="mb-4">
              Our water management system ensures all wastewater from vehicle washing, 
              maintenance facilities, and distribution centers is properly treated before 
              discharge. We have implemented advanced filtration systems at all major facilities 
              and conduct regular water quality testing.
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Wastewater Treatment Performance</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Water Treated</p>
                  <p className="font-bold">243,500 m³</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BOD Removal</p>
                  <p className="font-bold">99.2%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">COD Removal</p>
                  <p className="font-bold">97.8%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Water Recycled</p>
                  <p className="font-bold">78.5%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Plastic & Packaging Waste</h3>
            <p className="mb-3">
              We've redesigned our packaging solutions to minimize plastic use and increase 
              recyclability. Our sustainable packaging program has eliminated 850 tons of 
              single-use plastic in 2024 and introduced 100% recycled or biodegradable alternatives.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Packaging Materials Breakdown</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Recycled cardboard</span>
                    <span className="font-medium">62%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Biodegradable materials</span>
                    <span className="font-medium">27%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Recycled plastics</span>
                    <span className="font-medium">8%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Virgin materials</span>
                    <span className="font-medium">3%</span>
                  </li>
                </ul>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Packaging Waste Reduction Initiatives</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Reusable shipping container program</li>
                  <li>Right-sizing packaging algorithm</li>
                  <li>Take-back program for packaging materials</li>
                  <li>Supplier packaging standards</li>
                  <li>Customer packaging education</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pollution;
