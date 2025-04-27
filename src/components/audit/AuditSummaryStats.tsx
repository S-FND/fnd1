
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';

interface AuditSummaryStatsProps {
  suppliers: Array<{
    id: string;
    status: string;
    score?: number;
  }>;
}

const AuditSummaryStats = ({ suppliers }: AuditSummaryStatsProps) => {
  const completedAudits = suppliers.filter(s => s.status === 'completed').length;
  const inProgressAudits = suppliers.filter(s => s.status === 'in_progress').length;
  const averageScore = suppliers.filter(s => s.score).length > 0 
    ? Math.round(suppliers.reduce((acc, curr) => acc + (curr.score || 0), 0) / suppliers.filter(s => s.score).length) 
    : '-';

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{suppliers.length}</div>
          <p className="text-xs text-muted-foreground">All registered suppliers</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Completed Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedAudits}</div>
          <div className="flex items-center gap-1">
            <CheckCircle className="text-green-500 h-3 w-3" />
            <span className="text-xs text-muted-foreground">Fully compliant</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressAudits}</div>
          <div className="flex items-center gap-1">
            <Clock className="text-blue-500 h-3 w-3" />
            <span className="text-xs text-muted-foreground">Currently being audited</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageScore}</div>
          <p className="text-xs text-muted-foreground">Out of 100 points</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditSummaryStats;
