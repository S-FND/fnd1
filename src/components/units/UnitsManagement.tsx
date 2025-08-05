
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, BarChart3, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Unit {
  id: string;
  name: string;
  location: string;
  city: string;
  adminName: string;
  adminEmail: string;
  employeeCount: number;
  esgScore: number;
  status: 'active' | 'pending' | 'inactive';
}

const UnitsManagement: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([
    {
      id: "unit-1",
      name: "Manufacturing Plant",
      location: "Chakala MIDC",
      city: "Mumbai",
      adminName: "Rahul Sharma",
      adminEmail: "rahul@fandoro.com",
      employeeCount: 124,
      esgScore: 78,
      status: "active"
    },
    {
      id: "unit-2",
      name: "R&D Center",
      location: "Electronic City",
      city: "Bangalore",
      adminName: "Priya Kumar",
      adminEmail: "priya@fandoro.com",
      employeeCount: 56,
      esgScore: 82,
      status: "active"
    },
    {
      id: "unit-3",
      name: "Sales Office",
      location: "Connaught Place",
      city: "New Delhi",
      adminName: "Amit Singh",
      adminEmail: "amit@fandoro.com",
      employeeCount: 42,
      esgScore: 65,
      status: "active"
    }
  ]);

  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    name: '',
    location: '',
    city: '',
    adminName: '',
    adminEmail: '',
    employeeCount: 0,
    status: 'active'
  });

  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [isEditingUnit, setIsEditingUnit] = useState(false);

  const handleAddUnit = () => {
    if (!newUnit.name || !newUnit.location || !newUnit.city || !newUnit.adminName || !newUnit.adminEmail) {
      toast.error("Please fill all required fields");
      return;
    }

    const unit: Unit = {
      id: `unit-${Date.now()}`,
      name: newUnit.name,
      location: newUnit.location,
      city: newUnit.city,
      adminName: newUnit.adminName,
      adminEmail: newUnit.adminEmail,
      employeeCount: newUnit.employeeCount || 0,
      esgScore: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
      status: 'active'
    };

    setUnits([...units, unit]);
    setNewUnit({
      name: '',
      location: '',
      city: '',
      adminName: '',
      adminEmail: '',
      employeeCount: 0,
      status: 'active'
    });
    setIsAddingUnit(false);
    toast.success("Unit added successfully");
  };

  const handleEditUnit = (unit: Unit) => {
    setEditUnit(unit);
    setIsEditingUnit(true);
  };

  const handleUpdateUnit = () => {
    if (!editUnit?.name || !editUnit?.location || !editUnit?.city || !editUnit?.adminName || !editUnit?.adminEmail) {
      toast.error("Please fill all required fields");
      return;
    }

    setUnits(units.map(unit => unit.id === editUnit.id ? editUnit : unit));
    setEditUnit(null);
    setIsEditingUnit(false);
    toast.success("Unit updated successfully");
  };

  const handleDeleteUnit = (id: string) => {
    setUnits(units.filter(unit => unit.id !== id));
    toast.success("Unit deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Company Units</h2>
        <Dialog open={isAddingUnit} onOpenChange={setIsAddingUnit}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
              <DialogDescription>
                Add a new business unit or location to your company.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({...newUnit, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={newUnit.location}
                  onChange={(e) => setNewUnit({...newUnit, location: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  value={newUnit.city}
                  onChange={(e) => setNewUnit({...newUnit, city: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admin-name" className="text-right">
                  Admin Name
                </Label>
                <Input
                  id="admin-name"
                  value={newUnit.adminName}
                  onChange={(e) => setNewUnit({...newUnit, adminName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admin-email" className="text-right">
                  Admin Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={newUnit.adminEmail}
                  onChange={(e) => setNewUnit({...newUnit, adminEmail: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee-count" className="text-right">
                  Employees
                </Label>
                <Input
                  id="employee-count"
                  type="number"
                  value={newUnit.employeeCount || ''}
                  onChange={(e) => setNewUnit({...newUnit, employeeCount: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingUnit(false)}>Cancel</Button>
              <Button onClick={handleAddUnit}>Add Unit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Unit Dialog */}
      <Dialog open={isEditingUnit} onOpenChange={setIsEditingUnit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogDescription>
              Update the unit details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editUnit?.name || ''}
                onChange={(e) => setEditUnit(editUnit ? {...editUnit, name: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Location
              </Label>
              <Input
                id="edit-location"
                value={editUnit?.location || ''}
                onChange={(e) => setEditUnit(editUnit ? {...editUnit, location: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-city" className="text-right">
                City
              </Label>
              <Input
                id="edit-city"
                value={editUnit?.city || ''}
                onChange={(e) => setEditUnit(editUnit ? {...editUnit, city: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-admin-name" className="text-right">
                Admin Name
              </Label>
              <Input
                id="edit-admin-name"
                value={editUnit?.adminName || ''}
                onChange={(e) => setEditUnit(editUnit ? {...editUnit, adminName: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-admin-email" className="text-right">
                Admin Email
              </Label>
              <Input
                id="edit-admin-email"
                type="email"
                value={editUnit?.adminEmail || ''}
                onChange={(e) => setEditUnit(editUnit ? {...editUnit, adminEmail: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-employee-count" className="text-right">
                Employees
              </Label>
              <Input
                id="edit-employee-count"
                type="number"
                value={editUnit?.employeeCount || ''}
                onChange={(e) => setEditUnit(editUnit ? {...editUnit, employeeCount: parseInt(e.target.value)} : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingUnit(false)}>Cancel</Button>
            <Button onClick={handleUpdateUnit}>Update Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Unit Admin</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>ESG Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.city}, {unit.location}</TableCell>
                  <TableCell>
                    <div>{unit.adminName}</div>
                    <div className="text-xs text-muted-foreground">{unit.adminEmail}</div>
                  </TableCell>
                  <TableCell>{unit.employeeCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        unit.esgScore >= 80 ? 'bg-green-500' : 
                        unit.esgScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}></span>
                      {unit.esgScore}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={unit.status === 'active' ? 'default' : 
                      unit.status === 'pending' ? 'outline' : 'secondary'}>
                      {unit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditUnit(unit)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteUnit(unit.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{units.length}</div>
            <p className="text-xs text-muted-foreground">Across {Array.from(new Set(units.map(u => u.city))).length} cities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{units.reduce((acc, unit) => acc + unit.employeeCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all units</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average ESG Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(units.reduce((acc, unit) => acc + unit.esgScore, 0) / units.length)}
            </div>
            <p className="text-xs text-muted-foreground">Company-wide average</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitsManagement;
