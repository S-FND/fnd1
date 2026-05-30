import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';
import { cn } from '@/lib/utils';

interface CertificationRow {
  subcategory: string;
  subcategoryExamples: string;
  levels: ('Self' | 'Supplier')[];
}

const CERTIFICATION_ROWS: CertificationRow[] = [
  {
    subcategory: 'Ingredient',
    subcategoryExamples: 'PETA, Vegan, Cruelty Free, MADE SAFE, Fairtrade etc',
    levels: ['Self', 'Supplier'],
  },
  {
    subcategory: 'Packaging',
    subcategoryExamples: 'Plastic Neutral, 100% Recycled (GRS or SCS), FSC, C2C',
    levels: ['Self', 'Supplier'],
  },
  {
    subcategory: 'Energy',
    subcategoryExamples: 'Carbon Neutral, LEED, Energy Star, ISO 50001, etc',
    levels: ['Self', 'Supplier'],
  },
  {
    subcategory: 'Production',
    subcategoryExamples: 'GMP, ISO 14001, ISO 45001, etc',
    levels: ['Self', 'Supplier'],
  },
  {
    subcategory: 'Quality',
    subcategoryExamples: 'ISO 9001 etc',
    levels: ['Self', 'Supplier'],
  },
  {
    subcategory: 'Company Standards',
    subcategoryExamples: 'Great place to work etc',
    levels: ['Self', 'Supplier'],
  },
];

interface CertificationsTableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

export const CertificationsTable = ({
  formData,
  onInputChange,
  readOnly = false,
}: CertificationsTableProps) => {
  const getFieldKey = (subcategory: string, level: string, field: string) =>
    `cert_${subcategory.toLowerCase().replace(/\s+/g, '_')}_${level.toLowerCase()}_${field}`;

  const getValue = (subcategory: string, level: string, field: string) => {
    const key = getFieldKey(subcategory, level, field);
    return (formData[key] as string) || '';
  };

  const isNA = (subcategory: string, level: string) => {
    const key = getFieldKey(subcategory, level, 'na');
    return formData[key] === 'true' || formData[key] === true;
  };

  const handleChange = (subcategory: string, level: string, field: string, value: string) => {
    const key = getFieldKey(subcategory, level, field);
    onInputChange(key, value);
  };

  const handleNAChange = (subcategory: string, level: string, checked: boolean) => {
    const key = getFieldKey(subcategory, level, 'na');
    onInputChange(key, checked ? 'true' : 'false');

    // Clear values when marking as N/A
    if (checked) {
      onInputChange(getFieldKey(subcategory, level, 'number'), '');
      onInputChange(getFieldKey(subcategory, level, 'names'), '');
      onInputChange(getFieldKey(subcategory, level, 'validity'), '');
      onInputChange(getFieldKey(subcategory, level, 'comments'), '');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-esg-environmental" />
            Product/Service Certifications
            <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[220px] text-left font-semibold">
                    Subcategory
                  </TableHead>

                  <TableHead className="w-[100px] text-left font-semibold">
                    Level
                  </TableHead>

                  <TableHead className="w-[70px] text-center font-semibold">
                    N/A
                  </TableHead>

                  <TableHead className="w-[100px] text-left font-semibold">
                    Number
                  </TableHead>

                  <TableHead className="w-[220px] text-left font-semibold">
                    Certificate Names
                  </TableHead>

                  <TableHead className="w-[120px] text-left font-semibold">
                    Validity
                  </TableHead>

                  <TableHead className="w-[220px] text-left font-semibold">
                    Comments
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {CERTIFICATION_ROWS.map((row, rowIndex) =>
                  row.levels.map((level, levelIdx) => {
                    const rowIsNA = isNA(row.subcategory, level);

                    return (
                      <TableRow
                        key={`${row.subcategory}-${level}`}
                        className={cn(
                          "align-top",
                          rowIsNA && "bg-muted/20"
                        )}
                      >
                        {levelIdx === 0 && (
                          <TableCell
                            rowSpan={row.levels.length}
                            className="align-top font-medium bg-muted/20 text-left"
                          >
                            <div className="space-y-1">
                              <div className="flex items-start gap-2">
                                <CellNumberBadge kpiNumber={rowIndex + 1} />

                                <span>{row.subcategory}</span>
                              </div>

                              <p className="text-xs text-muted-foreground ml-7">
                                ({row.subcategoryExamples})
                              </p>
                            </div>
                          </TableCell>
                        )}

                        <TableCell className="py-2 text-left">
                          <Badge
                            variant={level === "Self" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {level}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center py-2">
                          <Checkbox
                            checked={rowIsNA}
                            onCheckedChange={(checked) =>
                              handleNAChange(
                                row.subcategory,
                                level,
                                !!checked
                              )
                            }
                            disabled={readOnly}
                            aria-label={`Mark ${row.subcategory} ${level} as not applicable`}
                          />
                        </TableCell>

                        <TableCell className="py-2 text-left">
                          <Input
                            type="number"
                            placeholder={rowIsNA ? "-" : "0"}
                            value={getValue(
                              row.subcategory,
                              level,
                              "number"
                            )}
                            onChange={(e) =>
                              handleChange(
                                row.subcategory,
                                level,
                                "number",
                                e.target.value
                              )
                            }
                            className="w-20 h-8 text-sm"
                            disabled={readOnly || rowIsNA}
                          />
                        </TableCell>

                        <TableCell className="py-2 text-left">
                          <Input
                            placeholder={
                              rowIsNA
                                ? "-"
                                : "Certificate names"
                            }
                            value={getValue(
                              row.subcategory,
                              level,
                              "names"
                            )}
                            onChange={(e) =>
                              handleChange(
                                row.subcategory,
                                level,
                                "names",
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                            disabled={readOnly || rowIsNA}
                          />
                        </TableCell>

                        <TableCell className="py-2 text-left">
                          <Input
                            placeholder={
                              rowIsNA ? "-" : "Validity"
                            }
                            value={getValue(
                              row.subcategory,
                              level,
                              "validity"
                            )}
                            onChange={(e) =>
                              handleChange(
                                row.subcategory,
                                level,
                                "validity",
                                e.target.value
                              )
                            }
                            className="w-28 h-8 text-sm"
                            disabled={readOnly || rowIsNA}
                          />
                        </TableCell>

                        <TableCell className="py-2 text-left">
                          <Input
                            placeholder={
                              rowIsNA ? "-" : "Comments"
                            }
                            value={getValue(
                              row.subcategory,
                              level,
                              "comments"
                            )}
                            onChange={(e) =>
                              handleChange(
                                row.subcategory,
                                level,
                                "comments",
                                e.target.value
                              )
                            }
                            className="h-8 text-sm"
                            disabled={readOnly || rowIsNA}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Patents/IPs Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-esg-governance" />
            Intellectual Property
            <Badge variant="outline" className="ml-2 text-xs">Annual</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">KPI</TableHead>
                  <TableHead className="w-[150px]">Granted</TableHead>
                  <TableHead className="w-[150px]">Filed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <CellNumberBadge kpiNumber={7} />
                      No. of patents/IPs
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      value={(formData['patents_granted'] as string) || ''}
                      onChange={(e) => onInputChange('patents_granted', e.target.value)}
                      className="w-24 h-8 text-sm"
                      disabled={readOnly}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      value={(formData['patents_filed'] as string) || ''}
                      onChange={(e) => onInputChange('patents_filed', e.target.value)}
                      className="w-24 h-8 text-sm"
                      disabled={readOnly}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
