
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";
import ESGRisksList from '@/features/fandoro-admin/components/lists/ESGRisksList';

const FandoroESGRisks = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Top ESG Risks</CardTitle>
          <CardDescription>Critical ESG risks across enterprises</CardDescription>
        </div>
        <Shield className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent>
        <ESGRisksList />
      </CardContent>
    </Card>
  );
};

export default FandoroESGRisks;
