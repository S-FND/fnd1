
import { Button } from '@/components/ui/button';
import { Search, ClipboardList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface AuditActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const AuditActions = ({ searchTerm, onSearchChange }: AuditActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <Button asChild>
          <Link to="/audit/checklist">
            <ClipboardList className="mr-2 h-4 w-4" />
            Audit Checklists
          </Link>
        </Button>
        <Button>
          <ClipboardList className="mr-2 h-4 w-4" />
          New Audit
        </Button>
      </div>
    </div>
  );
};

export default AuditActions;
