
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockEmployees, mockAssignments, scope1Categories, scope2Categories, scope3Categories } from './mockData';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Pencil, Plus, Trash } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';

export const GHGDataAssignment = () => {
  const [selectedScope, setSelectedScope] = useState<string>("Scope 1");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>();
  const [showNewAssignmentDialog, setShowNewAssignmentDialog] = useState(false);
  const [assignments, setAssignments] = useState(mockAssignments);
  const { toast } = useToast();
  
  const allCategories = [
    ...scope1Categories.map(c => ({ scope: "Scope 1", ...c })),
    ...scope2Categories.map(c => ({ scope: "Scope 2", ...c })),
    ...scope3Categories.map(c => ({ scope: "Scope 3", ...c })),
  ];
  
  const filteredCategories = allCategories.filter(c => c.scope === selectedScope);
  
  const handleCreateAssignment = () => {
    if (!selectedEmployee || !selectedCategory || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please select an employee, category, and due date.",
        variant: "destructive",
      });
      return;
    }
    
    const newAssignment = {
      id: `assign-${assignments.length + 1}`.padStart(7, '0'),
      employeeId: selectedEmployee,
      scope: selectedScope,
      category: selectedCategory,
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      status: "pending"
    };
    
    setAssignments(prev => [...prev, newAssignment]);
    setShowNewAssignmentDialog(false);
    
    toast({
      title: "Assignment Created",
      description: "Data collection assignment has been created successfully.",
    });
    
    // Reset form
    setSelectedEmployee("");
    setSelectedCategory("");
    setDueDate(undefined);
  };
  
  const handleDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    
    toast({
      title: "Assignment Deleted",
      description: "Data collection assignment has been deleted.",
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Data Collection Assignments</CardTitle>
            <CardDescription>
              Delegate emissions data collection tasks to team members
            </CardDescription>
          </div>
          <Dialog open={showNewAssignmentDialog} onOpenChange={setShowNewAssignmentDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Data Collection Assignment</DialogTitle>
                <DialogDescription>
                  Assign emissions data collection tasks to employees
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select 
                    value={selectedEmployee} 
                    onValueChange={setSelectedEmployee}
                  >
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>{employee.name} ({employee.department})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scope">Emission Scope</Label>
                  <Select 
                    value={selectedScope} 
                    onValueChange={(value) => {
                      setSelectedScope(value);
                      setSelectedCategory("");
                    }}
                  >
                    <SelectTrigger id="scope">
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scope 1">Scope 1 (Direct)</SelectItem>
                      <SelectItem value="Scope 2">Scope 2 (Indirect)</SelectItem>
                      <SelectItem value="Scope 3">Scope 3 (Value Chain)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewAssignmentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAssignment}>Assign Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const employee = mockEmployees.find(e => e.id === assignment.employeeId);
                
                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{employee?.name}</TableCell>
                    <TableCell>{employee?.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{assignment.scope}</span>
                        <span className="text-xs text-muted-foreground">{assignment.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" disabled={assignment.status === "completed"}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No assignments found. Click 'New Assignment' to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
