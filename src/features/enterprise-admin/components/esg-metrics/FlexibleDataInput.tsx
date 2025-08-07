import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ESGMetricWithTracking } from '../../data/esgMetricsData';

interface FlexibleDataInputProps {
  metric: ESGMetricWithTracking;
  value: any;
  onChange: (value: any) => void;
}

const FlexibleDataInput: React.FC<FlexibleDataInputProps> = ({ metric, value, onChange }) => {
  const [tableData, setTableData] = useState<string[][]>(() => {
    if (metric.dataType === 'Table' && value && Array.isArray(value)) {
      return value;
    }
    const rows = metric.inputFormat?.tableRows || 1;
    const cols = metric.inputFormat?.tableColumns || [];
    return Array(rows).fill(null).map(() => Array(cols.length).fill(''));
  });

  const handleTableChange = (rowIndex: number, colIndex: number, cellValue: string) => {
    const newTableData = [...tableData];
    newTableData[rowIndex][colIndex] = cellValue;
    setTableData(newTableData);
    onChange(newTableData);
  };

  const addTableRow = () => {
    const cols = metric.inputFormat?.tableColumns || [];
    const newRow = Array(cols.length).fill('');
    const newTableData = [...tableData, newRow];
    setTableData(newTableData);
    onChange(newTableData);
  };

  const removeTableRow = (rowIndex: number) => {
    const newTableData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(newTableData);
    onChange(newTableData);
  };

  const renderInput = () => {
    switch (metric.dataType) {
      case 'Numeric':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter value in ${metric.unit}`}
          />
        );

      case 'Percentage':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter percentage"
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        );

      case 'Text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter text description"
            rows={3}
          />
        );

      case 'Boolean':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Yes or No" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'Dropdown':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {metric.inputFormat?.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              )) || null}
            </SelectContent>
          </Select>
        );

      case 'Radio':
        return (
          <RadioGroup value={value || ''} onValueChange={onChange}>
            {metric.inputFormat?.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`radio-${index}`} />
                <Label htmlFor={`radio-${index}`}>{option}</Label>
              </div>
            )) || null}
          </RadioGroup>
        );

      case 'Table':
        const columns = metric.inputFormat?.tableColumns || [];
        return (
          <div className="space-y-4">
            {columns.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column, index) => (
                        <TableHead key={index}>{column}</TableHead>
                      ))}
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <TableCell key={colIndex} className="p-2">
                            <Input
                              value={cell}
                              onChange={(e) => handleTableChange(rowIndex, colIndex, e.target.value)}
                              placeholder={`Enter ${columns[colIndex]}`}
                            />
                          </TableCell>
                        ))}
                        <TableCell className="p-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTableRow(rowIndex)}
                            disabled={tableData.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addTableRow}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Row
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>No table columns configured for this metric</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter value"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {metric.name} {metric.unit && `(${metric.unit})`}
        </Label>
        <span className="text-xs text-muted-foreground">
          {metric.dataType}
        </span>
      </div>
      {renderInput()}
      {metric.description && (
        <p className="text-xs text-muted-foreground">{metric.description}</p>
      )}
    </div>
  );
};

export default FlexibleDataInput;