import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { MeasurementFrequency, generatePeriodNames } from '@/types/ghg-data-collection';

interface FrequencySelectorProps {
  value: MeasurementFrequency;
  onChange: (frequency: MeasurementFrequency) => void;
  defaultFrequency?: MeasurementFrequency;
  showPeriodCount?: boolean;
}

const FREQUENCY_OPTIONS: { value: MeasurementFrequency; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'Weekly', label: 'Weekly', icon: <CalendarDays className="h-4 w-4" />, description: '52 periods per year' },
  { value: 'Monthly', label: 'Monthly', icon: <Calendar className="h-4 w-4" />, description: '12 periods per year' },
  { value: 'Quarterly', label: 'Quarterly', icon: <CalendarRange className="h-4 w-4" />, description: '4 periods per year' },
  { value: 'Annually', label: 'Annually', icon: <CalendarRange className="h-4 w-4" />, description: '1 period per year' },
];

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  value,
  onChange,
  defaultFrequency,
  showPeriodCount = true,
}) => {
  const periodNames = generatePeriodNames(value);
  const periodCount = periodNames.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Data Entry Frequency</Label>
        {defaultFrequency && value !== defaultFrequency && (
          <Badge variant="outline" className="text-xs">
            Source default: {defaultFrequency}
          </Badge>
        )}
      </div>
      <Select value={value} onValueChange={(val) => onChange(val as MeasurementFrequency)}>
        <SelectTrigger>
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          {FREQUENCY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
                <span className="text-muted-foreground text-xs">({option.description})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showPeriodCount && (
        <p className="text-sm text-muted-foreground">
          You will enter data for <strong>{periodCount}</strong> period{periodCount !== 1 ? 's' : ''}
          {periodCount <= 12 && (
            <span className="ml-1">
              ({periodNames.slice(0, 4).join(', ')}{periodCount > 4 ? `, ...` : ''})
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export default FrequencySelector;
