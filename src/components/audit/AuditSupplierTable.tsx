
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  status: 'pending' | 'in_progress' | 'completed' | 'not_started';
  score?: number;
  lastUpdated: string;
}

interface AuditSupplierTableProps {
  suppliers: Supplier[];
  handleSendReminder: (supplierName: string) => void;
  handleStartAudit: (supplierId: string) => void;
}

const AuditSupplierTable = ({ suppliers, handleSendReminder, handleStartAudit }: AuditSupplierTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Not Started</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-left font-medium">Supplier</th>
              <th className="h-10 px-4 text-left font-medium">Category</th>
              <th className="h-10 px-4 text-left font-medium">Contact</th>
              <th className="h-10 px-4 text-left font-medium">Status</th>
              <th className="h-10 px-4 text-left font-medium">Last Updated</th>
              <th className="h-10 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 font-medium">{supplier.name}</td>
                <td className="p-4">{supplier.category}</td>
                <td className="p-4">{supplier.contact}</td>
                <td className="p-4">{getStatusBadge(supplier.status)}</td>
                <td className="p-4">{supplier.lastUpdated}</td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toast.success(`Viewing audit for ${supplier.name}`)}>
                        View Audit
                      </DropdownMenuItem>
                      {supplier.status === 'not_started' && (
                        <DropdownMenuItem onClick={() => handleStartAudit(supplier.id)}>
                          Start Audit
                        </DropdownMenuItem>
                      )}
                      {(supplier.status === 'pending' || supplier.status === 'in_progress') && (
                        <DropdownMenuItem onClick={() => handleSendReminder(supplier.name)}>
                          Send Reminder
                        </DropdownMenuItem>
                      )}
                      {supplier.status === 'completed' && (
                        <DropdownMenuItem onClick={() => toast.success(`Downloading report for ${supplier.name}`)}>
                          Download Report
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditSupplierTable;
