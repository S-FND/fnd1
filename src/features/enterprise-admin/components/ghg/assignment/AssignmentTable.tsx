
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Check } from "lucide-react";

interface Assignment {
  id: string;
  employeeId: string;
  scope: string;
  category: string;
  dueDate: string;
  status: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  location: string;
}

interface AssignmentTableProps {
  assignments?: Assignment[];
  employees?: Employee[];
  onViewDetails?: (id: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ 
  assignments = [], 
  employees = [], 
  onViewDetails,
  searchTerm: externalSearchTerm, 
  onSearchChange: externalOnSearchChange 
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  
  // Use either external or internal search state
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const onSearchChange = externalOnSearchChange || setInternalSearchTerm;

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-amber-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  // Get employee by ID
  const getEmployee = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(assignment => {
    const employee = getEmployee(assignment.employeeId);
    if (!employee) return false;
    
    return (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.scope.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assignments..."
          className="pl-8 max-w-xs"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssignments.map((assignment) => {
            const employee = getEmployee(assignment.employeeId);
            if (!employee) return null;
            
            return (
              <TableRow 
                key={assignment.id}
                className="cursor-pointer"
                onClick={() => onViewDetails && onViewDetails(assignment.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {employee.name}
                  </div>
                </TableCell>
                <TableCell>{assignment.scope}</TableCell>
                <TableCell>{assignment.category}</TableCell>
                <TableCell>{assignment.dueDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(assignment.status)}>
                    {assignment.status === 'completed' && <Check className="mr-1 h-3.5 w-3.5" />}
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{employee.location}</TableCell>
              </TableRow>
            );
          })}
          
          {filteredAssignments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No assignments found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default AssignmentTable;
