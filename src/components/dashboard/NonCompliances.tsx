
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from "lucide-react";

const mockNonCompliances = [
  {
    id: 1,
    title: "Air Quality Monitoring",
    regulation: "Environmental Protection Act",
    severity: "High",
    status: "Open",
    dueDate: "2024-05-15",
  },
  {
    id: 2,
    title: "Hazardous Waste Management",
    regulation: "Waste Management Rules",
    severity: "High",
    status: "In Progress",
    dueDate: "2024-05-20",
  },
  {
    id: 3,
    title: "Worker Safety Training",
    regulation: "Occupational Safety Act",
    severity: "Medium",
    status: "Open",
    dueDate: "2024-05-25",
  },
  {
    id: 4,
    title: "Emissions Reporting",
    regulation: "Clean Air Act",
    severity: "High",
    status: "Open",
    dueDate: "2024-06-01",
  },
  {
    id: 5,
    title: "Water Discharge Permits",
    regulation: "Water Act",
    severity: "Medium",
    status: "In Progress",
    dueDate: "2024-05-30",
  },
];

const NonCompliances = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top Regulatory Non-Compliances</CardTitle>
            <CardDescription>Critical regulatory misses requiring immediate attention</CardDescription>
          </div>
          <ShieldAlert className="h-5 w-5 text-red-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNonCompliances.map((nc) => (
            <div key={nc.id} className="flex items-start justify-between border-b pb-4 last:border-0">
              <div className="space-y-1">
                <p className="font-medium">{nc.title}</p>
                <p className="text-sm text-muted-foreground">{nc.regulation}</p>
                <div className="flex gap-2 mt-1">
                  <Badge 
                    variant={nc.severity === "High" ? "destructive" : "secondary"}
                  >
                    {nc.severity} Severity
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={nc.status === "Open" ? "border-red-500 text-red-700" : "border-amber-500 text-amber-700"}
                  >
                    {nc.status}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Due: {new Date(nc.dueDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NonCompliances;
