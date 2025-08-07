import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Leaf, Factory, Zap, Truck, Plus, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

const GHGInventory: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedScope, setSelectedScope] = useState('scope1');

  // Sample data for demonstration
  const [inventoryData, setInventoryData] = useState({
    scope1: {
      stationaryCombustion: { value: 150, unit: 'tCO2e', description: 'Natural gas, diesel generators' },
      mobileCombustion: { value: 85, unit: 'tCO2e', description: 'Company vehicles, forklifts' },
      processEmissions: { value: 200, unit: 'tCO2e', description: 'Manufacturing processes' },
      fugitiveEmissions: { value: 30, unit: 'tCO2e', description: 'Refrigerants, air conditioning' }
    },
    scope2: {
      electricity: { value: 320, unit: 'tCO2e', description: 'Grid electricity consumption' },
      steam: { value: 45, unit: 'tCO2e', description: 'Purchased steam' },
      heatingCooling: { value: 25, unit: 'tCO2e', description: 'District heating/cooling' }
    },
    scope3: {
      purchasedGoods: { value: 850, unit: 'tCO2e', description: 'Raw materials, components' },
      capitalGoods: { value: 120, unit: 'tCO2e', description: 'Equipment, infrastructure' },
      fuelEnergy: { value: 45, unit: 'tCO2e', description: 'Upstream fuel/energy activities' },
      transportation: { value: 180, unit: 'tCO2e', description: 'Transportation & distribution' },
      wasteGenerated: { value: 35, unit: 'tCO2e', description: 'Waste generated in operations' },
      businessTravel: { value: 65, unit: 'tCO2e', description: 'Employee business travel' },
      employeeCommuting: { value: 95, unit: 'tCO2e', description: 'Employee commuting' },
      downstreamTransportation: { value: 220, unit: 'tCO2e', description: 'Downstream transportation' },
      useOfProducts: { value: 450, unit: 'tCO2e', description: 'Use of sold products' },
      endOfLife: { value: 75, unit: 'tCO2e', description: 'End-of-life treatment' }
    }
  });

  const scope1Categories = [
    { key: 'stationaryCombustion', label: 'Stationary Combustion', icon: Factory },
    { key: 'mobileCombustion', label: 'Mobile Combustion', icon: Truck },
    { key: 'processEmissions', label: 'Process Emissions', icon: Factory },
    { key: 'fugitiveEmissions', label: 'Fugitive Emissions', icon: Leaf }
  ];

  const scope2Categories = [
    { key: 'electricity', label: 'Electricity', icon: Zap },
    { key: 'steam', label: 'Steam', icon: Factory },
    { key: 'heatingCooling', label: 'Heating/Cooling', icon: Factory }
  ];

  const scope3Categories = [
    { key: 'purchasedGoods', label: 'Purchased Goods & Services', icon: Truck },
    { key: 'capitalGoods', label: 'Capital Goods', icon: Factory },
    { key: 'fuelEnergy', label: 'Fuel & Energy Activities', icon: Zap },
    { key: 'transportation', label: 'Upstream Transportation', icon: Truck },
    { key: 'wasteGenerated', label: 'Waste Generated', icon: Leaf },
    { key: 'businessTravel', label: 'Business Travel', icon: Truck },
    { key: 'employeeCommuting', label: 'Employee Commuting', icon: Truck },
    { key: 'downstreamTransportation', label: 'Downstream Transportation', icon: Truck },
    { key: 'useOfProducts', label: 'Use of Sold Products', icon: Factory },
    { key: 'endOfLife', label: 'End-of-Life Treatment', icon: Leaf }
  ];

  const getChartData = () => {
    const scope1Total = Object.values(inventoryData.scope1).reduce((sum, item) => sum + item.value, 0);
    const scope2Total = Object.values(inventoryData.scope2).reduce((sum, item) => sum + item.value, 0);
    const scope3Total = Object.values(inventoryData.scope3).reduce((sum, item) => sum + item.value, 0);

    return [
      { name: 'Scope 1', value: scope1Total, color: '#ef4444' },
      { name: 'Scope 2', value: scope2Total, color: '#f97316' },
      { name: 'Scope 3', value: scope3Total, color: '#84cc16' }
    ];
  };

  const handleSave = () => {
    toast.success('GHG inventory data saved successfully');
  };

  const handleAddCategory = () => {
    toast.info('Add new emission category functionality would be implemented here');
  };

  const renderCategoryForm = (categories: any[], scopeKey: string) => {
    return (
      <div className="space-y-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const data = inventoryData[scopeKey as keyof typeof inventoryData][category.key as keyof any];
          
          return (
            <Card key={category.key}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5" />
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${category.key}-value`}>Emissions Value</Label>
                    <Input
                      id={`${category.key}-value`}
                      type="number"
                      value={data?.value || ''}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${category.key}-unit`}>Unit</Label>
                    <Select value={data?.unit || 'tCO2e'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tCO2e">tCO2e</SelectItem>
                        <SelectItem value="kgCO2e">kgCO2e</SelectItem>
                        <SelectItem value="MtCO2e">MtCO2e</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Value</Label>
                    <div className="h-10 flex items-center">
                      <Badge variant="secondary">
                        {data?.value} {data?.unit}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${category.key}-description`}>Description / Methodology</Label>
                  <Textarea
                    id={`${category.key}-description`}
                    value={data?.description || ''}
                    placeholder="Describe calculation methodology and data sources..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Button variant="outline" onClick={handleAddCategory} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Category
        </Button>
      </div>
    );
  };

  const chartData = getChartData();
  const totalEmissions = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">GHG Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your greenhouse gas emissions across all scopes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      {/* Overview Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emissions Overview - {selectedYear}</CardTitle>
            <CardDescription>Total emissions by scope</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value} tCO2e`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emissions Summary</CardTitle>
            <CardDescription>Key metrics for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Emissions</span>
                <span className="text-lg font-bold">{totalEmissions.toLocaleString()} tCO2e</span>
              </div>
              {chartData.map((scope, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{scope.name}</span>
                  <span className="text-sm">{scope.value.toLocaleString()} tCO2e ({((scope.value / totalEmissions) * 100).toFixed(1)}%)</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Entry Tabs */}
      <Tabs value={selectedScope} onValueChange={setSelectedScope} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scope1" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Scope 1
          </TabsTrigger>
          <TabsTrigger value="scope2" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Scope 2
          </TabsTrigger>
          <TabsTrigger value="scope3" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Scope 3
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scope1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Scope 1: Direct Emissions
              </CardTitle>
              <CardDescription>
                Direct GHG emissions from sources owned or controlled by your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCategoryForm(scope1Categories, 'scope1')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Scope 2: Indirect Energy Emissions
              </CardTitle>
              <CardDescription>
                Indirect GHG emissions from purchased electricity, steam, heating and cooling
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCategoryForm(scope2Categories, 'scope2')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope3" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Scope 3: Other Indirect Emissions
              </CardTitle>
              <CardDescription>
                All other indirect GHG emissions in your value chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCategoryForm(scope3Categories, 'scope3')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GHGInventory;