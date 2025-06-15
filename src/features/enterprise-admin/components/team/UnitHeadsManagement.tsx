
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, UserPlus, Users } from 'lucide-react';

const UnitHeadsManagement = () => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Mock unit heads data
  const unitHeads = [
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: 'HR',
      location: 'Mumbai Office',
      city: 'Mumbai',
      teamSize: 12,
      assignedDate: '2024-01-10',
      status: 'Active',
      permissions: ['Add Team Members', 'Assign Data Collection Tasks', 'View Reports']
    },
    {
      id: 2,
      name: 'David Chen',
      email: 'david.chen@company.com',
      department: 'Operations',
      location: 'Bangalore Manufacturing',
      city: 'Bangalore',
      teamSize: 18,
      assignedDate: '2024-01-08',
      status: 'Active',
      permissions: ['Add Team Members', 'Assign Data Collection Tasks', 'Manage Workflows']
    },
    {
      id: 3,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      department: 'Finance',
      location: 'Delhi Warehouse',
      city: 'Delhi',
      teamSize: 8,
      assignedDate: '2024-01-12',
      status: 'Active',
      permissions: ['Add Team Members', 'Assign Data Collection Tasks', 'Financial Reports']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Unit Heads Management</CardTitle>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Crown className="h-4 w-4 mr-2" />
                Assign Unit Head
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Unit Head</DialogTitle>
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
                  <Label htmlFor="department">Department</Label>
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
                <div>
                  <Label htmlFor="location">Location</Label>
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
                <div className="flex gap-2">
                  <Button onClick={() => setIsAssignDialogOpen(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAssignDialogOpen(false)} className="flex-1">
                    Assign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {unitHeads.map((head) => (
            <Card key={head.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{head.name}</h3>
                      <p className="text-sm text-muted-foreground">{head.email}</p>
                    </div>
                  </div>
                  <Badge variant="default">{head.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">{head.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{head.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Team Size</p>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{head.teamSize} members</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {head.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit Permissions
                  </Button>
                  <Button size="sm" variant="outline">
                    Manage Team
                  </Button>
                  <Button size="sm" variant="outline">
                    View Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitHeadsManagement;
