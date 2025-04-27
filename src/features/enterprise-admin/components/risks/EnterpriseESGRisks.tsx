
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldBan } from "lucide-react";

const mockESGRisks = [
  {
    id: 1,
    title: "Carbon Emissions Exceedance",
    category: "Environmental",
    riskIndex: 85,
    impact: "High",
    description: "Significant increase in Scope 1 & 2 emissions",
  },
  {
    id: 2,
    title: "Supply Chain Labor Issues",
    category: "Social",
    riskIndex: 78,
    impact: "High",
    description: "Worker rights violations in tier 2 suppliers",
  },
  {
    id: 3,
    title: "Board Diversity Gap",
    category: "Governance",
    riskIndex: 72,
    impact: "Medium",
    description: "Insufficient diversity in board composition",
  },
  {
    id: 4,
    title: "Water Stress Exposure",
    category: "Environmental",
    riskIndex: 70,
    impact: "High",
    description: "Operations in high water-stress regions",
  },
  {
    id: 5,
    title: "Data Privacy Concerns",
    category: "Governance",
    riskIndex: 68,
    impact: "Medium",
    description: "Gaps in customer data protection measures",
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Environmental":
      return "bg-green-500";
    case "Social":
      return "bg-blue-500";
    case "Governance":
      return "bg-amber-500";
    default:
      return "bg-gray-500";
  }
};

const EnterpriseESGRisks = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top ESG Risks</CardTitle>
            <CardDescription>Critical ESG risks requiring mitigation</CardDescription>
          </div>
          <ShieldBan className="h-5 w-5 text-red-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockESGRisks.map((risk) => (
            <div key={risk.id} className="space-y-2 border-b pb-4 last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getCategoryColor(risk.category)}`} />
                    <p className="font-medium">{risk.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                </div>
                <Badge variant="secondary">
                  Risk Index: {risk.riskIndex}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{risk.category}</Badge>
                <Badge 
                  variant="outline" 
                  className={risk.impact === "High" ? "border-red-500 text-red-700" : "border-amber-500 text-amber-700"}
                >
                  {risk.impact} Impact
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterpriseESGRisks;
