import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Search, Download, Plus, Calendar as CalendarIcon, Shield, CheckCircle } from 'lucide-react';

const EHSAuditsPage = () => {
  const { isAuthenticated, isCompanyUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [audits, setAudits] = useState([
    {
      id: 'ehs-1',
      title: 'Safety Management System Audit',
      location: 'Mumbai Factory',
      status: 'completed',
      score: 85,
      date: '2024-03-15',
      auditor: 'Safety Consultant Ltd'
    },
    {
      id: 'ehs-2',
      title: 'Environmental Compliance Audit',
      location: 'Delhi Office',
      status: 'in_progress',
      score: null,
      date: '2024-04-01',
      auditor: 'Green Audit Associates'
    },
    {
      id: 'ehs-3',
      title: 'Health & Safety Training Audit',
      location: 'Bangalore Unit',
      status: 'scheduled',
      score: null,
      date: '2024-04-15',
      auditor: 'EHS Experts India'
    }
  ]);

  const [newAuditForm, setNewAuditForm] = useState({
    title: '',
    location: '',
    auditor: '',
    date: undefined as Date | undefined,
    type: '',
    priority: 'medium',
    description: ''
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isCompanyUser()) {
    return <Navigate to="/dashboard" />;
  }

  const filteredAudits = audits.filter(audit => 
    audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScheduleAudit = () => {
    if (newAuditForm.title && newAuditForm.location && newAuditForm.auditor && newAuditForm.date) {
      const newAudit = {
        id: `ehs-${Date.now()}`,
        title: newAuditForm.title,
        location: newAuditForm.location,
        status: 'scheduled',
        score: null,
        date: format(newAuditForm.date, 'yyyy-MM-dd'),
        auditor: newAuditForm.auditor
      };
      
      setAudits([...audits, newAudit]);
      setNewAuditForm({
        title: '',
        location: '',
        auditor: '',
        date: undefined,
        type: '',
        priority: 'medium',
        description: ''
      });
      setIsScheduleDialogOpen(false);
    }
  };

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EHS Audits</h1>
          <p className="text-muted-foreground">
            Environment, Health & Safety audit management and compliance tracking
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search EHS audits..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule New EHS Audit</DialogTitle>
                <DialogDescription>
                  Plan and schedule a new Environment, Health & Safety audit for your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="audit-title">Audit Title</Label>
                  <Input
                    id="audit-title"
                    placeholder="e.g., Environmental Compliance Audit"
                    value={newAuditForm.title}
                    onChange={(e) => setNewAuditForm({...newAuditForm, title: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="audit-type">Audit Type</Label>
                  <Select value={newAuditForm.type} onValueChange={(value) => setNewAuditForm({...newAuditForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environmental">Environmental Compliance</SelectItem>
                      <SelectItem value="safety">Safety Management</SelectItem>
                      <SelectItem value="health">Health & Hygiene</SelectItem>
                      <SelectItem value="training">Training & Awareness</SelectItem>
                      <SelectItem value="emergency">Emergency Preparedness</SelectItem>
                      <SelectItem value="waste">Waste Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="audit-location">Location/Unit</Label>
                  <Input
                    id="audit-location"
                    placeholder="e.g., Mumbai Factory, Delhi Office"
                    value={newAuditForm.location}
                    onChange={(e) => setNewAuditForm({...newAuditForm, location: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="audit-auditor">Auditor/Agency</Label>
                  <Input
                    id="audit-auditor"
                    placeholder="e.g., EHS Consultants Ltd"
                    value={newAuditForm.auditor}
                    onChange={(e) => setNewAuditForm({...newAuditForm, auditor: e.target.value})}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Scheduled Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !newAuditForm.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newAuditForm.date ? format(newAuditForm.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newAuditForm.date}
                        onSelect={(date) => setNewAuditForm({...newAuditForm, date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="audit-priority">Priority</Label>
                  <Select value={newAuditForm.priority} onValueChange={(value) => setNewAuditForm({...newAuditForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="audit-description">Description (Optional)</Label>
                  <Textarea
                    id="audit-description"
                    placeholder="Additional details about the audit scope and objectives..."
                    value={newAuditForm.description}
                    onChange={(e) => setNewAuditForm({...newAuditForm, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleScheduleAudit}>
                  Schedule Audit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{audits.length}</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Average across all units</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>EHS Audit Schedule</CardTitle>
            <CardDescription>Track environment, health & safety audits across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Shield className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{audit.title}</h3>
                      <p className="text-sm text-muted-foreground">{audit.location} • {audit.auditor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{audit.date}</p>
                      {audit.score && (
                        <p className="text-sm text-muted-foreground">Score: {audit.score}%</p>
                      )}
                    </div>
                    <StatusBadge status={audit.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedSidebarLayout>
  );
};

const StatusBadge: React.FC<{status: string}> = ({status}) => {
  let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
  let label = "";
  let icon = null;
  
  switch (status) {
    case 'completed':
      variant = "default";
      label = "Completed";
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case 'in_progress':
      variant = "secondary";
      label = "In Progress";
      icon = <CalendarIcon className="h-3 w-3 mr-1" />;
      break;
    case 'scheduled':
      variant = "outline";
      label = "Scheduled";
      icon = <CalendarIcon className="h-3 w-3 mr-1" />;
      break;
  }
  
  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {label}
    </Badge>
  );
};

export default EHSAuditsPage;