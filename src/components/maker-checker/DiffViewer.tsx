import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DiffField } from '@/types/maker-checker';
import { AlertCircle } from 'lucide-react';

interface DiffViewerProps {
  differences: DiffField[];
  title?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ differences, title = 'Changes' }) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '(empty)';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  if (differences.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>No changes detected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {title}
          <Badge variant="secondary">{differences.length} field(s) changed</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {differences.map((diff, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="font-medium text-sm text-primary capitalize">
              {diff.field.replace(/_/g, ' ')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase">Previous Value</div>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm">
                  <pre className="whitespace-pre-wrap break-words text-destructive">
                    {formatValue(diff.old_value)}
                  </pre>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase">New Value</div>
                <div className="p-3 bg-success/10 border border-success/20 rounded text-sm">
                  <pre className="whitespace-pre-wrap break-words text-success">
                    {formatValue(diff.new_value)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
