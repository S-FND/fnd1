import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Shield, MapPin, Edit, Save } from 'lucide-react';
import { getDetailedNavigationStructure, flattenNavigationItems } from '@/data/navigation/detailedNavigation';

interface AccessLevel {
  menuItemId: string;
  level: 'no_access' | 'read' | 'write' | 'admin';
}

interface LocationAssignment {
  locationId: string;
  locationName: string;
  assigned: boolean;
}

const EmployeeDetailsPage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock employee data - in real app, fetch based on employeeId
  const employee = {
    id: employeeId,
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Maker',
    department: 'Finance',
    location: 'Mumbai Office',
    city: 'Mumbai',
    status: 'Active',
    joinDate: '2023-01-15',
    phone: '+91 98765 43210',
    emergencyContact: '+91 87654 32109',
    manager: 'Jane Smith',
    employeeId: 'EMP001'
  };

  // Get all navigation items for access control
  const navigationStructure = getDetailedNavigationStructure();
  const allMenuItems = flattenNavigationItems(navigationStructure);

  // Mock access levels - in real app, fetch from user_menu_permissions table
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>(
    allMenuItems.map(item => ({
      menuItemId: item.id,
      level: 'read' as const // Default access level
    }))
  );

  // Mock locations - in real app, fetch from locations table
  const [locationAssignments, setLocationAssignments] = useState<LocationAssignment[]>([
    { locationId: '1', locationName: 'Mumbai Office', assigned: true },
    { locationId: '2', locationName: 'Delhi Warehouse', assigned: false },
    { locationId: '3', locationName: 'Bangalore Manufacturing', assigned: false },
    { locationId: '4', locationName: 'Chennai Office', assigned: false },
    { locationId: '5', locationName: 'Kolkata Branch', assigned: false },
    { locationId: '6', locationName: 'Hyderabad Tech Center', assigned: false }
  ]);

  const [editForm, setEditForm] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    emergencyContact: employee.emergencyContact,
    department: employee.department,
    role: employee.role
  });

  const getAccessLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'admin': return 'destructive';
      case 'write': return 'default';
      case 'read': return 'secondary';
      default: return 'outline';
    }
  };

  const updateAccessLevel = (menuItemId: string, level: AccessLevel['level']) => {
    setAccessLevels(prev => 
      prev.map(item => 
        item.menuItemId === menuItemId 
          ? { ...item, level }
          : item
      )
    );
  };

  const toggleLocationAssignment = (locationId: string) => {
    setLocationAssignments(prev => 
      prev.map(location => 
        location.locationId === locationId 
          ? { ...location, assigned: !location.assigned }
          : location
      )
    );
  };

  const handleSave = () => {
    // Here you would save the changes to the database
    console.log('Saving employee changes:', {
      employee: editForm,
      accessLevels,
      locationAssignments
    });
    setIsEditing(false);
  };

  const renderNavigationAccess = () => {
    return navigationStructure.map(section => (
      <div key={section.id} className="space-y-4">
        <div className="flex items-center gap-2">
          <section.icon className="h-5 w-5" />
          <h4 className="font-medium text-lg">{section.name}</h4>
        </div>
        
        {/* Main section access */}
        <div className="ml-7 space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <span className="font-medium">{section.name}</span>
              {section.href && (
                <Badge variant="outline" className="text-xs">Main Page</Badge>
              )}
            </div>
            <Select
              value={accessLevels.find(a => a.menuItemId === section.id)?.level || 'no_access'}
              onValueChange={(value) => updateAccessLevel(section.id, value as AccessLevel['level'])}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_access">No Access</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submenu access */}
          {section.children && section.children.map(submenu => (
            <div key={submenu.id} className="ml-4 space-y-2">
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2">
                  <submenu.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{submenu.name}</span>
                  <Badge variant="outline" className="text-xs">Submenu</Badge>
                </div>
                <Select
                  value={accessLevels.find(a => a.menuItemId === submenu.id)?.level || 'no_access'}
                  onValueChange={(value) => updateAccessLevel(submenu.id, value as AccessLevel['level'])}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_access">No Access</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tab access */}
              {submenu.children && submenu.children.map(tab => (
                <div key={tab.id} className="ml-4 flex items-center justify-between p-2 border rounded-sm bg-muted/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{tab.name}</span>
                    <Badge variant="outline" className="text-xs">Tab</Badge>
                  </div>
                  <Select
                    value={accessLevels.find(a => a.menuItemId === tab.id)?.level || 'no_access'}
                    onValueChange={(value) => updateAccessLevel(tab.id, value as AccessLevel['level'])}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_access">None</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="write">Write</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/team-management')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team Management
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{employee.name}</h1>
            <p className="text-muted-foreground">Employee Details & Access Management</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Employee Details Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Employee Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={editForm.emergencyContact}
                    onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={editForm.department} onValueChange={(value) => setEditForm({...editForm, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maker">Maker</SelectItem>
                      <SelectItem value="Checker">Checker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Employee ID:</span>
                  <span className="font-medium">{employee.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-medium">{employee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="font-medium">{employee.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Emergency:</span>
                  <span className="font-medium">{employee.emergencyContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="font-medium">{employee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <Badge variant={employee.role === 'Maker' ? 'default' : 'secondary'}>
                    {employee.role}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={employee.status === 'Active' ? 'default' : 'destructive'}>
                    {employee.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Join Date:</span>
                  <span className="font-medium">{new Date(employee.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Manager:</span>
                  <span className="font-medium">{employee.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="font-medium">{employee.location}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Access & Locations Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Access Control Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access Control
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure access levels for each menu item and feature
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderNavigationAccess()}
            </CardContent>
          </Card>

          {/* Location Assignment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Assignments
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Assign employee to specific locations for data entry and access
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {locationAssignments.map(location => (
                  <div key={location.locationId} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`location-${location.locationId}`}
                      checked={location.assigned}
                      onCheckedChange={() => toggleLocationAssignment(location.locationId)}
                    />
                    <Label 
                      htmlFor={`location-${location.locationId}`}
                      className="flex-1 cursor-pointer"
                    >
                      {location.locationName}
                    </Label>
                    {location.assigned && (
                      <Badge variant="default" className="text-xs">
                        Assigned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;