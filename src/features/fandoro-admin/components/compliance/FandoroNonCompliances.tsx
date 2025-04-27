
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import NonCompliances from '@/features/fandoro-admin/components/lists/NonCompliancesList';

const FandoroNonCompliances = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Top Non-Compliances</CardTitle>
          <CardDescription>Critical non-compliances across enterprises</CardDescription>
        </div>
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </CardHeader>
      <CardContent>
        <NonCompliances />
      </CardContent>
    </Card>
  );
};

export default FandoroNonCompliances;
