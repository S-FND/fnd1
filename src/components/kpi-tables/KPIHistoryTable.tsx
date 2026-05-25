import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoricalEntry {
  quarter: string;
  value: string | null;
  confidence?: number;
}

interface KPIHistoryTableProps {
  entries: HistoricalEntry[];
  className?: string;
}

export const KPIHistoryTable = ({ entries, className }: KPIHistoryTableProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic py-1">
        No historical data
      </div>
    );
  }

  // Sort by quarter descending (most recent first)
  const sortedEntries = [...entries].sort((a, b) => {
    const parseQuarter = (q: string) => {
      const match = q.match(/([A-Z]{3})'?(\d{2})/i);
      if (match) {
        const monthOrder: Record<string, number> = {
          'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
          'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12,
          'AMJ': 4, 'JAS': 7, 'OND': 10, 'JFM': 1
        };
        const month = monthOrder[match[1].toUpperCase()] || 1;
        const year = parseInt(match[2]) + 2000;
        return year * 100 + month;
      }
      return 0;
    };
    return parseQuarter(b.quarter) - parseQuarter(a.quarter);
  });

  // Only show last 4 quarters max
  const displayEntries = sortedEntries.slice(0, 4);

  return (
    <div className={cn("rounded border border-border/50 overflow-hidden bg-muted/20", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 h-7">
            <TableHead className="text-[10px] font-medium py-1 px-2 w-[60px]">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Period
              </div>
            </TableHead>
            <TableHead className="text-[10px] font-medium py-1 px-2">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayEntries.map((entry, idx) => (
            <TableRow key={`${entry.quarter}-${idx}`} className="h-6">
              <TableCell className="text-[10px] py-1 px-2">
                <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                  {entry.quarter}
                </Badge>
              </TableCell>
              <TableCell className="text-[11px] py-1 px-2 font-medium">
                {entry.value || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
