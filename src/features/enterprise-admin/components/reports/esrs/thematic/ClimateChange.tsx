
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const emissionsData = [
  { year: '2020', scope1: 24500, scope2: 18700, scope3: 132500 },
  { year: '2021', scope1: 23100, scope2: 16900, scope3: 128700 },
  { year: '2022', scope1: 21800, scope2: 15200, scope3: 124300 },
  { year: '2023', scope1: 19500, scope2: 13800, scope3: 119600 },
  { year: '2024', scope1: 17300, scope2: 11500, scope3: 115200 },
];

const ClimateChange: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ESRS E1: Climate Change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Climate Strategy</h3>
            <p className="mb-4">
              Translog India Ltd. has committed to achieving net-zero greenhouse gas emissions 
              by 2040. Our climate strategy is aligned with the Paris Agreement's goal of 
              limiting global warming to 1.5°C and has been validated by the Science Based 
              Targets initiative (SBTi).
            </p>
            <p>
              Key elements of our climate strategy include:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Electrification of our transportation fleet (40% by 2030)</li>
              <li>Transition to 100% renewable energy in all facilities by 2028</li>
              <li>Implementation of energy efficiency measures across operations</li>
              <li>Engagement with suppliers to reduce Scope 3 emissions</li>
              <li>Climate-related innovation in logistics solutions</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">GHG Emissions Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={emissionsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scope1" name="Scope 1" fill="#8884d8" />
                  <Bar dataKey="scope2" name="Scope 2" fill="#82ca9d" />
                  <Bar dataKey="scope3" name="Scope 3" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="font-medium">Scope 1 Emissions</p>
                <p className="text-2xl font-bold">17,300 tCO₂e</p>
                <p className="text-sm text-green-600">-11.3% vs previous year</p>
              </div>
              <div>
                <p className="font-medium">Scope 2 Emissions</p>
                <p className="text-2xl font-bold">11,500 tCO₂e</p>
                <p className="text-sm text-green-600">-16.7% vs previous year</p>
              </div>
              <div>
                <p className="font-medium">Scope 3 Emissions</p>
                <p className="text-2xl font-bold">115,200 tCO₂e</p>
                <p className="text-sm text-green-600">-3.7% vs previous year</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Climate Risk Management</h3>
            <p>
              We have conducted comprehensive climate scenario analysis using both 1.5°C and 
              4°C warming scenarios to identify physical and transition risks. Our analysis 
              shows that transition risks, particularly policy changes and carbon pricing, 
              represent the most significant short- to medium-term financial risks.
            </p>
            <div className="mt-3">
              <h4 className="font-medium">Key Climate Risks Identified:</h4>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Carbon pricing regulations in key markets (€30M annual impact by 2030)</li>
                <li>Extreme weather events disrupting operations (€12M annual impact)</li>
                <li>Changes in customer preferences requiring fleet transition (€45M capex)</li>
                <li>Reputational risks from failing to meet climate commitments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClimateChange;
