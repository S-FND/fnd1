import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import { useAuth } from '@/contexts/AuthContext';
import { useSupportTickets, SupportTicket } from '@/hooks/useSupportTickets';
import { useCompanyFeatures, QUARTERLY_FEATURES, ANNUAL_FEATURES } from '@/hooks/useCompanyFeatures';
import { TicketStatus } from '@/types/esg';
import { 
  FEATURE_FIELD_MAPPINGS,
  getFeatureKPIs,
  getKPIFields,
  formatKPIOption,
  formatFieldOption,
  getFullFieldReference,
  KPIDefinition,
  FieldDefinition,
} from '@/lib/featureFieldMapping';
import { 
  Bug, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Phone,
  Building2,
  Loader2,
  HelpCircle,
  FileQuestion
} from 'lucide-react';
import { format } from 'date-fns';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';

const Support = () => {
  const { user, companyName, effectiveCompanyId } = useAuth();
  const companyId = effectiveCompanyId || user?.companyId || 'company-1';
  const { tickets, loading, submitting, createTicket } = useSupportTickets(companyId);
  const { features, isFeatureEnabled } = useCompanyFeatures(companyId);

  // Form State
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedKPI, setSelectedKPI] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Get enabled features
  const enabledQuarterlyFeatures = QUARTERLY_FEATURES.filter(f => isFeatureEnabled(f.key));
  const enabledAnnualFeatures = ANNUAL_FEATURES.filter(f => isFeatureEnabled(f.key));
  const allEnabledFeatures = [...enabledQuarterlyFeatures, ...enabledAnnualFeatures];

  // Get KPIs for selected feature tab
  const availableKPIs = useMemo(() => {
    if (!selectedTab || selectedTab === '_general') return [];
    return getFeatureKPIs(selectedTab);
  }, [selectedTab]);

  // Get fields for selected KPI
  const availableFields = useMemo(() => {
    if (!selectedTab || !selectedKPI || selectedTab === '_general') return [];
    return getKPIFields(selectedTab, selectedKPI);
  }, [selectedTab, selectedKPI]);

  // Get selected KPI object for numbering
  const selectedKPIObject = useMemo(() => {
    return availableKPIs.find(kpi => kpi.id === selectedKPI);
  }, [availableKPIs, selectedKPI]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || !contactEmail.trim()) return;

    const featureLabel = allEnabledFeatures.find(f => f.key === selectedTab)?.label || selectedTab;
    
    // Format KPI reference with number prefix
    let kpiReference = '';
    if (selectedKPIObject) {
      kpiReference = `${selectedKPIObject.number}. ${selectedKPIObject.label}`;
    }

    const success = await createTicket({
      company_id: companyId,
      company_name: companyName || '',
      submitted_by: user?.name || 'Unknown',
      ticket_type: 'query',
      subject: subject.trim(),
      description: description.trim(),
      priority,
      feature_tab: featureLabel,
      kpi_reference: kpiReference || undefined,
      field_reference: selectedField || undefined, // Already includes "1a", "2b" format
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim() || undefined,
    });

    if (success) {
      setSubject('');
      setDescription('');
      setSelectedTab('');
      setSelectedKPI('');
      setSelectedField('');
      setPriority('medium');
      setContactPhone('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Open</Badge>;
      case 'work_in_progress':
        return <Badge className="gap-1 bg-amber-500"><Loader2 className="w-3 h-3 animate-spin" /> Work In Progress</Badge>;
      case 'in_review':
        return <Badge className="gap-1 bg-blue-500"><FileQuestion className="w-3 h-3" /> In Review</Badge>;
      case 'resolved':
        return <Badge className="gap-1 bg-green-600"><CheckCircle2 className="w-3 h-3" /> Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-[10px]">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-[10px]">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-[10px]">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <UnifiedSidebarLayout>
      <PageHeader
        title="Help & Support"
        subtitle="Report challenges or ask questions about specific KPIs or fields"
      />

      <Tabs defaultValue="new-request" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new-request" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            Report an Issue
          </TabsTrigger>
          <TabsTrigger value="my-tickets" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            My Tickets ({tickets.length})
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="w-4 h-4" />
            Contact ESG Team
          </TabsTrigger>
        </TabsList>

        {/* New Request Tab */}
        <TabsContent value="new-request" className="space-y-6">
          {showSuccess && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-center gap-3 py-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Issue Submitted Successfully!</p>
                  <p className="text-sm text-green-600">Our team will review your issue and get back to you at the provided email/phone.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="w-5 h-5 text-primary" />
                Report a Challenge or Issue
              </CardTitle>
              <CardDescription>
                Tell us about any difficulties you're facing with specific tabs, KPIs, or fields. We'll help you resolve them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-tab">Feature Tab</Label>
                    <Select value={selectedTab} onValueChange={(v) => { setSelectedTab(v); setSelectedKPI(''); setSelectedField(''); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a feature tab" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_general">General / Platform Issue</SelectItem>
                        {enabledQuarterlyFeatures.length > 0 && (
                          <>
                            <SelectItem value="_quarterly_header" disabled className="font-semibold text-muted-foreground">
                              — Quarterly Features —
                            </SelectItem>
                            {enabledQuarterlyFeatures.map(f => (
                              <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                            ))}
                          </>
                        )}
                        {enabledAnnualFeatures.length > 0 && (
                          <>
                            <SelectItem value="_annual_header" disabled className="font-semibold text-muted-foreground">
                              — Annual Features —
                            </SelectItem>
                            {enabledAnnualFeatures.map(f => (
                              <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpi-reference">KPI / Section (Optional)</Label>
                    <Select
                      value={selectedKPI}
                      onValueChange={(v) => { setSelectedKPI(v); setSelectedField(''); }}
                      disabled={!selectedTab || selectedTab === '_general'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a KPI" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableKPIs.map((kpi) => (
                          <SelectItem key={kpi.id} value={kpi.id}>
                            {formatKPIOption(kpi)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field-reference">Specific Field (Optional)</Label>
                    <Select 
                      value={selectedField} 
                      onValueChange={setSelectedField}
                      disabled={!selectedTab || selectedTab === '_general' || !selectedKPI || availableFields.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a field" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedKPIObject && availableFields.map((field) => (
                          <SelectItem key={field.id} value={`${selectedKPIObject.number}${field.letterIndex}`}>
                            {formatFieldOption(selectedKPIObject.number, field)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Subject and Description */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={priority} onValueChange={(v) => setPriority(v as 'low' | 'medium' | 'high')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Can wait</SelectItem>
                          <SelectItem value="medium">Medium - Need help soon</SelectItem>
                          <SelectItem value="high">High - Blocking my work</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Describe your issue *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe the challenge you're facing in detail. Include any error messages or steps that led to the issue."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="min-h-[120px]"
                      maxLength={2000}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {description.length}/2000 characters
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Information
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    We'll reach out to you on the provided email or phone number.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Phone Number (Optional)</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting || !subject.trim() || !description.trim() || !contactEmail.trim()} 
                  className="w-full"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Submit Issue</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Tickets Tab */}
        <TabsContent value="my-tickets">
          <Card>
            <CardHeader>
              <CardTitle>Your Support Tickets</CardTitle>
              <CardDescription>
                Track the status of your submitted issues and queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tickets submitted yet</p>
                  <p className="text-sm">Your support requests will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Feature Tab</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium max-w-[250px]">
                            <div className="truncate">{ticket.subject}</div>
                            {ticket.kpi_reference && (
                              <span className="text-xs text-muted-foreground">KPI: {ticket.kpi_reference}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {ticket.feature_tab || 'General'}
                            </Badge>
                          </TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact ESG Team Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Contact the Investor ESG Team
              </CardTitle>
              <CardDescription>
                Get in touch with our ESG specialists for guidance and support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h4 className="font-medium text-sm text-muted-foreground">Fireside Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ramya's Contact */}
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Ramya</p>
                      <a 
                        href="mailto:ramya@firesideventures.com" 
                        className="text-sm text-primary hover:underline"
                      >
                        ramya@firesideventures.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <a 
                        href="tel:+919740499399" 
                        className="text-sm text-primary hover:underline"
                      >
                        +91 97404 99399
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tarak's Contact */}
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Tarak</p>
                      <a 
                        href="mailto:tarak@firesideventures.com" 
                        className="text-sm text-primary hover:underline"
                      >
                        tarak@firesideventures.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <a 
                        href="tel:+918450950960" 
                        className="text-sm text-primary hover:underline"
                      >
                        +91 84509 50960
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-medium mb-2">What we can help with:</h4>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Understanding ESG metrics and their definitions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Guidance on data collection and reporting best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Clarification on quarterly reporting requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Industry-specific ESG considerations</span>
                  </li>
                </ul>
              </div>

              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                <p>Submitted by: <span className="font-medium">{user?.name}</span> from <span className="font-medium">{companyName}</span></p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UnifiedSidebarLayout>
  );
};

export default Support;
