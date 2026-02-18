
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { industries, revenueSizes, vcPartners } from '../data/industries';
import { sampleMachineDDResult, IRLItem, MachineDDInput } from '../data/mockMachineDD';
import { ArrowLeft, ArrowRight, Bot, Building2, Check, CheckCircle2, Download, FileSearch, FileText, AlertTriangle, Loader2, Plus, Sparkles, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

type Step = 'input' | 'generating' | 'irl' | 'dataroom' | 'report' | 'cap';

const categoryColors: Record<string, string> = {
  environmental: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  social: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  governance: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const sourceColors: Record<string, string> = {
  SASB: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'GRI 306': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  'GRI 401': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  'GRI 205': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  Regulation: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'VC Policy': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
};

const statusIcons: Record<string, React.ReactNode> = {
  matched: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  partial: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  missing: <XCircle className="h-4 w-4 text-destructive" />,
  pending: <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />,
};

export const MachineDDWizard: React.FC = () => {
  const [step, setStep] = useState<Step>('input');
  const [input, setInput] = useState<MachineDDInput>({ companyName: '', revenueSize: '', industry: '', vcPartner: '' });
  const [progress, setProgress] = useState(0);
  const [selectedCapItems, setSelectedCapItems] = useState<string[]>([]);
  const [capAdded, setCapAdded] = useState(false);

  const result = sampleMachineDDResult;

  const canProceed = input.companyName && input.revenueSize && input.industry;

  const handleGenerate = () => {
    setStep('generating');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setStep('irl'), 600);
      }
      setProgress(Math.min(p, 100));
    }, 400);
  };

  const handleDownloadReport = () => {
    const companyName = input.companyName || result.input.companyName;
    const doc = new jsPDF();
    let y = 20;

    const addLine = (text: string, fontSize = 10, bold = false) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, 20, y);
      y += lines.length * (fontSize * 0.5) + 2;
    };

    const addSpacer = (h = 6) => { y += h; };

    // Title
    addLine('ESGDD Report (Machine)', 18, true);
    addLine(companyName, 14, true);
    addLine(`Generated: ${new Date().toLocaleDateString()}`, 9);
    addSpacer(4);
    doc.setDrawColor(200); doc.line(20, y, 190, y); addSpacer(6);

    // Executive Summary
    addLine('Executive Summary', 13, true);
    addLine(result.report.summary);
    addSpacer();

    // Scorecard
    addLine('Scorecard', 13, true);
    addLine(`Total IRL Items: ${irlStats.total}`);
    addLine(`Matched: ${irlStats.matched}  |  Partial: ${irlStats.partial}  |  Missing: ${irlStats.missing}`);
    addLine(`Average Match Score: ${overallScore}%`);
    addLine(`CAP Items Generated: ${result.capItems.length}`);
    addSpacer();

    // Category Breakdown
    (['environmental', 'social', 'governance'] as const).forEach(cat => {
      const items = result.irlItems.filter(i => i.category === cat);
      const matched = items.filter(i => i.status === 'matched').length;
      const partial = items.filter(i => i.status === 'partial').length;
      const missing = items.filter(i => i.status === 'missing').length;
      addLine(`${cat.charAt(0).toUpperCase() + cat.slice(1)} (${items.length} items)`, 11, true);
      addLine(`  Matched: ${matched}  |  Partial: ${partial}  |  Missing: ${missing}`);
    });
    addSpacer();

    // IRL Details
    doc.addPage(); y = 20;
    addLine('Information Request List (IRL)', 14, true);
    addSpacer(4);
    result.irlItems.forEach((item, idx) => {
      addLine(`${idx + 1}. ${item.requirement} [${item.source}] — ${item.category}`, 10, true);
      addLine(`   ${item.description}`);
      addLine(`   Expected: ${item.documentExpected}`);
      addLine(`   Status: ${item.status}${item.matchedDocument ? ` | Doc: ${item.matchedDocument}` : ''}${item.matchScore !== undefined ? ` | Score: ${item.matchScore}%` : ''}`);
      addSpacer(3);
    });

    // CAP Items
    doc.addPage(); y = 20;
    addLine('ESG Corrective Action Plan', 14, true);
    addSpacer(4);
    result.capItems.forEach((item, idx) => {
      addLine(`${idx + 1}. ${item.issue} [${item.priority.toUpperCase()}]`, 10, true);
      addLine(`   ${item.description}`);
      addLine(`   Recommendation: ${item.recommendation}`);
      addLine(`   Assigned: ${item.assignedTo}  |  Deadline: ${item.deadline}  |  Condition: ${item.dealCondition}`);
      addSpacer(3);
    });

    doc.save(`ESGDD_Report_Machine_${companyName.replace(/\s+/g, '_')}.pdf`);
    toast.success('ESG DD Report downloaded as PDF');
  };

  const handleAddToTracker = () => {
    setCapAdded(true);
    toast.success(`${selectedCapItems.length || result.capItems.length} CAP items added to ESG CAP Tracker (Author: Machine)`);
  };

  const toggleCapItem = (id: string) => {
    setSelectedCapItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAllCap = () => {
    if (selectedCapItems.length === result.capItems.length) {
      setSelectedCapItems([]);
    } else {
      setSelectedCapItems(result.capItems.map(c => c.id));
    }
  };

  const irlStats = {
    total: result.irlItems.length,
    matched: result.irlItems.filter(i => i.status === 'matched').length,
    partial: result.irlItems.filter(i => i.status === 'partial').length,
    missing: result.irlItems.filter(i => i.status === 'missing').length,
  };

  const overallScore = Math.round(
    result.irlItems.reduce((sum, i) => sum + (i.matchScore || 0), 0) / result.irlItems.filter(i => i.matchScore).length
  );

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {(['input', 'generating', 'irl', 'dataroom', 'report', 'cap'] as Step[]).map((s, idx) => {
          const labels: Record<Step, string> = { input: 'Company Info', generating: 'Processing', irl: 'IRL Review', dataroom: 'Data Room', report: 'DD Report', cap: 'ESG CAP' };
          const isActive = s === step;
          const isPast = ['input', 'generating', 'irl', 'dataroom', 'report', 'cap'].indexOf(step) > idx;
          return (
            <React.Fragment key={s}>
              {idx > 0 && <div className={`h-px flex-1 ${isPast ? 'bg-primary' : 'bg-border'}`} />}
              <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-primary text-primary-foreground' : isPast ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {labels[s]}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: Input */}
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Company Information</CardTitle>
            <CardDescription>Enter the target company details to generate an automated ESG Due Diligence assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" placeholder="e.g. NovaTech Solutions Pvt. Ltd." value={input.companyName} onChange={e => setInput(p => ({ ...p, companyName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Revenue Size (₹ Cr) *</Label>
                <Select value={input.revenueSize} onValueChange={v => setInput(p => ({ ...p, revenueSize: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select revenue range" /></SelectTrigger>
                  <SelectContent>
                    {revenueSizes.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Industry *</Label>
                <Select value={input.industry} onValueChange={v => setInput(p => ({ ...p, industry: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>VC Partner (if any)</Label>
                <Select value={input.vcPartner} onValueChange={v => setInput(p => ({ ...p, vcPartner: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select VC partner" /></SelectTrigger>
                  <SelectContent>
                    {vcPartners.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleGenerate} disabled={!canProceed} size="lg">
              <Sparkles className="h-4 w-4 mr-2" /> Generate IRL & Assessment
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Generating */}
      {step === 'generating' && (
        <Card>
          <CardContent className="py-16 text-center space-y-6">
            <Bot className="h-16 w-16 mx-auto text-primary animate-pulse" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Generating ESG Due Diligence</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Analyzing material topics (SASB/GRI), Indian regulations based on revenue, and VC ESG policy requirements…
              </p>
            </div>
            <div className="max-w-sm mx-auto space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>
            <div className="text-left max-w-sm mx-auto space-y-1 text-sm">
              {progress > 10 && <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Industry material topics identified</div>}
              {progress > 30 && <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Revenue-based regulations mapped</div>}
              {progress > 50 && <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> VC ESG policy requirements loaded</div>}
              {progress > 70 && <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Data room documents scanned</div>}
              {progress > 90 && <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Generating IRL and matching documents</div>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: IRL Review */}
      {step === 'irl' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSearch className="h-5 w-5" /> Information Request List (IRL)</CardTitle>
            <CardDescription>
              Generated {irlStats.total} requirements from SASB, GRI, Indian regulations, and VC ESG policy for <strong>{input.companyName || result.input.companyName}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-600" /> {irlStats.matched} Matched</Badge>
              <Badge variant="outline" className="gap-1"><AlertTriangle className="h-3 w-3 text-amber-500" /> {irlStats.partial} Partial</Badge>
              <Badge variant="outline" className="gap-1"><XCircle className="h-3 w-3 text-destructive" /> {irlStats.missing} Missing</Badge>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({irlStats.total})</TabsTrigger>
                <TabsTrigger value="environmental">Environmental</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
              </TabsList>
              {['all', 'environmental', 'social', 'governance'].map(tab => (
                <TabsContent key={tab} value={tab}>
                  <div className="rounded-md border overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">#</TableHead>
                          <TableHead>Requirement</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Document Expected</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Match</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.irlItems.filter(i => tab === 'all' || i.category === tab).map((item, idx) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs">{idx + 1}</TableCell>
                            <TableCell>
                              <div className="font-medium text-sm">{item.requirement}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                            </TableCell>
                            <TableCell><Badge variant="secondary" className={`text-xs ${sourceColors[item.source] || ''}`}>{item.source}</Badge></TableCell>
                            <TableCell><Badge variant="secondary" className={`text-xs capitalize ${categoryColors[item.category]}`}>{item.category}</Badge></TableCell>
                            <TableCell className="text-xs">{item.documentExpected}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                {statusIcons[item.status]}
                                <span className="text-xs capitalize">{item.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.matchScore !== undefined ? (
                                <div className="flex items-center gap-2">
                                  <Progress value={item.matchScore} className="w-16 h-2" />
                                  <span className="text-xs font-medium">{item.matchScore}%</span>
                                </div>
                              ) : <span className="text-xs text-muted-foreground">—</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep('input')}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button onClick={() => setStep('dataroom')}><ArrowRight className="h-4 w-4 mr-2" /> View Data Room Mapping</Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 4: Data Room */}
      {step === 'dataroom' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Data Room Document Mapping</CardTitle>
            <CardDescription>Documents from the client data room mapped against IRL requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl font-bold text-emerald-600">{irlStats.matched}</div>
                  <div className="text-sm text-muted-foreground">Documents Matched</div>
                  <div className="text-xs text-emerald-600 mt-1">Avg Score: {Math.round(result.irlItems.filter(i => i.status === 'matched').reduce((s, i) => s + (i.matchScore || 0), 0) / irlStats.matched)}%</div>
                </CardContent>
              </Card>
              <Card className="border-amber-200 dark:border-amber-800">
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl font-bold text-amber-600">{irlStats.partial}</div>
                  <div className="text-sm text-muted-foreground">Partial Matches</div>
                  <div className="text-xs text-amber-600 mt-1">Needs review</div>
                </CardContent>
              </Card>
              <Card className="border-destructive/50">
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl font-bold text-destructive">{irlStats.missing}</div>
                  <div className="text-sm text-muted-foreground">Gaps Identified</div>
                  <div className="text-xs text-destructive mt-1">Action required</div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IRL Requirement</TableHead>
                    <TableHead>Matched Document</TableHead>
                    <TableHead>Content Score</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.irlItems.filter(i => i.matchedDocument).map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-sm">{item.requirement}</TableCell>
                      <TableCell className="text-sm"><FileText className="h-3 w-3 inline mr-1" />{item.matchedDocument}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.matchScore} className="w-16 h-2" />
                          <span className={`text-xs font-medium ${(item.matchScore || 0) >= 70 ? 'text-emerald-600' : (item.matchScore || 0) >= 50 ? 'text-amber-600' : 'text-destructive'}`}>{item.matchScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{item.validity || 'Not specified'}</TableCell>
                      <TableCell>{statusIcons[item.status]} </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep('irl')}><ArrowLeft className="h-4 w-4 mr-2" /> Back to IRL</Button>
            <Button onClick={() => setStep('report')}><ArrowRight className="h-4 w-4 mr-2" /> View DD Report</Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 5: Report */}
      {step === 'report' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> ESGDD Report (Machine)</CardTitle>
                <CardDescription className="mt-1">{input.companyName || result.input.companyName} — Generated {new Date().toLocaleDateString()}</CardDescription>
              </div>
              <Button onClick={handleDownloadReport} variant="outline"><Download className="h-4 w-4 mr-2" /> Download Report</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Executive Summary */}
            <div>
              <h3 className="font-semibold mb-2">Executive Summary</h3>
              <p className="text-sm text-muted-foreground">{result.report.summary}</p>
            </div>
            <Separator />

            {/* Score Card */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">{irlStats.total}</div>
                <div className="text-xs text-muted-foreground">IRL Items</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-emerald-600">{overallScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Match Score</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-destructive">{irlStats.missing}</div>
                <div className="text-xs text-muted-foreground">Gaps Found</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-amber-600">{result.capItems.length}</div>
                <div className="text-xs text-muted-foreground">CAP Items</div>
              </div>
            </div>
            <Separator />

            {/* Category breakdown */}
            {(['environmental', 'social', 'governance'] as const).map(cat => {
              const items = result.irlItems.filter(i => i.category === cat);
              const matched = items.filter(i => i.status === 'matched').length;
              const partial = items.filter(i => i.status === 'partial').length;
              const missing = items.filter(i => i.status === 'missing').length;
              return (
                <div key={cat}>
                  <h4 className="font-medium capitalize mb-2 flex items-center gap-2">
                    <Badge className={categoryColors[cat]}>{cat}</Badge>
                    <span className="text-sm text-muted-foreground">{items.length} requirements</span>
                  </h4>
                  <div className="flex gap-4 text-sm mb-1">
                    <span className="text-emerald-600">{matched} matched</span>
                    <span className="text-amber-600">{partial} partial</span>
                    <span className="text-destructive">{missing} missing</span>
                  </div>
                  <Progress value={((matched + partial * 0.5) / items.length) * 100} className="h-2" />
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep('dataroom')}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button onClick={() => setStep('cap')}><ArrowRight className="h-4 w-4 mr-2" /> View ESG CAP</Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 6: ESG CAP */}
      {step === 'cap' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileSearch className="h-5 w-5" /> ESG Corrective Action Plan (Machine)</CardTitle>
            <CardDescription>
              {result.capItems.length} corrective actions generated. Select items to add to the ESG CAP Tracker.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox checked={selectedCapItems.length === result.capItems.length} onCheckedChange={selectAllCap} />
              <Label className="text-sm">Select All ({result.capItems.length})</Label>
              {selectedCapItems.length > 0 && (
                <Badge variant="secondary">{selectedCapItems.length} selected</Badge>
              )}
            </div>

            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" />
                    <TableHead>Issue</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Deal Condition</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.capItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell><Checkbox checked={selectedCapItems.includes(item.id)} onCheckedChange={() => toggleCapItem(item.id)} /></TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{item.issue}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.recommendation}</div>
                      </TableCell>
                      <TableCell><Badge className={`text-xs capitalize ${categoryColors[item.category]}`}>{item.category}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'} className="text-xs capitalize">{item.priority}</Badge>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{item.dealCondition}</Badge></TableCell>
                      <TableCell className="text-xs">{item.deadline}</TableCell>
                      <TableCell className="text-xs">{item.assignedTo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep('report')}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Report</Button>
            <div className="flex gap-2">
              <Button onClick={handleDownloadReport} variant="outline"><Download className="h-4 w-4 mr-2" /> Download Report</Button>
              <Button onClick={handleAddToTracker} disabled={capAdded}>
                {capAdded ? <><Check className="h-4 w-4 mr-2" /> Added to Tracker</> : <><Plus className="h-4 w-4 mr-2" /> Add to ESG CAP Tracker</>}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
