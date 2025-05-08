
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Check, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { mockEmployees, mockAssignments, scope1Categories, scope2Categories, scope3Categories, scope4Categories } from './mockData';
import { useToast } from "@/components/ui/use-toast";

export const GHGDataAssignment = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedScope, setSelectedScope] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const allCategories = [
    ...scope1Categories.map(cat => ({ id: cat.id, name: cat.name, scope: "Scope 1" })),
    ...scope2Categories.map(cat => ({ id: cat.id, name: cat.name, scope: "Scope 2" })),
    ...scope3Categories.map(cat => ({ id: cat.id, name: cat.name, scope: "Scope 3" })),
    ...scope4Categories.map(cat => ({ id: cat.id, name: cat.name, scope: "Scope 4" }))
  ];
  
  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedEmployee || !selectedScope || !selectedCategory || !date) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields before assigning tasks."
      });
      return;
    }

    const categoryName = allCategories.find(cat => cat.id === selectedCategory)?.name || "";
    
    toast({
      title: "Task assigned successfully",
      description: `Assigned ${categoryName} data collection to ${mockEmployees.find(e => e.id === selectedEmployee)?.name} due on ${format(date, "PPP")}`
    });
    
    // Reset form
    setSelectedEmployee("");
    setSelectedScope("");
    setSelectedCategory("");
    setDate(undefined);
  };

  // Filter categories based on the selected scope
  const filteredCategories = allCategories.filter(cat => {
    if (!selectedScope) return true;
    return cat.scope === selectedScope;
  });

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
    return mockEmployees.find(emp => emp.id === id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign GHG Data Collection Tasks</CardTitle>
          <CardDescription>
            Assign emission data collection tasks to personnel across your logistics facilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="employee">Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="scope">Emission Scope</Label>
                <Select value={selectedScope} onValueChange={setSelectedScope}>
                  <SelectTrigger id="scope">
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scope 1">Scope 1 (Direct)</SelectItem>
                    <SelectItem value="Scope 2">Scope 2 (Indirect)</SelectItem>
                    <SelectItem value="Scope 3">Scope 3 (Value Chain)</SelectItem>
                    <SelectItem value="Scope 4">Scope 4 (Avoided)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Emission Category</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                  disabled={!selectedScope}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleAssign} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Assign Data Collection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Assignments</CardTitle>
            <CardDescription>Track ongoing data collection tasks across your facilities</CardDescription>
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8 max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
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
              {mockAssignments.map((assignment) => {
                const employee = getEmployee(assignment.employeeId);
                if (!employee) return null;
                
                return (
                  <TableRow key={assignment.id}>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

