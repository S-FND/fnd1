
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, UserCheck } from 'lucide-react';
import { Employee } from '../../types/team';
import { EditEmployeeDialog } from './EditEmployeeDialog';

interface EmployeeTableProps {
  employees: Employee[];
  onUpdateEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  unitHeads: Employee[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onUpdateEmployee,
  onDeleteEmployee,
  unitHeads
}) => {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Unit Head': return 'bg-blue-100 text-blue-800';
      case 'Checker': return 'bg-purple-100 text-purple-800';
      case 'Maker': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentBadgeColor = (department: string) => {
    switch (department) {
      case 'HR': return 'bg-green-100 text-green-800';
      case 'Finance': return 'bg-yellow-100 text-yellow-800';
      case 'Operations': return 'bg-red-100 text-red-800';
      case 'Admin': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUnitHeadName = (unitHeadId?: string) => {
    if (!unitHeadId) return 'N/A';
    const unitHead = unitHeads.find(head => head.id === unitHeadId);
    return unitHead ? unitHead.name : 'Unknown';
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Reports To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(employee.role)}>
                  {employee.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getDepartmentBadgeColor(employee.department)}>
                  {employee.department}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{employee.location.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {employee.location.city} • {employee.location.type}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getUnitHeadName(employee.unitHeadId)}
              </TableCell>
              <TableCell>
                <Badge variant={employee.isActive ? "default" : "secondary"}>
                  {employee.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onUpdateEmployee({
                        ...employee,
                        isActive: !employee.isActive
                      })}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      {employee.isActive ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDeleteEmployee(employee.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingEmployee && (
        <EditEmployeeDialog
          employee={editingEmployee}
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdateEmployee={onUpdateEmployee}
          unitHeads={unitHeads}
        />
      )}
    </>
  );
};
