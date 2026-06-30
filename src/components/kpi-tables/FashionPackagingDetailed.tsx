import { Input } from '@/components/ui/input';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Shirt, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { CellNumberBadge } from './CellNumberBadge';

interface FashionPackagingDetailedProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (key: string, value: string) => void;
  readOnly?: boolean;
}

// Secondary Packaging
const SECONDARY_PACKAGING_FIELDS = [
  { id: 'secondary_total_material', label: 'Total amount of packaging material used for secondary packaging', type: 'number', unit: 'MT', kpiNumber: 5, fieldLetter: 'a' },
];

const SECONDARY_BREAKUP_FIELDS = [
  { id: 'secondary_plastic_virgin', label: 'Plastic (virgin)', type: 'number', unit: '%', fieldLetter: 'b' },
  { id: 'secondary_plastic_recycled', label: 'Plastic (recycled)', type: 'number', unit: '%', fieldLetter: 'c' },
  { id: 'secondary_paper_virgin', label: 'Paper (virgin)', type: 'number', unit: '%', fieldLetter: 'd' },
  { id: 'secondary_paper_recycled', label: 'Paper (recycled)', type: 'number', unit: '%', fieldLetter: 'e' },
  { id: 'secondary_fabric', label: 'Fabric', type: 'number', unit: '%', fieldLetter: 'f' },
  { id: 'secondary_others', label: 'Others, please specify', type: 'text', unit: '%', fieldLetter: 'g' },
];

export const FashionPackagingDetailed = ({
  formData,
  onInputChange,
  readOnly = false,
}: FashionPackagingDetailedProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const getFieldKey = (section: string, id: string) => `fashion_pkg_detailed_${section}_${id}`;

  const getValue = (section: string, id: string) => {
    const key = getFieldKey(section, id);
    return (formData[key] as string) || '';
  };

  const handleChange = (section: string, id: string, value: string) => {
    const key = getFieldKey(section, id);
    onInputChange(key, value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Shirt className="w-4 h-4 text-esg-environmental" />
          Secondary Packaging Metrics
          <Badge variant="outline" className="ml-2 text-xs">Quarterly</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Secondary Packaging metrics.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full px-4 py-3 bg-muted/50 border-b flex items-center justify-between hover:bg-muted/70 transition-colors">
            <h4 className="text-sm font-medium flex items-center">
              <CellNumberBadge kpiNumber={5} />
              Secondary Packaging
            </h4>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="min-w-[380px] text-left font-semibold">
                      Metric
                    </TableHead>

                    <TableHead className="w-[120px] text-left font-semibold">
                      Unit
                    </TableHead>

                    <TableHead className="w-[260px] text-left font-semibold">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {/* SECONDARY PACKAGING */}
                  {SECONDARY_PACKAGING_FIELDS.map((field) => (
                    <TableRow key={field.id} className="align-top">
                      {/* METRIC */}
                      <TableCell className="font-medium text-left">
                        <div className="flex items-start gap-2">
                          <CellNumberBadge
                            kpiNumber={field.kpiNumber}
                            fieldLetter={field.fieldLetter}
                          />

                          <span>{field.label}</span>
                        </div>
                      </TableCell>

                      {/* UNIT */}
                      <TableCell className="text-left">
                        <Badge variant="secondary" className="text-xs">
                          {field.unit}
                        </Badge>
                      </TableCell>

                      {/* VALUE */}
                      <TableCell className="text-left">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={getValue("secondary", field.id)}
                            onChange={(e) =>
                              handleChange(
                                "secondary",
                                field.id,
                                e.target.value
                              )
                            }
                            className="w-40 h-9 text-sm"
                            disabled={readOnly}
                          />

                          <span className="text-xs text-muted-foreground">
                            {field.unit}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* BREAKUP HEADER */}
                  <TableRow className="bg-blue-50/60 dark:bg-blue-950/20">
                    <TableCell
                      colSpan={3}
                      className="font-semibold text-left py-3"
                    >
                      Breakup of materials used for secondary packaging (%)
                    </TableCell>
                  </TableRow>

                  {/* BREAKUP FIELDS */}
                  {SECONDARY_BREAKUP_FIELDS.map((field) => (
                    <TableRow key={field.id} className="align-top">
                      {/* METRIC */}
                      <TableCell className="font-medium text-left pl-8">
                        <div className="flex items-start gap-2">
                          <CellNumberBadge
                            kpiNumber={5}
                            fieldLetter={field.fieldLetter}
                          />

                          <span>{field.label}</span>
                        </div>
                      </TableCell>

                      {/* UNIT */}
                      <TableCell className="text-left">
                        <Badge variant="secondary" className="text-xs">
                          {field.unit}
                        </Badge>
                      </TableCell>

                      {/* VALUE */}
                      <TableCell className="text-left">
                        {field.type === "number" ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="0"
                              value={getValue(
                                "secondary_breakup",
                                field.id
                              )}
                              onChange={(e) =>
                                handleChange(
                                  "secondary_breakup",
                                  field.id,
                                  e.target.value
                                )
                              }
                              className="w-32 h-9 text-sm"
                              disabled={readOnly}
                              min={0}
                              max={100}
                            />

                            <span className="text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        ) : (
                          <Input
                            type="text"
                            placeholder="Specify type and %..."
                            value={getValue(
                              "secondary_breakup",
                              field.id
                            )}
                            onChange={(e) =>
                              handleChange(
                                "secondary_breakup",
                                field.id,
                                e.target.value
                              )
                            }
                            className="h-9 text-sm"
                            disabled={readOnly}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
