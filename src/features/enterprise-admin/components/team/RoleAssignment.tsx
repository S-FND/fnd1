
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserCheck, Clock, CheckCircle } from 'lucide-react';

const RoleAssignment = () => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

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
      assignedDate: '2024-01-15'
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
      assignedDate: '2024-01-14'
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
      assignedDate: '2024-01-16'
    }
  ];

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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Role Assignment</CardTitle>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserCheck className="h-4 w-4 mr-2" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Role to Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Select Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newRole">Assign Role</Label>
                  <Select>
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
                  <Select>
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
                <div>
                  <Label htmlFor="assignDepartment">Department</Label>
                  <Select>
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
                <div className="flex gap-2">
                  <Button onClick={() => setIsAssignDialogOpen(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAssignDialogOpen(false)} className="flex-1">
                    Assign Role
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
