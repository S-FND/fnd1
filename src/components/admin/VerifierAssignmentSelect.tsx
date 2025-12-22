import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck } from 'lucide-react';

interface Verifier {
  user_id: string;
  full_name: string | null;
  email: string;
}

interface VerifierAssignmentSelectProps {
  verifiers: Verifier[];
  currentVerifierId?: string;
  onAssign: (verifierId: string) => void;
  disabled?: boolean;
}

export const VerifierAssignmentSelect: React.FC<VerifierAssignmentSelectProps> = ({
  verifiers,
  currentVerifierId,
  onAssign,
  disabled = false,
}) => {
  return (
    <Select
      value={currentVerifierId || 'unassigned'}
      onValueChange={(value) => {
        if (value !== 'unassigned') {
          onAssign(value);
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Assign Verifier" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned" disabled>
          <span className="text-muted-foreground">Select Verifier</span>
        </SelectItem>
        {verifiers.map((v) => (
          <SelectItem key={v.user_id} value={v.user_id}>
            {v.full_name || v.email}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
