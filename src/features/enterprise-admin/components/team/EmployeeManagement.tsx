import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserPlus, Search, Pencil, UserCog } from 'lucide-react';
import { createTeam } from '../../services/teamMangment'; // Make sure to import updateEmployee
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Employee {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  active: boolean;
  accessUrls: string[];
  selectedLocation?: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
  userAccess?: any;
}

const EmployeeManagement = ({ employees, locations, refreshData, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');

  const roles = ['Admin', 'User'];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.accessUrls?.includes(filterRole);
    const loc = employee.selectedLocation || 'Unassigned';
    const matchesLocation = filterLocation === 'all' || loc === filterLocation;

    return matchesSearch && matchesRole && matchesLocation;
  });

  const handleEditClick = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const updatedEmployee = {
        _id: currentEmployee._id,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        employeeId: formData.get('employeeId') as string,
        role: formData.get('role') as string,
        selectedLocation: formData.get('location') as string,
        active: currentEmployee.active // Keep the existing status
      };

      const response = await createTeam(updatedEmployee); // Call your API function

      if (response) {
        toast.success('Employee updated successfully!');
        setIsEditDialogOpen(false);
        refreshData();
      } else {
        toast.error('Failed to update employee');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update employee.');
      console.error(err);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const newEmployee = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      employeeId: formData.get('employeeId') as string,
      role: formData.get('role') as string,
      selectedLocation: formData.get('location') as string
    };

    try {
      const payload = {
        employeeList: [newEmployee],
      };

      const response = await createTeam(payload);

      if (response) {
        toast.success('Employee added successfully!');
        setIsAddDialogOpen(false);
        refreshData();
      } else {
        toast.error('Failed to add employee');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add employee.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const userlocation = currentEmployee?.userAccess?.[0]?.location;
console.log('currentEmployee',currentEmployee?.userAccess?.[0]?.location);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Employee Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Enter full name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Enter email address" required />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" name="employeeId" placeholder="Enter employee ID" required />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue="user">
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role.toLowerCase()}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select name="location" required>
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
                  <div className="flex gap-2">
                    <Button type="button" onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Add Employee
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                <SelectItem key={role} value={role.toLowerCase()}>{role}</SelectItem>
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
                  <Badge variant={employee.accessUrls?.includes('admin') ? 'default' : 'secondary'}>
                    {employee.accessUrls?.includes('admin') ? 'Admin' : 'User'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {locations.find(loc => loc._id === employee.selectedLocation)?.name || 'Unassigned'}
                </TableCell>
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
                      onClick={() => handleEditClick(employee)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {/* <Button size="sm" variant="outline">
                      <UserCog className="h-4 w-4 mr-1" />
                      Assign
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            {currentEmployee && (
              <form onSubmit={handleEditEmployee} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      defaultValue={currentEmployee.name}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      defaultValue={currentEmployee.email}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-employeeId">Employee ID</Label>
                    <Input
                      id="edit-employeeId"
                      name="employeeId"
                      defaultValue={currentEmployee.employeeId}
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                      name="role"
                      defaultValue={currentEmployee.accessUrls?.includes('admin') ? 'admin' : 'user'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role.toLowerCase()}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div>
                    <Label htmlFor="edit-location">Location</Label>
                    <Select 
                      name="location" 
                      defaultValue={currentEmployee.selectedLocation}
                      required
                    >
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
                  </div> */}
                  <div>
                    <Label htmlFor="edit-location">Location</Label>
                    <Select
                      name="location"
                      value={userlocation || ""}
                      onValueChange={(value) => {
                        setCurrentEmployee(prev => ({
                          ...prev,
                          selectedLocation: value
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location">
                          {userlocation
                            ? locations.find(loc => loc._id === userlocation)?.name || "Select location"
                            : "Select location"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {/* Add "None" option first if needed */}
                        <SelectItem key="none" value="None">None</SelectItem>

                        {/* Map through locations */}
                        {locations.map(location => (
                          <SelectItem key={location._id} value={location._id}>
                            {location.unitId ? `${location.name} (${location.unitId})` : location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setIsEditDialogOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmployeeManagement;