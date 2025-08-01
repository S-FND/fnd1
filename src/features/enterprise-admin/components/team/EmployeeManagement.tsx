import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
// import { UserPlus, Search, Filter } from 'lucide-react';
import { createTeam } from '../../services/teamMangment'; // Import your API service
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Search, Filter, Edit, Users } from 'lucide-react';

interface Employee {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  active: boolean;
  accessUrls: string[];
  createdAt: string;
  updatedAt: string;
  role?: string; // Added to match your table structure
  department?: string; // Added to match your table structure
  location?: string; // Added to match your table structure
  city?: string; // Added to match your table structure
}

const EmployeeManagement = ({ employees, locations, refreshData, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // const [employees, setEmployees] = useState<Employee[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    location: ''
  });

  // Fetch employee data from API
  // useEffect(() => {
  //   const loadEmployees = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetchTeamData();

  const roles = ['Maker', 'Checker'];
  const departments = ['HR', 'Admin', 'Finance', 'Operations'];
  // const locations = ['Mumbai Office', 'Delhi Warehouse', 'Bangalore Manufacturing', 'Chennai Office'];
  
  // Mock pages and sections for assignment
  const pages = [
    { 
      id: 'esg', 
      name: 'ESG Data', 
      sections: [
        'Environmental Metrics',
        'Social Impact Data',
        'Governance Information',
        'Carbon Footprint',
        'Water Usage'
      ]
    },
    { 
      id: 'compliance', 
      name: 'Compliance', 
      sections: [
        'Regulatory Reporting',
        'Audit Trails',
        'Policy Compliance',
        'Risk Assessment'
      ]
    },
    { 
      id: 'reporting', 
      name: 'Reporting', 
      sections: [
        'Financial Reports',
        'Sustainability Reports',
        'Performance Metrics',
        'Dashboard Updates'
      ]
    }
  ];

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setEditForm({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      location: employee.location
    });
    setIsEditDialogOpen(true);
  };

  const handleAssignEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsAssignDialogOpen(true);
  };

  const handleSaveEdit = () => {
    // Here you would normally update the employee data
    console.log('Saving employee edit:', editForm);
    setIsEditDialogOpen(false);
  };

  const handleSaveAssignment = () => {
    // Here you would normally save the assignment data
    console.log('Saving assignment for employee:', selectedEmployee?.name);
    setIsAssignDialogOpen(false);
  };

  //   return matchesSearch && matchesRole && matchesLocation;
  // });

  // const handleDelete = async (id: string) => {
  //   try {
  //     // Call your API here
  //     await deleteEmployee(id); // Replace with actual API call
  //     toast.success("Employee deleted successfully");
  //     refreshData(); // Re-fetch data
  //   } catch (err) {
  //     toast.error("Failed to delete employee");
  //   }
  // };

  // const handleEdit = async (employee: Employee) => {
  //   try {
  //     await updateEmployee(employee); // Replace with actual API call
  //     toast.success("Employee updated successfully");
  //     refreshData();
  //   } catch (err) {
  //     toast.error("Failed to update employee");
  //   }
  // };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newEmployee = {
      name: formData.get('name'),
      email: formData.get('email'),
      employeeId: formData.get('employeeId'),
      role: formData.get('role'),
      selectedLocation: formData.get('location')
    };

    try {
      console.log('newEmployee', newEmployee);

      const payload = {
        employeeList: [newEmployee],
      };
      console.log('payload', payload);

      const response = await createTeam(payload); // Uses your actual API function

      if (response) {
        toast.success('Employee added successfully!');
        setIsAddDialogOpen(false);
        refreshData(); // Refresh data after adding
      } else {
        toast.error('Failed to add employee');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add employee.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

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
                    <Input id="name" name="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input id="employeeId" name="employeeId" placeholder="Enter employee ID" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select  name="role">
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
                    <Select name="location">
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
                    <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)} className="flex-1">
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
                  <Badge variant={employee.role === 'Admin' ? 'default' : 'secondary'}>
                    {employee.role}
                  </Badge>
                </TableCell>
                <TableCell>{employee.location}</TableCell>
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
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                type="email" 
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
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
              <Select value={editForm.department} onValueChange={(value) => setEditForm({...editForm, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Select value={editForm.location} onValueChange={(value) => setEditForm({...editForm, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Assign Data Entry Sections to {selectedEmployee?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Select specific pages and sections that this employee can input data for:
            </div>
            
            {pages.map((page) => (
              <div key={page.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id={`page-${page.id}`} />
                  <Label htmlFor={`page-${page.id}`} className="font-medium">
                    {page.name}
                  </Label>
                </div>
                
                <div className="ml-6 space-y-2">
                  {page.sections.map((section, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`${page.id}-section-${index}`} />
                      <Label htmlFor={`${page.id}-section-${index}`} className="text-sm">
                        {section}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Notes</Label>
                <Input placeholder="Add any specific instructions or notes..." />
              </div>
            </div>

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
    </Card>
  );
};

export default EmployeeManagement;