
export interface Employee {
  id: string;
  name: string;
  email: string;
  department?: string;
}

export const mockEmployees: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@company.com', department: 'Operations' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com', department: 'HR' },
  { id: '3', name: 'Mike Johnson', email: 'mike.j@company.com', department: 'Safety' },
  { id: '4', name: 'Sarah Wilson', email: 's.wilson@company.com', department: 'Operations' },
];

export const isExistingEmployee = (email: string): boolean => {
  return mockEmployees.some(emp => emp.email.toLowerCase() === email.toLowerCase());
};
