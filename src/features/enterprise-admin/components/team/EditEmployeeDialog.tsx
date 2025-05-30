
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '../../types/team';

interface EditEmployeeDialogProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEmployee: (employee: Employee) => void;
  unitHeads: Employee[];
}

export const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  employee,
  isOpen,
  onClose,
  onUpdateEmployee,
  unitHeads
}) => {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    role: employee.role,
    department: employee.department,
    unitHeadId: employee.unitHeadId || '',
    permissions: employee.permissions
  });

  useEffect(() => {
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      unitHeadId: employee.unitHeadId || '',
      permissions: employee.permissions
    });
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEmployee: Employee = {
      ...employee,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      unitHeadId: formData.role !== 'Unit Head' ? formData.unitHeadId : undefined,
      permissions: formData.permissions
    };

    onUpdateEmployee(updatedEmployee);
    onClose();
  };

  const updatePermissionsBasedOnRole = (role: string) => {
    let permissions = { dataCollection: false, dataReview: false, teamManagement: false };
    
    switch (role) {
      case 'Unit Head':
        permissions = { dataCollection: true, dataReview: true, teamManagement: true };
        break;
      case 'Checker':
        permissions = { dataCollection: false, dataReview: true, teamManagement: false };
        break;
      case 'Maker':
        permissions = { dataCollection: true, dataReview: false, teamManagement: false };
        break;
    }
    
    setFormData(prev => ({ ...prev, role: role as any, permissions }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={updatePermissionsBasedOnRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unit Head">Unit Head</SelectItem>
                  <SelectItem value="Maker">Maker</SelectItem>
                  <SelectItem value="Checker">Checker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.role !== 'Unit Head' && (
            <div className="space-y-2">
              <Label>Reports To (Unit Head)</Label>
              <Select value={formData.unitHeadId} onValueChange={(value) => setFormData(prev => ({ ...prev, unitHeadId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit head" />
                </SelectTrigger>
                <SelectContent>
                  {unitHeads.map((head) => (
                    <SelectItem key={head.id} value={head.id}>
                      {head.name} - {head.location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataCollection"
                  checked={formData.permissions.dataCollection}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, dataCollection: checked as boolean }
                    }))
                  }
                />
                <Label htmlFor="dataCollection">Data Collection</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataReview"
                  checked={formData.permissions.dataReview}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, dataReview: checked as boolean }
                    }))
                  }
                />
                <Label htmlFor="dataReview">Data Review</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="teamManagement"
                  checked={formData.permissions.teamManagement}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      permissions: { ...prev.permissions, teamManagement: checked as boolean }
                    }))
                  }
                />
                <Label htmlFor="teamManagement">Team Management</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
