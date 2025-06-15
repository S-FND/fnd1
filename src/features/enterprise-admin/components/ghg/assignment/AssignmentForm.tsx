
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { scope1Categories, scope2Categories, scope3Categories, scope4Categories } from '../mockData';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  location: string;
}

interface Assignment {
  id: string;
  employeeId: string;
  scope: string;
  category: string;
  dueDate: string;
  status: string;
}

interface AssignmentFormProps {
  employees?: Employee[];
  existingAssignment?: Assignment | null;
  onAssignSuccess?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ 
  employees = [], 
  existingAssignment = null, 
  onAssignSuccess,
  onCancel,
  onSubmit 
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>(existingAssignment?.employeeId || "");
  const [selectedScope, setSelectedScope] = useState<string>(existingAssignment?.scope?.replace("Scope ", "") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(existingAssignment?.dueDate ? new Date(existingAssignment.dueDate) : undefined);
  const { toast } = useToast();

  const allCategories = [
    ...scope1Categories.map(cat => ({ id: cat.id, name: cat.name, scope: "Scope 1" })),
    ...scope2Categories.map(cat => ({ id: cat.id, name: cat.name, scope: "Scope 2" })),
    ...scope3Categories.map(cat => ({ id: cat.id, name: cat.name, scope: "Scope 3" })),
    ...scope4Categories.map(cat => ({ id: cat.id, name: cat.name, scope: "Scope 4" }))
  ];

  // Filter categories based on the selected scope
  const filteredCategories = allCategories.filter(cat => {
    if (!selectedScope) return true;
    return cat.scope === `Scope ${selectedScope}`;
  });

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
      description: `Assigned ${categoryName} data collection to ${employees.find(e => e.id === selectedEmployee)?.name} due on ${format(date, "PPP")}`
    });
    
    // Reset form
    setSelectedEmployee("");
    setSelectedScope("");
    setSelectedCategory("");
    setDate(undefined);
    
    // Notify parent component
    if (onAssignSuccess) onAssignSuccess();
    if (onSubmit) onSubmit();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="employee">Employee</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger id="employee">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
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
              <SelectItem value="1">Scope 1 (Direct)</SelectItem>
              <SelectItem value="2">Scope 2 (Indirect)</SelectItem>
              <SelectItem value="3">Scope 3 (Value Chain)</SelectItem>
              <SelectItem value="4">Scope 4 (Avoided)</SelectItem>
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
      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleAssign} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> 
          {existingAssignment ? 'Update Assignment' : 'Assign Data Collection'}
        </Button>
      </div>
    </div>
  );
};

export default AssignmentForm;
