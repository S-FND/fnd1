import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserPlus, Search, Filter } from 'lucide-react';
import { createTeam } from '../../services/teamMangment'; // Import your API service
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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

  // Fetch employee data from API
  // useEffect(() => {
  //   const loadEmployees = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetchTeamData();

  //       // Transform API data to match your table structure
  //       const transformedEmployees = response.data[0]?.subuser?.map((emp: any) => ({
  //         ...emp,
  //         role: emp.accessUrls?.includes('admin') ? 'Admin' : 'User', // Example role mapping
  //         department: 'General', // Default department
  //         location: emp.selectedLocation || 'Unassigned',
  //         city: emp.selectedLocation?.split(' ')[0] || 'Unknown',
  //         status: emp.active ? 'Active' : 'Inactive'
  //       })) || [];
  //       // toast.success('Team members loaded successfully.');
  //       setEmployees(transformedEmployees);
  //     } catch (err) {
  //       toast.error('Unable to fetch team members. Please try again.');
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadEmployees();
  // }, []);

  const roles = ['Admin', 'User']; // Adjust based on your actual roles
  // const departments = ['HR', 'Admin', 'Finance', 'Operations'];
  // const locations = Array.from(new Set(employees.map(e => e.location))).filter(Boolean);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || employee.accessUrls?.includes(filterRole);
    const loc = employee.selectedLocation || 'Unassigned';
    const matchesLocation = filterLocation === 'all' || loc === filterLocation;

    return matchesSearch && matchesRole && matchesLocation;
  });

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
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Assign</Button>
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

export default EmployeeManagement;