
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCheck, Clock, CheckCircle, ChevronDown, ChevronRight, X, Users } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Employee } from './EmployeeManagement';
import { baseESMSDocumentList } from '../../pages/ESMSPage';
import { logger } from '@/hooks/logger';
import { httpClient } from '@/lib/httpClient';

// Module and metrics configuration
const moduleConfig = {
  esms: {
    name: 'ESMS',
    subItems: baseESMSDocumentList.reduce((a, c) => { return a.concat(c.documents) }, [])

  },
  esg_metrics: {
    name: 'ESG Metrics',
    subItems: [
      // { id: 'esg_environmental', title: 'Environmental Metrics' },
      // { id: 'esg_social', title: 'Social Metrics' },
      // { id: 'esg_governance', title: 'Governance Metrics' },
      // { id: 'esg_emissions', title: 'Emissions Data' },
      // { id: 'esg_energy', title: 'Energy Consumption' },
      // { id: 'esg_water', title: 'Water Usage' },
      // { id: 'esg_waste', title: 'Waste Management' },
    ]
  }
};

// const teamMembers = [
//   { id: 'john', name: 'John Doe', department: 'Finance' },
//   { id: 'jane', name: 'Jane Smith', department: 'HR' },
//   { id: 'mike', name: 'Mike Johnson', department: 'Operations' },
//   { id: 'sarah', name: 'Sarah Williams', department: 'Compliance' },
//   { id: 'david', name: 'David Brown', department: 'IT' },
// ];

const RoleAssignment = (
  { employees }: {
    employees: Employee[];
  }
) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [allModulesSelected, setAllModulesSelected] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedSubItems, setSelectedSubItems] = useState<Record<string, string[]>>({
    esms: [],
    esg_metrics: []
  });
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<Employee[]>(employees);
  const [metricSubItems, setMetricSubItems] = useState(() => {
    const cached = localStorage.getItem('cached-metrics');
    return cached ? JSON.parse(cached) : [];
  });

  // Mock assignment data
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
      modules: ['ESMS', 'ESG Metrics']
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
      modules: ['ESG Metrics']
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
      modules: ['ESMS']
    }
  ];

  const transformMetrics = (metrics) => {
    return metrics.map((metric, index) => ({
      ...metric,
      title: metric.name,
      ...(metric.id
        ? { id: `${metric.id}` }
        : { id: `${metric.code}-${metric.name.split(" ").join('::')}` })
    }));
  };

  const memoizedMetrics = useMemo(() => {
    return transformMetrics(metricSubItems);
  }, [metricSubItems]);

  const getMaterialityData = async () => {
    try {
      let materilityDataResponse = await httpClient.get(`materiality/${JSON.parse(localStorage.getItem('fandoro-user')).entityId}`)
      if (materilityDataResponse['status'] == 200) {
        if (materilityDataResponse['data']) {

          if (materilityDataResponse['data']['finalMetrics']) {
            logger.log("materialityData['data']['finalMetrics']", materilityDataResponse['data']['finalMetrics'])
            // setSelectedIndustries(materilityDataResponse['data']['industry'])
            // setTempSelectedIndustries(materilityDataResponse['data']['industry'])
            // moduleConfig['esg_metrics'].subItems = materilityDataResponse['data']['finalMetrics'].map((metric, index) => {
            //   return {
            //     ...metric,
            //     title: metric.name,
            //     ...(metric.id ? { id: `${metric.id}` } : { id: `${index}-${metric.code}` })
            //   }
            // })
            // materilityDataResponse['data']['finalMetrics']

            const metrics = materilityDataResponse['data']['finalMetrics'];
            setMetricSubItems(metrics);

            // 2. Also persist as fallback
            localStorage.setItem(
              'cached-metrics',
              JSON.stringify(metrics)
            );
          }
        }
      }
      logger.log('materilityDataResponse', materilityDataResponse)
    } catch (error) {
      logger.log("error :: getMaterialityData => ", error)
      const cached = localStorage.getItem('cached-metrics');
      if (cached) {
        setMetricSubItems(JSON.parse(cached));
      }
    }
  }

  useEffect(() => {
    moduleConfig['esg_metrics'].subItems = memoizedMetrics;
  }, [memoizedMetrics]);

  useEffect(() => {
    getMaterialityData()
  }, [])

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAllEmployees = (checked: boolean) => {
    setSelectedEmployees(checked ? teamMembers.map(m => m._id) : []);
  };

  const handleAllModulesToggle = (checked: boolean) => {
    setAllModulesSelected(checked);
    if (checked) {
      setSelectedModules(['esms', 'esg_metrics']);
      // Select all sub-items for each module
      setSelectedSubItems({
        esms: moduleConfig.esms.subItems.map(item => item.id),
        esg_metrics: moduleConfig.esg_metrics.subItems.map(item => item.id)
      });
    } else {
      setSelectedModules([]);
      setSelectedSubItems({ esms: [], esg_metrics: [] });
    }
  };

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    if (checked) {
      setSelectedModules(prev => [...prev, moduleId]);
      // Select all sub-items for this module
      setSelectedSubItems(prev => ({
        ...prev,
        [moduleId]: moduleConfig[moduleId as keyof typeof moduleConfig].subItems.map(item => item.id)
      }));
    } else {
      setSelectedModules(prev => prev.filter(id => id !== moduleId));
      setSelectedSubItems(prev => ({
        ...prev,
        [moduleId]: []
      }));
      setAllModulesSelected(false);
    }
  };

  const handleSubItemToggle = (moduleId: string, subItemId: string, checked: boolean) => {
    const moduleSubItems = moduleConfig[moduleId as keyof typeof moduleConfig].subItems;

    setSelectedSubItems(prev => {
      const currentItems = prev[moduleId] || [];
      const newItems = checked
        ? [...currentItems, subItemId]
        : currentItems.filter(id => id !== subItemId);

      // Check if all sub-items are selected
      const allSubItemsSelected = newItems.length === moduleSubItems.length;

      // Update module selection based on sub-items
      if (newItems.length > 0 && !selectedModules.includes(moduleId)) {
        setSelectedModules(prev => [...prev, moduleId]);
      } else if (newItems.length === 0) {
        setSelectedModules(prev => prev.filter(id => id !== moduleId));
      }

      return { ...prev, [moduleId]: newItems };
    });

    // Update all modules selected state
    setTimeout(() => {
      const esmsAllSelected = selectedSubItems.esms.length === moduleConfig.esms.subItems.length;
      const esgAllSelected = selectedSubItems.esg_metrics.length === moduleConfig.esg_metrics.subItems.length;
      setAllModulesSelected(esmsAllSelected && esgAllSelected);
    }, 0);
  };

  const handleSelectAllSubItems = (moduleId: string, checked: boolean) => {
    const moduleSubItems = moduleConfig[moduleId as keyof typeof moduleConfig].subItems;

    if (checked) {
      setSelectedSubItems(prev => ({
        ...prev,
        [moduleId]: moduleSubItems.map(item => item.id)
      }));
      if (!selectedModules.includes(moduleId)) {
        setSelectedModules(prev => [...prev, moduleId]);
      }
    } else {
      setSelectedSubItems(prev => ({
        ...prev,
        [moduleId]: []
      }));
    }
  };

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const resetForm = () => {
    setSelectedEmployees([]);
    setSelectedRole('');
    setSelectedLocation('');
    setSelectedDepartment('');
    setAllModulesSelected(false);
    setSelectedModules([]);
    setSelectedSubItems({ esms: [], esg_metrics: [] });
    setExpandedModules([]);
  };

  const handleDialogClose = (open: boolean) => {
    console.log('selectedEmployees', selectedEmployees)
    console.log("selectedModules", selectedModules)
    console.log("selectedSubItems", selectedSubItems)
    setIsAssignDialogOpen(open);
    if (!open) resetForm();
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

  const submitData= async ()=>{
    try {
      let roleAssignmentObj={
        teamMembers:selectedEmployees,
        role:selectedRole,
        location:selectedLocation,
        department:selectedDepartment,
        module:selectedModules,
        subItems:selectedSubItems
      }
      console.log('roleAssignmentObj',roleAssignmentObj)
      let assignmentResponse=await httpClient.post('subuser/role-assignment/maker-checker',
        {data:roleAssignmentObj}
      );
      console.log('assignmentResponse',assignmentResponse)
    } catch (error) {
      logger.error(error.message)
    }
  }

  return (
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
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Assign Role to Team Members</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
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
                            {/* Select All Option */}
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
                                key={member._id}
                                onSelect={() => handleEmployeeToggle(member._id)}
                                className="cursor-pointer"
                              >
                                <Checkbox
                                  checked={selectedEmployees.includes(member._id)}
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
                        const member = teamMembers.find(m => m._id === empId);
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

                {/* Module Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Assign Modules</Label>
                  <div className="border rounded-lg p-3 space-y-3">
                    {/* All Modules Option */}
                    <div className="flex items-center space-x-2 pb-2 border-b">
                      <Checkbox
                        id="all-modules"
                        checked={allModulesSelected}
                        onCheckedChange={handleAllModulesToggle}
                      />
                      <Label htmlFor="all-modules" className="font-medium cursor-pointer">
                        All Modules (ESMS & ESG Metrics)
                      </Label>
                    </div>

                    {/* Individual Module Selection */}
                    {Object.entries(moduleConfig).map(([moduleId, module]) => (
                      <Collapsible
                        key={moduleId}
                        open={expandedModules.includes(moduleId)}
                        onOpenChange={() => toggleModuleExpand(moduleId)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`module-${moduleId}`}
                              checked={selectedModules.includes(moduleId)}
                              onCheckedChange={(checked) => handleModuleToggle(moduleId, checked as boolean)}
                            />
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                                {expandedModules.includes(moduleId) ? (
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 mr-1" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <Label htmlFor={`module-${moduleId}`} className="font-medium cursor-pointer">
                              {module.name}
                            </Label>
                            {selectedSubItems[moduleId]?.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {selectedSubItems[moduleId].length}/{module.subItems.length}
                              </Badge>
                            )}
                          </div>

                          <CollapsibleContent>
                            <div className="ml-8 pl-4 border-l space-y-2 py-2">
                              {/* Select All Sub-items */}
                              <div className="flex items-center space-x-2 pb-1">
                                <Checkbox
                                  id={`all-${moduleId}`}
                                  checked={selectedSubItems[moduleId]?.length === module.subItems.length}
                                  onCheckedChange={(checked) => handleSelectAllSubItems(moduleId, checked as boolean)}
                                />
                                <Label htmlFor={`all-${moduleId}`} className="text-sm cursor-pointer text-muted-foreground">
                                  Select All {module.name}
                                </Label>
                              </div>

                              {/* Individual Sub-items */}
                              {module.subItems.map((subItem) => (
                                <div key={subItem.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`subitem-${subItem.id}`}
                                    checked={selectedSubItems[moduleId]?.includes(subItem.id)}
                                    onCheckedChange={(checked) => handleSubItemToggle(moduleId, subItem.id, checked as boolean)}
                                  />
                                  <Label htmlFor={`subitem-${subItem.id}`} className="text-sm cursor-pointer">
                                    {subItem.title}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleDialogClose(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => submitData()}
                    className="flex-1"
                    disabled={selectedEmployees.length === 0 || !selectedRole || selectedModules.length === 0}
                  >
                    Assign Role ({selectedEmployees.length})
                  </Button>
                </div>
              </div>
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
              <TableHead>Modules</TableHead>
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
                  <div className="flex flex-wrap gap-1">
                    {assignment.modules.map((mod) => (
                      <Badge key={mod} variant="secondary" className="text-xs">
                        {mod}
                      </Badge>
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
  );
};

export default RoleAssignment;
