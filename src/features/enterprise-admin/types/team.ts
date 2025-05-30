
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Maker' | 'Checker' | 'Unit Head';
  department: 'HR' | 'Admin' | 'Finance' | 'Operations';
  location: {
    type: 'Warehouse' | 'Office' | 'Manufacturing Unit';
    city: string;
    name: string;
  };
  unitHeadId?: string; // For hierarchy
  isActive: boolean;
  joinDate: string;
  permissions: {
    dataCollection: boolean;
    dataReview: boolean;
    teamManagement: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'Warehouse' | 'Office' | 'Manufacturing Unit';
  city: string;
  address: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: 'HR' | 'Admin' | 'Finance' | 'Operations';
  description: string;
  headOfDepartment?: string;
}
