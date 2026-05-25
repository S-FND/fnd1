import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface AdditionalCommentsSectionProps {
  featureKey: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const AdditionalCommentsSection = ({
  featureKey,
  value,
  onChange,
  readOnly = false,
}: AdditionalCommentsSectionProps) => {
  const kpiId = `${featureKey}_additional_comments`;
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          Additional Comments
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">
          Add any additional details, context, or information not covered elsewhere
        </p>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter any additional comments or details here..."
          className="min-h-[80px] resize-y text-sm"
          disabled={readOnly}
        />
        <p className="text-[10px] text-muted-foreground mt-1 text-right">
          {value.length} characters
        </p>
      </CardContent>
    </Card>
  );
};
