import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, UserPlus, Search, Edit, Users, Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  updateEmployee,
  assignEmployeeUrls,
  fetchUrlList,
  fetchUserAccess
} from '../../services/employeeManagementAPI';

interface Employee {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  active: boolean;
  selectedLocation: string;
  role: string;
  department: string;
  location: string;
  userAccess: string[];
  createdAt: string;
  updatedAt: string;
  superUserId?: string;
  parentUserId?: string;
  mobile?: string | null;
  accessId?: string;
  password?: string;
  accessUrls?: string[];
}

interface Location {
  _id: string;
  name: string;
}

interface UserAccess {
  _id: string;
  subUserId: string;
  urls: string[];
  companies: any[];
  funds: any[];
  location: string;
  accessHistory: AccessHistory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AccessHistory {
  accessList: {
    urls: string[];
    locationId: string;
  };
  updatedOn: string;
}

const EmployeeManagement = ({ employees, locations, refreshData, loading }: {
  employees: Employee[];
  locations: Location[];
  refreshData: () => void;
  loading: boolean;
}) => {
  const [urlList, setUrlList] = useState<string[]>([]);
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [locationNameMap, setLocationNameMap] = useState<Map<string, string>>(new Map());
  const getLocationName = (locationId: string) => {
    if (!locationId) return 'Unassigned';
    return locationNameMap.get(locationId) || 'Unassigned';
  };

  useEffect(() => {
    const map = new Map<string, string>();
    locations.forEach(location => {
      map.set(location._id, location.name);
    });
    setLocationNameMap(map);
  }, [locations]);
  const [editForm, setEditForm] = useState({
    _id: '',
    name: '',
    email: '',
    employeeId: '',
    role: '',
    department: '',
    selectedLocation: '',
    active: false,
    superUserId: '',
    parentUserId: '',
    mobile: null as string | null,
    accessUrls: [] as string[]
  });
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  // Fetch URL list on component mount
  useEffect(() => {
    const fetchUrls = async () => {
      setIsUrlLoading(true);
      try {
        const urlsData = await fetchUrlList();
        if (urlsData?.status && urlsData.data) {
          setUrlList(urlsData.data);
        }
      } catch (error) {
        toast.error('Failed to load URL list');
        console.error(error);
      } finally {
        setIsUrlLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      _id: employee._id,
      name: employee.name || '',
      email: employee.email || '',
      employeeId: employee.employeeId || '',
      role: employee.role || '',
      department: employee.department || '',
      selectedLocation: employee.location || '',
      active: employee.active || false,
      superUserId: employee.superUserId || '',
      parentUserId: employee.parentUserId || '',
      mobile: employee.mobile || null,
      accessUrls: employee.accessUrls || []
    });
    setIsEditDialogOpen(true);
  };

  const handleAssignEmployee = async (employee: Employee) => {
    setSelectedEmployee(employee);

    // Fetch current user access
    try {
      const accessData = await fetchUserAccess(employee._id);
      if (accessData?.status) {
        setSelectedUrls(accessData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch user access:', error);
    }

    setIsAssignDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedEmployee) return;

      // Merge updates with original employee data to ensure all required fields are present
      const completePayload = {
        ...selectedEmployee, // Keep all original fields
        ...editForm,        // Apply updates
        updatedAt: new Date().toISOString() // Update timestamp
      };

      console.log('Sending complete payload to /subuser/activate:', completePayload);

      const [response, error] = await updateEmployee(completePayload);
      console.log('API Response:', response);

      if (response && (response.status === true || response._id)) {
        toast.success('Employee updated successfully');
        refreshData();
        setIsEditDialogOpen(false);
      } else {
        toast.error(error || 'Failed to update employee');
      }
    } catch (err) {
      console.error('Error in handleSaveEdit:', err);
      toast.error('An error occurred while updating employee');
    }
  };

  const handleSaveAssignment = async () => {
    if (!selectedEmployee) return;

    try {
      const [response, error] = await assignEmployeeUrls(selectedEmployee._id, selectedUrls);

      if (response?.status) {
        toast.success('Access URLs assigned successfully');
        refreshData();
        setIsAssignDialogOpen(false);
      } else {
        toast.error(error || 'Failed to assign access URLs');
      }
    } catch (err) {
      toast.error('An error occurred while assigning access URLs');
      console.error(err);
    }
  };

  // const handleActivateEmployee = async (employee: Employee, active: boolean) => {
  //   try {
  //     // For activation/deactivation, send the complete employee object with updated active status
  //     const activationPayload = {
  //       ...employee,
  //       active,
  //       updatedAt: new Date().toISOString()
  //     };
  //     console.log('activationPayload',activationPayload);
  //     const [response, error] = await updateEmployee(activationPayload);

  //     console.log('Activation response:', response);

  //     if (response && (response.status === true || response._id)) {
  //       toast.success(`Employee ${active ? 'activated' : 'deactivated'} successfully`);
  //       refreshData();
  //     } else {
  //       toast.error(error || `Failed to ${active ? 'activate' : 'deactivate'} employee`);
  //     }
  //   } catch (err) {
  //     toast.error('An error occurred while updating employee status');
  //     console.error(err);
  //   }
  // };

  // Transform URL list into hierarchical structure for display
  const getUrlHierarchy = () => {
    const hierarchy: Record<string, string[]> = {};

    urlList.forEach(url => {
      const parts = url.split('-');
      const category = parts[0];
      const subcategory = parts.slice(1).join('-');

      if (!hierarchy[category]) {
        hierarchy[category] = [];
      }
      hierarchy[category].push(subcategory);
    });

    return hierarchy;
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUrls([...urlList]);
    } else {
      setSelectedUrls([]);
    }
  };

  const handleUrlSelect = (url: string, checked: boolean) => {
    if (checked) {
      setSelectedUrls(prev => [...prev, url]);
    } else {
      setSelectedUrls(prev => prev.filter(u => u !== url));
    }
  };

  const isUrlSelected = (url: string) => {
    return selectedUrls.includes(url);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    const loc = employee.selectedLocation || employee.location || 'Unassigned';
    const matchesLocation = filterLocation === 'all' ||
      (filterLocation && getLocationName(loc) === getLocationName(filterLocation));

    return matchesSearch && matchesRole && matchesLocation;
  });

  const roles = ['admin', 'maker', 'checker', 'viewer','User'];

  if (loading || isUrlLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Employee Management</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location._id} value={location._id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employee Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.employeeId}</TableCell>
                <TableCell>
                  <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'}>
                    {employee.role}
                  </Badge>
                </TableCell>
                <TableCell>{getLocationName(employee.selectedLocation || employee.location)}</TableCell>
                <TableCell>
                  <Badge variant={employee.active ? 'default' : 'destructive'}>
                    {employee.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAssignEmployee(employee)}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Assign
                    </Button>
                    {/* <Button
                      size="sm"
                      variant={employee.active ? "destructive" : "default"}
                      onClick={() => handleActivateEmployee(employee, !employee.active)}
                    >
                      {employee.active ? 'Deactivate' : 'Activate'}
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employee Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-employeeId">Employee ID</Label>
              <Input
                id="edit-employeeId"
                value={editForm.employeeId}
                onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Select value={editForm.selectedLocation} onValueChange={(value) => setEditForm({ ...editForm, selectedLocation: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location._id} value={location._id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-active"
                checked={editForm.active}
                onCheckedChange={(checked) => setEditForm({ ...editForm, active: !!checked })}
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Assign Access URLs to {selectedEmployee?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Select specific URLs that this employee can access:
            </div>

            <div className="mb-2">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={toggleSelectAll}
                />
                <span>Select All</span>
              </label>
            </div>

            {Object.entries(getUrlHierarchy()).map(([category, urls]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={urls.every(url => isUrlSelected(`${category}-${url}`))}
                    onCheckedChange={(checked) => {
                      urls.forEach(url => {
                        handleUrlSelect(`${category}-${url}`, !!checked);
                      });
                    }}
                  />
                  <Label htmlFor={`category-${category}`} className="font-medium">
                    {category}
                  </Label>
                </div>

                <div className="ml-6 space-y-2">
                  {urls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`url-${category}-${url}`}
                        checked={isUrlSelected(`${category}-${url}`)}
                        onCheckedChange={(checked) => handleUrlSelect(`${category}-${url}`, !!checked)}
                      />
                      <Label htmlFor={`url-${category}-${url}`} className="text-sm">
                        {url}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button onClick={() => setIsAssignDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveAssignment} className="flex-1">
                Save Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog (Placeholder) */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-name">Full Name</Label>
              <Input id="add-name" placeholder="Enter full name" />
            </div>
            <div>
              <Label htmlFor="add-email">Email</Label>
              <Input id="add-email" type="email" placeholder="Enter email address" />
            </div>
            <div>
              <Label htmlFor="add-employeeId">Employee ID</Label>
              <Input id="add-employeeId" placeholder="Enter employee ID" />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">
                Add Employee
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EmployeeManagement;