
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf } from "lucide-react";

const mockInitiatives = [
  {
    id: 1,
    name: "Renewable Energy Transition",
    category: "Environmental",
    progress: 85,
    impact: "High",
  },
  {
    id: 2,
    name: "Zero Waste Program",
    category: "Environmental",
    progress: 78,
    impact: "Medium",
  },
  {
    id: 3,
    name: "Sustainable Supply Chain",
    category: "Social",
    progress: 72,
    impact: "High",
  },
  {
    id: 4,
    name: "Employee Sustainability Training",
    category: "Social",
    progress: 70,
    impact: "Medium",
  },
  {
    id: 5,
    name: "Carbon Footprint Reduction",
    category: "Environmental",
    progress: 68,
    impact: "High",
  },
];

const SustainabilityInitiatives = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top Sustainability Initiatives</CardTitle>
            <CardDescription>Highest performing sustainability programs</CardDescription>
          </div>
          <Leaf className="h-5 w-5 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockInitiatives.map((initiative) => (
            <div key={initiative.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{initiative.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {initiative.category}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        initiative.impact === 'High' 
                          ? 'border-green-500 text-green-700' 
                          : 'border-blue-500 text-blue-700'
                      }`}
                    >
                      {initiative.impact} Impact
                    </Badge>
                  </div>
                </div>
                <span className="text-sm font-medium">{initiative.progress}%</span>
              </div>
              <Progress value={initiative.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SustainabilityInitiatives;
