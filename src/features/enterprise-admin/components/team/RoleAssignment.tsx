import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  UserCheck, Clock, CheckCircle, ChevronDown, ChevronRight, X, Users, 
  Infinity, List, AlertTriangle, Info, Shield, ShieldCheck 
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Type definitions for scope-based access
type AccessScope = 'ALL' | 'LIMITED';

interface ModuleAccess {
  scope: AccessScope;
  selectedItems: string[];
}

interface ModuleAccessState {
  esms: ModuleAccess;
  esg_metrics: ModuleAccess;
}

// Module and metrics configuration
const moduleConfig = {
  esms: {
    name: 'ESMS',
    description: 'Environmental & Social Management System',
    subItems: [
      { id: 'esms_policy', name: 'Policy Documents' },
      { id: 'esms_procedures', name: 'Procedures' },
      { id: 'esms_risk_assessment', name: 'Risk Assessment' },
      { id: 'esms_training', name: 'Training Records' },
      { id: 'esms_monitoring', name: 'Monitoring & Evaluation' },
    ]
  },
  esg_metrics: {
    name: 'ESG Metrics',
    description: 'Environmental, Social & Governance Metrics',
    subItems: [
      { id: 'esg_environmental', name: 'Environmental Metrics' },
      { id: 'esg_social', name: 'Social Metrics' },
      { id: 'esg_governance', name: 'Governance Metrics' },
      { id: 'esg_emissions', name: 'Emissions Data' },
      { id: 'esg_energy', name: 'Energy Consumption' },
      { id: 'esg_water', name: 'Water Usage' },
      { id: 'esg_waste', name: 'Waste Management' },
    ]
  }
};

const teamMembers = [
  { id: 'john', name: 'John Doe', department: 'Finance' },
  { id: 'jane', name: 'Jane Smith', department: 'HR' },
  { id: 'mike', name: 'Mike Johnson', department: 'Operations' },
  { id: 'sarah', name: 'Sarah Williams', department: 'Compliance' },
  { id: 'david', name: 'David Brown', department: 'IT' },
];

// Scope explanation component
const ScopeExplanation = ({ scope, moduleName }: { scope: AccessScope; moduleName: string }) => {
  if (scope === 'ALL') {
    return (
      <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <Infinity className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-primary">Full Access - Future-Inclusive</p>
          <p className="text-muted-foreground mt-0.5">
            Access to all current {moduleName} items AND any new items added in the future. 
            No manual updates needed when new items are created.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 p-3 bg-muted/50 border rounded-lg">
      <List className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="text-sm">
        <p className="font-medium">Specific Access - Selected Items Only</p>
        <p className="text-muted-foreground mt-0.5">
          Access limited to the items you select below. New items added later will NOT be 
          automatically accessible.
        </p>
      </div>
    </div>
  );
};

const RoleAssignment = () => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  // New scope-based state
  const [moduleAccess, setModuleAccess] = useState<ModuleAccessState>({
    esms: { scope: 'LIMITED', selectedItems: [] },
    esg_metrics: { scope: 'LIMITED', selectedItems: [] }
  });
  
  // Single active module for accordion behavior (only one open at a time)
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  
  // Error states for validation
  const [moduleErrors, setModuleErrors] = useState<Record<string, boolean>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // Item dropdown states for each module
  const [itemDropdownOpen, setItemDropdownOpen] = useState<{ esms: boolean; esg_metrics: boolean }>({
    esms: false,
    esg_metrics: false
  });
  
  // Confirmation dialog states
  const [scopeChangeConfirm, setScopeChangeConfirm] = useState<{
    open: boolean;
    moduleId: string;
    fromScope: AccessScope;
    toScope: AccessScope;
  } | null>(null);

  // Check if a module has an error (LIMITED scope with no items selected)
  const hasModuleError = (moduleId: string): boolean => {
    if (!enabledModules.includes(moduleId)) return false;
    const access = moduleAccess[moduleId as keyof ModuleAccessState];
    return access.scope === 'LIMITED' && access.selectedItems.length === 0;
  };

  // Get first module with error
  const getFirstModuleWithError = (): string | null => {
    for (const moduleId of enabledModules) {
      if (hasModuleError(moduleId)) {
        return moduleId;
      }
    }
    return null;
  };

  // Mock assignment data with scope information
  const assignments = [
    {
      id: 1,
      employee: 'John Doe',
      currentRole: 'Maker',
      assignedRole: 'Checker',
      department: 'Finance',
      location: 'Mumbai Office',
      assignedBy: 'Admin User',
      status: 'Pending',
      assignedDate: '2024-01-15',
      modules: [
        { name: 'ESMS', scope: 'ALL' as AccessScope },
        { name: 'ESG Metrics', scope: 'LIMITED' as AccessScope, itemCount: 4 }
      ]
    },
    {
      id: 2,
      employee: 'Jane Smith',
      currentRole: 'Checker',
      assignedRole: 'Maker',
      department: 'HR',
      location: 'Delhi Warehouse',
      assignedBy: 'Admin User',
      status: 'Completed',
      assignedDate: '2024-01-14',
      modules: [
        { name: 'ESG Metrics', scope: 'ALL' as AccessScope }
      ]
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      currentRole: null,
      assignedRole: 'Maker',
      department: 'Operations',
      location: 'Bangalore Manufacturing',
      assignedBy: 'Unit Head',
      status: 'In Progress',
      assignedDate: '2024-01-16',
      modules: [
        { name: 'ESMS', scope: 'LIMITED' as AccessScope, itemCount: 2 }
      ]
    }
  ];

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAllEmployees = (checked: boolean) => {
    setSelectedEmployees(checked ? teamMembers.map(m => m.id) : []);
  };

  const handleModuleEnable = (moduleId: string, enabled: boolean) => {
    if (enabled) {
      setEnabledModules(prev => [...prev, moduleId]);
      // Default to LIMITED scope when enabling
      setModuleAccess(prev => ({
        ...prev,
        [moduleId]: { scope: 'LIMITED', selectedItems: [] }
      }));
      // Auto-expand the newly enabled module (closes others due to single-panel mode)
      setActiveModule(moduleId);
    } else {
      setEnabledModules(prev => prev.filter(id => id !== moduleId));
      // Clear selections when unchecking
      setModuleAccess(prev => ({
        ...prev,
        [moduleId]: { scope: 'LIMITED', selectedItems: [] }
      }));
      // Collapse the panel when unchecking
      if (activeModule === moduleId) {
        setActiveModule(null);
      }
    }
  };

  const handleScopeChange = (moduleId: string, newScope: AccessScope) => {
    const currentScope = moduleAccess[moduleId as keyof ModuleAccessState].scope;
    
    // Show confirmation when changing scope
    if (currentScope !== newScope) {
      setScopeChangeConfirm({
        open: true,
        moduleId,
        fromScope: currentScope,
        toScope: newScope
      });
    }
  };

  const confirmScopeChange = () => {
    if (!scopeChangeConfirm) return;
    
    const { moduleId, toScope } = scopeChangeConfirm;
    
    setModuleAccess(prev => ({
      ...prev,
      [moduleId]: {
        scope: toScope,
        // Clear selections when switching to ALL, keep them when switching to LIMITED
        selectedItems: toScope === 'ALL' ? [] : prev[moduleId as keyof ModuleAccessState].selectedItems
      }
    }));
    
    setScopeChangeConfirm(null);
  };

  const handleItemToggle = (moduleId: string, itemId: string, checked: boolean) => {
    setModuleAccess(prev => {
      const current = prev[moduleId as keyof ModuleAccessState];
      return {
        ...prev,
        [moduleId]: {
          ...current,
          selectedItems: checked
            ? [...current.selectedItems, itemId]
            : current.selectedItems.filter(id => id !== itemId)
        }
      };
    });
  };

  const handleSelectAllItems = (moduleId: string, checked: boolean) => {
    const moduleItems = moduleConfig[moduleId as keyof typeof moduleConfig].subItems;
    setModuleAccess(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId as keyof ModuleAccessState],
        selectedItems: checked ? moduleItems.map(item => item.id) : []
      }
    }));
  };

  // Toggle module panel - single accordion mode (only one open at a time)
  const toggleModuleExpand = (moduleId: string) => {
    if (activeModule === moduleId) {
      // Clicking the same module closes it
      setActiveModule(null);
    } else {
      // Open the clicked module (automatically closes the previous one)
      setActiveModule(moduleId);
    }
  };

  const resetForm = () => {
    setSelectedEmployees([]);
    setSelectedRole('');
    setSelectedLocation('');
    setSelectedDepartment('');
    setModuleAccess({
      esms: { scope: 'LIMITED', selectedItems: [] },
      esg_metrics: { scope: 'LIMITED', selectedItems: [] }
    });
    setActiveModule(null);
    setEnabledModules([]);
    setModuleErrors({});
    setHasAttemptedSubmit(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAssignDialogOpen(open);
    if (!open) resetForm();
  };

  // Handle submit with validation
  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    
    // Check for errors
    const firstError = getFirstModuleWithError();
    if (firstError) {
      // Auto-open first module with error
      setActiveModule(firstError);
      return; // Don't close dialog
    }
    
    // All valid - proceed
    handleDialogClose(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'In Progress':
        return <UserCheck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const isFormValid = () => {
    if (selectedEmployees.length === 0 || !selectedRole) return false;
    
    // At least one module must be enabled with valid access
    return enabledModules.some(moduleId => {
      const access = moduleAccess[moduleId as keyof ModuleAccessState];
      return access.scope === 'ALL' || access.selectedItems.length > 0;
    });
  };

  const getScopeSummary = () => {
    const summaries: string[] = [];
    enabledModules.forEach(moduleId => {
      const access = moduleAccess[moduleId as keyof ModuleAccessState];
      const moduleName = moduleConfig[moduleId as keyof typeof moduleConfig].name;
      if (access.scope === 'ALL') {
        summaries.push(`${moduleName}: Full Access`);
      } else if (access.selectedItems.length > 0) {
        summaries.push(`${moduleName}: ${access.selectedItems.length} items`);
      }
    });
    return summaries.join(' • ');
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Role Assignment</CardTitle>
            <Dialog open={isAssignDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Assign Maker–Checker Role</DialogTitle>
                  <DialogDescription>
                    Configure role access permissions for team members. Choose between full access 
                    (includes future items) or specific access (selected items only).
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-2">
                  {/* Team Member Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Team Members</Label>
                    
                    {/* Multi-select Dropdown */}
                    <Popover open={employeeDropdownOpen} onOpenChange={setEmployeeDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={employeeDropdownOpen}
                          className="w-full justify-between h-auto min-h-10 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {selectedEmployees.length === 0 
                                ? "Select team members..." 
                                : `${selectedEmployees.length} member(s) selected`}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search team members..." />
                          <CommandList>
                            <CommandEmpty>No team member found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => handleSelectAllEmployees(selectedEmployees.length !== teamMembers.length)}
                                className="cursor-pointer"
                              >
                                <Checkbox 
                                  checked={selectedEmployees.length === teamMembers.length}
                                  className="mr-2"
                                />
                                <span className="font-medium">Select All ({teamMembers.length})</span>
                              </CommandItem>
                              <div className="h-px bg-border my-1" />
                              {teamMembers.map((member) => (
                                <CommandItem
                                  key={member.id}
                                  onSelect={() => handleEmployeeToggle(member.id)}
                                  className="cursor-pointer"
                                >
                                  <Checkbox 
                                    checked={selectedEmployees.includes(member.id)}
                                    className="mr-2"
                                  />
                                  <span>{member.name}</span>
                                  <span className="ml-auto text-xs text-muted-foreground">
                                    {member.department}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Selected Members Chips */}
                    {selectedEmployees.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployees.map((empId) => {
                          const member = teamMembers.find(m => m.id === empId);
                          if (!member) return null;
                          return (
                            <Badge 
                              key={empId} 
                              variant="secondary" 
                              className="pl-2 pr-1 py-1 flex items-center gap-1"
                            >
                              {member.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-destructive/20 rounded-full"
                                onClick={() => handleEmployeeToggle(empId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          );
                        })}
                        {selectedEmployees.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => setSelectedEmployees([])}
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newRole">Assign Role</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maker">Maker</SelectItem>
                          <SelectItem value="checker">Checker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="assignLocation">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mumbai">Mumbai Office</SelectItem>
                          <SelectItem value="delhi">Delhi Warehouse</SelectItem>
                          <SelectItem value="bangalore">Bangalore Manufacturing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assignDepartment">Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Module Access Configuration - NEW DESIGN */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Configure Module Access</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-medium mb-1">Access Types</p>
                          <p className="text-xs"><strong>Full Access:</strong> All current and future items</p>
                          <p className="text-xs"><strong>Specific Access:</strong> Only selected items</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(moduleConfig).map(([moduleId, module]) => {
                        const isEnabled = enabledModules.includes(moduleId);
                        const access = moduleAccess[moduleId as keyof ModuleAccessState];
                        const isExpanded = activeModule === moduleId;
                        const hasError = hasAttemptedSubmit && hasModuleError(moduleId);
                        
                        return (
                          <div 
                            key={moduleId} 
                            className={`border rounded-lg overflow-hidden transition-colors ${
                              hasError ? 'border-destructive' : ''
                            }`}
                          >
                            {/* Module Header */}
                            <div className={`flex items-center justify-between p-3 ${
                              hasError ? 'bg-destructive/5' : 'bg-muted/30'
                            }`}>
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`enable-${moduleId}`}
                                  checked={isEnabled}
                                  onCheckedChange={(checked) => handleModuleEnable(moduleId, checked as boolean)}
                                />
                                <div className="flex items-center gap-2">
                                  <div>
                                    <Label htmlFor={`enable-${moduleId}`} className="font-medium cursor-pointer">
                                      {module.name}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{module.description}</p>
                                  </div>
                                  
                                  {/* Error indicator with tooltip */}
                                  {isEnabled && hasModuleError(moduleId) && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center">
                                          <AlertTriangle className="h-4 w-4 text-destructive" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="right">
                                        <p>Select at least one item or switch to Full Access</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                              
                              {isEnabled && (
                                <div className="flex items-center gap-2">
                                  {access.scope === 'ALL' ? (
                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                      <Infinity className="h-3 w-3 mr-1" />
                                      Future-Inclusive
                                    </Badge>
                                  ) : access.selectedItems.length > 0 ? (
                                    <Badge variant="secondary">
                                      <List className="h-3 w-3 mr-1" />
                                      {access.selectedItems.length} Selected
                                    </Badge>
                                  ) : null}
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => toggleModuleExpand(moduleId)}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Module Access Configuration */}
                            {isEnabled && isExpanded && (
                              <div className="p-4 space-y-4 border-t">
                                {/* Access Type Selection - Radio Group */}
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium">Access Type</Label>
                                  <RadioGroup
                                    value={access.scope}
                                    onValueChange={(value) => handleScopeChange(moduleId, value as AccessScope)}
                                    className="space-y-3"
                                  >
                                    {/* Full Access Option */}
                                    <div className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                      access.scope === 'ALL' 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-transparent bg-muted/30 hover:bg-muted/50'
                                    }`}>
                                      <RadioGroupItem value="ALL" id={`${moduleId}-all`} className="mt-1" />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor={`${moduleId}-all`} className="font-medium cursor-pointer">
                                            Full Access
                                          </Label>
                                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                            <Infinity className="h-3 w-3 mr-1" />
                                            Future-Inclusive
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          Grant access to <strong>all {module.subItems.length} current items</strong> and 
                                          any new {module.name} items added in the future. No manual updates required.
                                        </p>
                                      </div>
                                    </div>

                                    {/* Specific Access Option */}
                                    <div className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                      access.scope === 'LIMITED' 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-transparent bg-muted/30 hover:bg-muted/50'
                                    }`}>
                                      <RadioGroupItem value="LIMITED" id={`${moduleId}-limited`} className="mt-1" />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <Label htmlFor={`${moduleId}-limited`} className="font-medium cursor-pointer">
                                            Specific Access
                                          </Label>
                                          <Badge variant="outline" className="text-xs">
                                            <List className="h-3 w-3 mr-1" />
                                            Selected Only
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          Grant access only to items you select below. 
                                          New items will <strong>not</strong> be automatically accessible.
                                        </p>
                                      </div>
                                    </div>
                                  </RadioGroup>
                                </div>

                                {/* Item Selection (only for LIMITED scope) */}
                                {access.scope === 'LIMITED' && (
                                  <div className="space-y-3 pt-2">
                                    <Label className="text-sm font-medium">
                                      Select Items ({access.selectedItems.length}/{module.subItems.length})
                                    </Label>
                                    
                                    {/* Searchable Multi-select Dropdown for Items */}
                                    <Popover 
                                      open={itemDropdownOpen[moduleId as keyof typeof itemDropdownOpen]} 
                                      onOpenChange={(open) => setItemDropdownOpen(prev => ({ ...prev, [moduleId]: open }))}
                                    >
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          aria-expanded={itemDropdownOpen[moduleId as keyof typeof itemDropdownOpen]}
                                          className="w-full justify-between h-auto min-h-10 py-2"
                                        >
                                          <div className="flex items-center gap-2">
                                            <List className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                              {access.selectedItems.length === 0 
                                                ? `Select ${module.name} items...` 
                                                : `${access.selectedItems.length} item(s) selected`}
                                            </span>
                                          </div>
                                          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[350px] p-0" align="start">
                                        <Command>
                                          <CommandInput placeholder={`Search ${module.name} items...`} />
                                          <CommandList>
                                            <CommandEmpty>No items found.</CommandEmpty>
                                            <CommandGroup>
                                              <CommandItem
                                                onSelect={() => handleSelectAllItems(moduleId, access.selectedItems.length !== module.subItems.length)}
                                                className="cursor-pointer"
                                              >
                                                <Checkbox 
                                                  checked={access.selectedItems.length === module.subItems.length}
                                                  className="mr-2"
                                                />
                                                <span className="font-medium">Select All ({module.subItems.length})</span>
                                              </CommandItem>
                                              <div className="h-px bg-border my-1" />
                                              {module.subItems.map((item) => (
                                                <CommandItem
                                                  key={item.id}
                                                  onSelect={() => handleItemToggle(moduleId, item.id, !access.selectedItems.includes(item.id))}
                                                  className="cursor-pointer"
                                                >
                                                  <Checkbox 
                                                    checked={access.selectedItems.includes(item.id)}
                                                    className="mr-2"
                                                  />
                                                  <span>{item.name}</span>
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>

                                    {/* Selected Items Chips */}
                                    {access.selectedItems.length > 0 && (
                                      <div className="flex flex-wrap gap-2">
                                        {access.selectedItems.map((itemId) => {
                                          const item = module.subItems.find(i => i.id === itemId);
                                          if (!item) return null;
                                          return (
                                            <Badge 
                                              key={itemId} 
                                              variant="secondary" 
                                              className="pl-2 pr-1 py-1 flex items-center gap-1"
                                            >
                                              {item.name}
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-destructive/20 rounded-full"
                                                onClick={() => handleItemToggle(moduleId, itemId, false)}
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </Badge>
                                          );
                                        })}
                                        {access.selectedItems.length > 1 && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs text-muted-foreground hover:text-destructive"
                                            onClick={() => handleSelectAllItems(moduleId, false)}
                                          >
                                            Clear all
                                          </Button>
                                        )}
                                      </div>
                                    )}

                                    {/* Warning if no items selected */}
                                    {access.selectedItems.length === 0 && (
                                      <div className="flex items-center gap-2 text-destructive text-sm">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>Select at least one item or switch to Full Access</span>
                                      </div>
                                    )}

                                    {/* Info about selecting all visible items */}
                                    {access.selectedItems.length === module.subItems.length && (
                                      <div className="flex items-start gap-2 p-2 bg-accent/50 border border-accent rounded text-sm">
                                        <Info className="h-4 w-4 text-accent-foreground mt-0.5 shrink-0" />
                                        <p className="text-muted-foreground">
                                          You've selected all current items, but new items added later 
                                          won't be included. Consider <strong>Full Access</strong> if you 
                                          want future items to be automatically accessible.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Full Access Summary */}
                                {access.scope === 'ALL' && (
                                  <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
                                    <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <p className="text-muted-foreground">
                                      This user will have access to all <strong>{module.subItems.length}</strong> current items 
                                      and will automatically gain access when new {module.name} items are added.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Section */}
                  {enabledModules.length > 0 && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Shield className="h-4 w-4" />
                        Access Summary
                      </div>
                      <p className="text-sm text-muted-foreground">{getScopeSummary()}</p>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button onClick={() => handleDialogClose(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!isFormValid()}
                  >
                    Assign Role ({selectedEmployees.length})
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead>Module Access</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.employee}</TableCell>
                  <TableCell>
                    {assignment.currentRole ? (
                      <Badge variant="outline">{assignment.currentRole}</Badge>
                    ) : (
                      <span className="text-muted-foreground">No Role</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{assignment.assignedRole}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {assignment.modules.map((mod, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {mod.name}
                          </Badge>
                          {mod.scope === 'ALL' ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="text-xs bg-primary/10 text-primary border-primary/20 cursor-help">
                                  <Infinity className="h-3 w-3" />
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Full Access - includes future items</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-help">
                                  {mod.itemCount} items
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Specific Access - {mod.itemCount} selected items only</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{assignment.department}</TableCell>
                  <TableCell>{assignment.location}</TableCell>
                  <TableCell>{assignment.assignedBy}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(assignment.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(assignment.status)}
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {assignment.status === 'Pending' && (
                        <>
                          <Button size="sm" variant="outline">Approve</Button>
                          <Button size="sm" variant="outline">Reject</Button>
                        </>
                      )}
                      {assignment.status === 'Completed' && (
                        <Button size="sm" variant="outline">View</Button>
                      )}
                      {assignment.status === 'In Progress' && (
                        <Button size="sm" variant="outline">Update</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scope Change Confirmation Dialog */}
      <AlertDialog open={scopeChangeConfirm?.open} onOpenChange={(open) => !open && setScopeChangeConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              {scopeChangeConfirm?.toScope === 'ALL' ? 'Expand Access?' : 'Restrict Access?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              {scopeChangeConfirm?.toScope === 'ALL' ? (
                <>
                  <p>
                    Switching to <strong>Full Access</strong> will grant access to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All current items in this module</li>
                    <li>Any new items added in the future</li>
                  </ul>
                  <p className="text-sm">
                    The user will automatically gain access to new items without manual updates.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Switching to <strong>Specific Access</strong> will:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Remove automatic access to future items</li>
                    <li>Require manual selection of accessible items</li>
                  </ul>
                  <p className="text-sm">
                    New items added to this module will not be accessible until explicitly granted.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmScopeChange}>
              {scopeChangeConfirm?.toScope === 'ALL' ? 'Grant Full Access' : 'Switch to Specific'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default RoleAssignment;
