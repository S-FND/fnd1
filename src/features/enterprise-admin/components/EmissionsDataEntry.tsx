
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PlusCircle, 
  Save, 
  FileUp, 
  Send,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface EmissionSource {
  id: string;
  name: string;
  activityData: string;
  units: string;
  emissionFactor: string;
  notes: string;
}

interface Scope3Source extends EmissionSource {
  category: string;
  partnerInfo: string;
}

interface Scope4Source extends EmissionSource {
  type: 'avoided' | 'enabled';
  justification: string;
  impactDuration: string;
}

const EmissionsDataEntry: React.FC = () => {
  const [activeScope, setActiveScope] = useState<string>("scope1");
  const [scope1Sources, setScope1Sources] = useState<EmissionSource[]>([]);
  const [scope2Sources, setScope2Sources] = useState<EmissionSource[]>([]);
  const [scope3Sources, setScope3Sources] = useState<Scope3Source[]>([]);
  const [scope4Sources, setScope4Sources] = useState<Scope4Source[]>([]);
  const [newSourceName, setNewSourceName] = useState("");
  const [newActivityData, setNewActivityData] = useState("");
  const [newUnits, setNewUnits] = useState("");
  const [newEmissionFactor, setNewEmissionFactor] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newScope3Category, setNewScope3Category] = useState("");
  const [newPartnerInfo, setNewPartnerInfo] = useState("");
  const [newScope4Type, setNewScope4Type] = useState<'avoided' | 'enabled'>('avoided');
  const [newJustification, setNewJustification] = useState("");
  const [newImpactDuration, setNewImpactDuration] = useState("");
  const [industryType, setIndustryType] = useState("manufacturing");

  const industrySpecificScope1Sources = {
    manufacturing: [
      "On-site fuel combustion (natural gas)",
      "On-site fuel combustion (diesel)",
      "Process emissions from chemical reactions",
      "Refrigerant leakage"
    ],
    logistics: [
      "Fuel usage in owned trucks",
      "Fuel usage in owned ships",
      "Refrigerant leakage from transport cooling",
      "On-site equipment fuel usage"
    ],
    healthcare: [
      "Medical gas usage (N₂O)",
      "Medical gas usage (anesthetics)",
      "Diesel for backup generators",
      "On-site waste incineration"
    ],
    offices: [
      "Diesel for backup generators",
      "Refrigerant leakage from HVAC",
      "Natural gas for heating",
      "Company-owned vehicles"
    ],
    retail: [
      "Refrigerants for store cooling",
      "Natural gas for heating stores",
      "Diesel for backup generators",
      "Cooking equipment emissions"
    ],
    agriculture: [
      "Fertilizer applications",
      "Livestock methane emissions",
      "Agricultural equipment fuel usage",
      "Rice cultivation methane"
    ],
    construction: [
      "On-site equipment fuel usage",
      "Temporary heating/power generation",
      "Process emissions from cement/concrete",
      "Refrigerants from temporary HVAC"
    ],
    mining: [
      "Mine methane emissions",
      "Process emissions",
      "Heavy equipment fuel usage",
      "Explosive detonations"
    ],
    hospitality: [
      "Natural gas for cooking",
      "Propane for cooking/heating",
      "Refrigerant leakage",
      "On-site power generation"
    ],
    education: [
      "Laboratory emissions",
      "Campus fleet vehicles",
      "Natural gas for heating",
      "Science department process emissions"
    ]
  };

  const industrySpecificScope2Sources = {
    manufacturing: [
      "Purchased electricity - production lines",
      "Purchased electricity - offices",
      "Purchased steam for industrial processes",
      "District heating"
    ],
    logistics: [
      "Purchased electricity - warehouses",
      "Purchased electricity - distribution centers",
      "Purchased electricity - offices",
      "Purchased heating/cooling"
    ],
    healthcare: [
      "Purchased electricity - medical equipment",
      "Purchased electricity - facilities",
      "Purchased steam/heating",
      "Purchased cooling"
    ],
    offices: [
      "Purchased electricity - lighting",
      "Purchased electricity - computing",
      "Purchased electricity - HVAC",
      "Purchased heating/cooling"
    ],
    retail: [
      "Purchased electricity - stores",
      "Purchased electricity - warehouses",
      "Purchased electricity - refrigeration",
      "Purchased heating/cooling for malls"
    ],
    agriculture: [
      "Purchased electricity - irrigation",
      "Purchased electricity - processing facilities",
      "Purchased electricity - storage cooling",
      "Purchased heating for greenhouses"
    ],
    construction: [
      "Purchased electricity - project sites",
      "Purchased electricity - offices",
      "Temporary grid connections",
      "Purchased steam/heat"
    ],
    mining: [
      "Purchased electricity - extraction operations",
      "Purchased electricity - processing facilities",
      "Purchased electricity - ventilation systems",
      "Purchased steam/heat"
    ],
    hospitality: [
      "Purchased electricity - guest rooms",
      "Purchased electricity - common areas",
      "Purchased electricity - kitchen facilities",
      "Purchased heating/cooling"
    ],
    education: [
      "Purchased electricity - classrooms",
      "Purchased electricity - dormitories",
      "Purchased electricity - research facilities",
      "District heating/cooling"
    ]
  };

  const industrySpecificScope3Sources = {
    manufacturing: [
      "Raw material extraction",
      "Supplier manufacturing emissions",
      "Product transportation",
      "Product use phase emissions",
      "End-of-life treatment"
    ],
    logistics: [
      "Purchased transportation services",
      "Upstream fuel extraction",
      "Vehicle manufacturing emissions",
      "Business travel",
      "Employee commuting"
    ],
    healthcare: [
      "Pharmaceutical manufacturing",
      "Medical device production",
      "Patient travel",
      "Medical waste disposal",
      "Food services"
    ],
    offices: [
      "Employee commuting",
      "Business travel",
      "Purchased IT equipment",
      "Paper consumption",
      "Office waste disposal"
    ],
    retail: [
      "Purchased merchandise production",
      "Packaging materials",
      "Third-party logistics",
      "Customer travel to stores",
      "Product end-of-life"
    ],
    agriculture: [
      "Purchased seed/fertilizer production",
      "Agricultural input transportation",
      "Processing of sold products",
      "Food waste emissions",
      "Land use change"
    ],
    construction: [
      "Raw material extraction/processing",
      "Material transportation",
      "Subcontractor activities",
      "Building operational emissions",
      "End-of-life demolition/disposal"
    ],
    mining: [
      "Supplier equipment manufacturing",
      "Upstream transportation",
      "Processing of sold materials",
      "Business travel",
      "Employee commuting"
    ],
    hospitality: [
      "Food and beverage supply chain",
      "Guest travel",
      "Laundry services",
      "Franchise operations",
      "Waste management"
    ],
    education: [
      "Purchased goods (books, equipment)",
      "Student commuting",
      "Faculty/staff commuting",
      "Business travel",
      "Construction of facilities"
    ]
  };

  const industrySpecificScope4Sources = {
    manufacturing: [
      "Energy-efficient product use",
      "Product recycling programs",
      "Remote work enablement technologies",
      "Digital product substitution"
    ],
    logistics: [
      "Route optimization software",
      "Modal shift enablement",
      "Packaging reduction solutions",
      "Electric vehicle infrastructure"
    ],
    healthcare: [
      "Telehealth services",
      "Preventative care reducing hospitalizations",
      "Energy-efficient medical devices",
      "Reusable medical supply systems"
    ],
    offices: [
      "Remote work technology solutions",
      "Paperless office solutions",
      "Energy management systems",
      "Sustainable procurement platforms"
    ],
    retail: [
      "Online shopping replacing physical travel",
      "Product reuse/repair services",
      "Sustainable product offerings",
      "Package-free solutions"
    ],
    agriculture: [
      "Precision agriculture technologies",
      "Carbon sequestration techniques",
      "Regenerative farming practices",
      "Plant-based alternatives"
    ],
    construction: [
      "Energy-efficient building design",
      "Carbon-negative building materials",
      "Smart building management systems",
      "Circular construction solutions"
    ],
    mining: [
      "Recycled material substitution",
      "Renewable energy installations",
      "Mine rehabilitation projects",
      "Electric mining equipment"
    ],
    hospitality: [
      "Virtual meeting/conference solutions",
      "Water conservation systems",
      "Energy management automation",
      "Food waste reduction programs"
    ],
    education: [
      "Online learning platforms",
      "Digital textbook solutions",
      "Green campus initiatives",
      "Environmental education programs"
    ]
  };

  const scope3Categories = [
    "Purchased goods and services",
    "Capital goods",
    "Fuel- and energy-related activities",
    "Upstream transportation and distribution",
    "Waste generated in operations",
    "Business travel",
    "Employee commuting",
    "Upstream leased assets",
    "Downstream transportation and distribution",
    "Processing of sold products",
    "Use of sold products",
    "End-of-life treatment of sold products",
    "Downstream leased assets",
    "Franchises",
    "Investments"
  ];

  const handleAddScope1Source = () => {
    if (!newSourceName) {
      toast.error("Source name is required");
      return;
    }
    
    const newSource: EmissionSource = {
      id: Date.now().toString(),
      name: newSourceName,
      activityData: newActivityData,
      units: newUnits,
      emissionFactor: newEmissionFactor,
      notes: newNotes
    };
    
    setScope1Sources([...scope1Sources, newSource]);
    resetForm();
    toast.success("Scope 1 emission source added");
  };

  const handleAddScope2Source = () => {
    if (!newSourceName) {
      toast.error("Source name is required");
      return;
    }
    
    const newSource: EmissionSource = {
      id: Date.now().toString(),
      name: newSourceName,
      activityData: newActivityData,
      units: newUnits,
      emissionFactor: newEmissionFactor,
      notes: newNotes
    };
    
    setScope2Sources([...scope2Sources, newSource]);
    resetForm();
    toast.success("Scope 2 emission source added");
  };

  const handleAddScope3Source = () => {
    if (!newSourceName || !newScope3Category) {
      toast.error("Source name and category are required");
      return;
    }
    
    const newSource: Scope3Source = {
      id: Date.now().toString(),
      name: newSourceName,
      activityData: newActivityData,
      units: newUnits,
      emissionFactor: newEmissionFactor,
      notes: newNotes,
      category: newScope3Category,
      partnerInfo: newPartnerInfo
    };
    
    setScope3Sources([...scope3Sources, newSource]);
    resetForm();
    toast.success("Scope 3 emission source added");
  };

  const handleAddScope4Source = () => {
    if (!newSourceName) {
      toast.error("Source name is required");
      return;
    }
    
    const newSource: Scope4Source = {
      id: Date.now().toString(),
      name: newSourceName,
      activityData: newActivityData,
      units: newUnits,
      emissionFactor: newEmissionFactor,
      notes: newNotes,
      type: newScope4Type,
      justification: newJustification,
      impactDuration: newImpactDuration
    };
    
    setScope4Sources([...scope4Sources, newSource]);
    resetForm();
    toast.success("Scope 4 emission source added");
  };

  const handleDeleteSource = (id: string, scope: string) => {
    switch (scope) {
      case "scope1":
        setScope1Sources(scope1Sources.filter(source => source.id !== id));
        break;
      case "scope2":
        setScope2Sources(scope2Sources.filter(source => source.id !== id));
        break;
      case "scope3":
        setScope3Sources(scope3Sources.filter(source => source.id !== id));
        break;
      case "scope4":
        setScope4Sources(scope4Sources.filter(source => source.id !== id));
        break;
      default:
        break;
    }
    toast.info("Emission source removed");
  };

  const handleSaveDraft = () => {
    // In a real app, this would save to database
    toast.success("Emission data saved as draft");
  };

  const handleSubmitForReview = () => {
    // In a real app, this would submit for review
    toast.success("Emission data submitted for review");
  };

  const handleUploadDocuments = () => {
    // In a real app, this would open a file upload dialog
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        toast.success(`${files.length} document(s) uploaded`);
      }
    };
    input.click();
  };

  const resetForm = () => {
    setNewSourceName("");
    setNewActivityData("");
    setNewUnits("");
    setNewEmissionFactor("");
    setNewNotes("");
    setNewScope3Category("");
    setNewPartnerInfo("");
    setNewJustification("");
    setNewImpactDuration("");
  };

  const addSuggestedSource = (source: string) => {
    setNewSourceName(source);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Emissions Data Entry</h2>
          <p className="text-muted-foreground">Enter detailed data for your organization's emissions across all scopes</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="industry-select">Industry Type:</Label>
          <Select value={industryType} onValueChange={setIndustryType}>
            <SelectTrigger className="w-[180px]" id="industry-select">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="logistics">Logistics & Transport</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="offices">Corporate Offices</SelectItem>
              <SelectItem value="retail">Retail & E-commerce</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="mining">Mining & Resources</SelectItem>
              <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeScope} onValueChange={setActiveScope}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="scope1">Scope 1</TabsTrigger>
          <TabsTrigger value="scope2">Scope 2</TabsTrigger>
          <TabsTrigger value="scope3">Scope 3</TabsTrigger>
          <TabsTrigger value="scope4">Scope 4</TabsTrigger>
        </TabsList>

        <TabsContent value="scope1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  Scope 1 – Direct Emissions
                  <Badge className="bg-green-600">Direct</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Enter emissions from sources directly owned or controlled by your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Industry-Specific Suggestions:</Label>
                <div className="flex flex-wrap gap-2">
                  {industrySpecificScope1Sources[industryType as keyof typeof industrySpecificScope1Sources].map((source, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => addSuggestedSource(source)}
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source-name">Source Name *</Label>
                  <Input 
                    id="source-name" 
                    placeholder="e.g., Natural Gas Combustion" 
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-data">Activity Data</Label>
                  <Input 
                    id="activity-data" 
                    placeholder="e.g., 1000" 
                    value={newActivityData}
                    onChange={(e) => setNewActivityData(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Units</Label>
                  <Input 
                    id="units" 
                    placeholder="e.g., kg, liters, kWh" 
                    value={newUnits}
                    onChange={(e) => setNewUnits(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emission-factor">Emission Factor</Label>
                  <Input 
                    id="emission-factor" 
                    placeholder="e.g., 2.31 kg CO2e/liter" 
                    value={newEmissionFactor}
                    onChange={(e) => setNewEmissionFactor(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Additional information about this emission source" 
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleAddScope1Source}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Scope 1 Source
              </Button>

              {scope1Sources.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h3 className="font-medium">Added Scope 1 Sources:</h3>
                  <div className="space-y-2">
                    {scope1Sources.map((source) => (
                      <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {source.activityData} {source.units} | EF: {source.emissionFactor}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteSource(source.id, "scope1")}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  Scope 2 – Indirect Emissions from Energy Use
                  <Badge className="bg-blue-600">Energy Indirect</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Emissions from purchased electricity, steam, heating, and cooling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Industry-Specific Suggestions:</Label>
                <div className="flex flex-wrap gap-2">
                  {industrySpecificScope2Sources[industryType as keyof typeof industrySpecificScope2Sources].map((source, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => addSuggestedSource(source)}
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source-name-s2">Source Name *</Label>
                  <Input 
                    id="source-name-s2" 
                    placeholder="e.g., Purchased Electricity" 
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-data-s2">Consumption Data</Label>
                  <Input 
                    id="activity-data-s2" 
                    placeholder="e.g., 10000" 
                    value={newActivityData}
                    onChange={(e) => setNewActivityData(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units-s2">Units</Label>
                  <Input 
                    id="units-s2" 
                    placeholder="e.g., kWh" 
                    value={newUnits}
                    onChange={(e) => setNewUnits(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emission-factor-s2">Emission Factor</Label>
                  <Input 
                    id="emission-factor-s2" 
                    placeholder="e.g., 0.5 kg CO2e/kWh" 
                    value={newEmissionFactor}
                    onChange={(e) => setNewEmissionFactor(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes-s2">Notes</Label>
                  <Textarea 
                    id="notes-s2" 
                    placeholder="Additional information about this emission source" 
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleAddScope2Source}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Scope 2 Source
              </Button>

              {scope2Sources.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h3 className="font-medium">Added Scope 2 Sources:</h3>
                  <div className="space-y-2">
                    {scope2Sources.map((source) => (
                      <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {source.activityData} {source.units} | EF: {source.emissionFactor}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteSource(source.id, "scope2")}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope3" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  Scope 3 – Other Indirect Emissions
                  <Badge className="bg-orange-600">Value Chain</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                All other indirect emissions that occur in your value chain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Industry-Specific Suggestions:</Label>
                <div className="flex flex-wrap gap-2">
                  {industrySpecificScope3Sources[industryType as keyof typeof industrySpecificScope3Sources].map((source, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => addSuggestedSource(source)}
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scope3-category">Scope 3 Category *</Label>
                  <Select value={newScope3Category} onValueChange={setNewScope3Category}>
                    <SelectTrigger id="scope3-category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {scope3Categories.map((category, index) => (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-name-s3">Source Name *</Label>
                  <Input 
                    id="source-name-s3" 
                    placeholder="e.g., Business Travel" 
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-data-s3">Activity Data</Label>
                  <Input 
                    id="activity-data-s3" 
                    placeholder="e.g., 50000" 
                    value={newActivityData}
                    onChange={(e) => setNewActivityData(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units-s3">Units</Label>
                  <Input 
                    id="units-s3" 
                    placeholder="e.g., passenger-km" 
                    value={newUnits}
                    onChange={(e) => setNewUnits(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emission-factor-s3">Emission Factor</Label>
                  <Input 
                    id="emission-factor-s3" 
                    placeholder="e.g., 0.1 kg CO2e/passenger-km" 
                    value={newEmissionFactor}
                    onChange={(e) => setNewEmissionFactor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner-info">Partner/Vendor Info</Label>
                  <Input 
                    id="partner-info" 
                    placeholder="e.g., Airline name, supplier details" 
                    value={newPartnerInfo}
                    onChange={(e) => setNewPartnerInfo(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes-s3">Notes</Label>
                  <Textarea 
                    id="notes-s3" 
                    placeholder="Additional information about this emission source" 
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleAddScope3Source}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Scope 3 Source
              </Button>

              {scope3Sources.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h3 className="font-medium">Added Scope 3 Sources:</h3>
                  <div className="space-y-2">
                    {scope3Sources.map((source) => (
                      <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {source.category} | {source.activityData} {source.units}
                          </p>
                          {source.partnerInfo && (
                            <p className="text-xs text-muted-foreground">Partner: {source.partnerInfo}</p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteSource(source.id, "scope3")}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope4" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  Scope 4 – Avoided/Enabling Emissions
                  <Badge className="bg-purple-600">Optional</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Estimate of emissions avoided due to your products/services or emissions enabled by operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Industry-Specific Suggestions:</Label>
                <div className="flex flex-wrap gap-2">
                  {industrySpecificScope4Sources[industryType as keyof typeof industrySpecificScope4Sources].map((source, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => addSuggestedSource(source)}
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scope4-type">Type</Label>
                  <Select value={newScope4Type} onValueChange={(value: 'avoided' | 'enabled') => setNewScope4Type(value)}>
                    <SelectTrigger id="scope4-type">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avoided">Avoided Emissions</SelectItem>
                      <SelectItem value="enabled">Enabled/Facilitated Emissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-name-s4">Source Name *</Label>
                  <Input 
                    id="source-name-s4" 
                    placeholder="e.g., Remote Work Solution" 
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea 
                    id="justification" 
                    placeholder="Explain how this source avoids/enables emissions" 
                    value={newJustification}
                    onChange={(e) => setNewJustification(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact-duration">Impact Duration</Label>
                  <Input 
                    id="impact-duration" 
                    placeholder="e.g., 5 years" 
                    value={newImpactDuration}
                    onChange={(e) => setNewImpactDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-data-s4">Activity Data</Label>
                  <Input 
                    id="activity-data-s4" 
                    placeholder="Quantified activity" 
                    value={newActivityData}
                    onChange={(e) => setNewActivityData(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units-s4">Units</Label>
                  <Input 
                    id="units-s4" 
                    placeholder="e.g., tons CO2e avoided" 
                    value={newUnits}
                    onChange={(e) => setNewUnits(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes-s4">Notes</Label>
                  <Textarea 
                    id="notes-s4" 
                    placeholder="Additional information about this emission source" 
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleAddScope4Source}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Scope 4 Source
              </Button>

              {scope4Sources.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h3 className="font-medium">Added Scope 4 Sources:</h3>
                  <div className="space-y-2">
                    {scope4Sources.map((source) => (
                      <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">
                            {source.name} 
                            <Badge variant="outline" className="ml-2">
                              {source.type === 'avoided' ? 'Avoided' : 'Enabled'}
                            </Badge>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {source.activityData} {source.units}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Duration: {source.impactDuration}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteSource(source.id, "scope4")}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="h-4 w-4 mr-2" /> Save Draft
        </Button>
        <Button variant="outline" onClick={handleUploadDocuments}>
          <FileUp className="h-4 w-4 mr-2" /> Upload Supporting Documents
        </Button>
        <Button onClick={handleSubmitForReview}>
          <Send className="h-4 w-4 mr-2" /> Submit for Review
        </Button>
      </div>
    </div>
  );
};

export default EmissionsDataEntry;
