import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Shield, MapPin, Edit, Save } from 'lucide-react';
import { getDetailedNavigationStructure, flattenNavigationItems } from '@/data/navigation/detailedNavigation';

import { useRouteProtection } from '@/hooks/useRouteProtection';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { httpClient } from '@/lib/httpClient';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { logger } from '@/hooks/logger';

interface AccessLevel {
  menuItemId: string;
  level: string,
  menuItem: string,
  url: string,
  navigationType: string,
  parentId: string,
  hasChildren: boolean,
  accessLevel: 'no_access' | 'read' | 'write' | 'admin';
}

interface LocationAssignment {
  locationId: string;
  locationName: string;
  assigned: boolean;
  unitId: string;
  _id:string;
}

const EmployeeDetailsPage = () => {

  logger.log('🟢 EmployeeDetailsPage: Component starting to render');
  const { employeeId } = useParams();
  logger.log('🟢 EmployeeDetailsPage: Retrieved employeeId from params:', employeeId);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('permissions');

  const { isLoading } = useRouteProtection(['admin','employee']); // or required roles
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }


  // Get all navigation items for access control
  const navigationStructure = getDetailedNavigationStructure();
  const allMenuItems = flattenNavigationItems(navigationStructure);
  logger.log('🟢 EmployeeDetailsPage: Flattened navigation items:', allMenuItems);
  logger.log('🟢 EmployeeDetailsPage: Navigation structure:', navigationStructure);
  // Mock access levels - in real app, fetch from user_menu_permissions table
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>(
    allMenuItems.map(item => ({
      menuItem: item.name,
      menuItemId: item.id,
      level: item.level, // Default access level
      "url": item.href || 'N/A',
      "navigationType": item.level || 'unknown',
      "parentId": item.parentId || null,
      "hasChildren": item.children ? item.children.length > 0 : false,
      "accessLevel": 'no_access' as const
    }))
  );



  const [employee, setEmployee] = useState(null)

  // Mock locations - in real app, fetch from locations table
  const [locationAssignments, setLocationAssignments] = useState<LocationAssignment[]>();

  const [editForm, setEditForm] = useState(null);

  const getAccessLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'admin': return 'destructive';
      case 'write': return 'default';
      case 'read': return 'secondary';
      default: return 'outline';
    }
  };

  // const updateAccessLevel = (menuItemId: string, level: AccessLevel['accessLevel']) => {
  //   setAccessLevels(prev =>
  //     prev.map(item =>
  //       item.menuItemId === menuItemId
  //         ? { ...item, accessLevel: level }
  //         : item
  //     )
  //   );
  // };

//logic to inherit or cascade permissions from a parent menu item to its child submenus
  const updateAccessLevel = (menuItemId: string, level: AccessLevel['accessLevel']) => {
    setAccessLevels(prev =>
      prev.map(item => {
        // First, check if this is the item being updated
        if (item.menuItemId === menuItemId) {
          return { ...item, accessLevel: level };
        }

        // If not, check if this item is a descendant of the updated item
        const isDescendant = isItemDescendant(item.menuItemId, menuItemId, allMenuItems);
        if (isDescendant) {
          return { ...item, accessLevel: level };
        }

        // If neither, return the item unchanged
        return item;
      })
    );
  };

  /**
   * Helper function to determine if an item is a descendant of a parent item.
   * @param itemId - The ID of the potential descendant item.
   * @param parentId - The ID of the potential parent item.
   * @param menuItems - The flat list of all menu items.
   * @returns boolean - True if itemId is a descendant of parentId.
   */
  const isItemDescendant = (itemId: string, parentId: string, menuItems: any[]): boolean => {
    // Find the item we are checking
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return false;

    // If the item has no parent, it cannot be a descendant.
    if (!item.parentId) return false;

    // If the item's direct parent is the target parent, it's a direct child.
    if (item.parentId === parentId) {
      return true;
    }

    // Otherwise, recursively check if the item's parent is a descendant of the target parent.
    return isItemDescendant(item.parentId, parentId, menuItems);
  };
  

  const toggleLocationAssignment = (locationId: string) => {
    setLocationAssignments(prev =>
      prev.map(location =>
        location._id === locationId
          ? { ...location, assigned: !location.assigned }
          : location
      )
    );
  };

  const handleSave = () => {
    // Here you would save the changes to the database
    logger.log('Saving employee changes:', {
      employee: editForm,
      accessLevels,
      locationAssignments
    });
    setIsEditing(false);
  };

  const handleSubmitPermissions = () => {
    let accessLevelData = accessLevels.map(access => {
      const menuItem = allMenuItems.find(item => item.id === access.menuItemId);
      logger.log('Processing access for menuItemId:', access.menuItemId, 'Found menuItem:', menuItem);
      logger.log('Current access level:', access);
      const getNavigationHierarchy = (item: any) => {
        if (!item) return 'Unknown';

        // Determine the type based on the navigation structure
        const isMainMenu = !item.parentId;
        const hasChildren = item.children && item.children.length > 0;
        const parentItem = allMenuItems.find(parent => parent.id === item.parentId);
        const isTab = parentItem && !parentItem.parentId === false; // Has grandparent

        if (isMainMenu) {
          return hasChildren ? 'Main Menu (with submenus)' : 'Main Menu (standalone)';
        } else if (isTab) {
          return 'Tab';
        } else {
          return 'Submenu';
        }
      };

      return {
        menuItem: menuItem?.name,
        menuItemId: access.menuItemId,
        url: menuItem?.href || 'N/A',
        navigationType: getNavigationHierarchy(menuItem),
        level: menuItem?.level || 'unknown',
        parentId: menuItem?.parentId || null,
        hasChildren: menuItem?.children ? menuItem.children.length > 0 : false,
        accessLevel: access.level
      };
    })
    logger.log('Page Permissions:', accessLevelData);
    saveTeamPageAccess(employeeId, accessLevels);
  };

  const handleSubmitLocations = async () => {
    const selectedLocations = locationAssignments.filter(location => location.assigned);
    logger.debug('Selected Locations:', selectedLocations);
    try {
      let payload = {
        subuserId: employeeId,
        email: employee?.email || null,
        locations: selectedLocations.map(loc => loc.locationId)
      };
      let response = await httpClient.post('subuser/activate', payload);
      logger.log('Save Team Page Access Response:', response);
      if (response.status === 201) {
        toast.success('Page permissions updated successfully.');
        getEmployeeDetails(employeeId);
      } else {
        toast.error('Failed to update page permissions.');
      }
    } catch (error) {
      logger.error('Error saving location assignments:', error);
      toast.error('Failed to update location assignments.');
      
    }
  };

  const saveTeamPageAccess = async (employeeId: string, accessLevels: AccessLevel[]) => {
    try {
      let payload = {
        subuserId: employeeId,
        email: employee?.email || null,
        accessUrls: accessLevels.map(access => {
          const menuItem = allMenuItems.find(item => item.id === access.menuItemId);

          const getNavigationHierarchy = (item: any) => {
            if (!item) return 'Unknown';

            // Determine the type based on the navigation structure
            const isMainMenu = !item.parentId;
            const hasChildren = item.children && item.children.length > 0;
            const parentItem = allMenuItems.find(parent => parent.id === item.parentId);
            const isTab = parentItem && !parentItem.parentId === false; // Has grandparent

            if (isMainMenu) {
              return hasChildren ? 'Main Menu (with submenus)' : 'Main Menu (standalone)';
            } else if (isTab) {
              return 'Tab';
            } else {
              return 'Submenu';
            }
          };

          return {
            menuItem: menuItem?.name,
            menuItemId: access.menuItemId,
            url: menuItem?.href || 'N/A',
            navigationType: getNavigationHierarchy(menuItem),
            level: menuItem?.level || 'unknown',
            parentId: menuItem?.parentId || null,
            hasChildren: menuItem?.children ? menuItem.children.length > 0 : false,
            accessLevel: access.accessLevel || 'no_access'
          };
        })
      };
      let response = await httpClient.post('subuser/activate', payload);
      logger.log('Save Team Page Access Response:', response);
      if (response.status === 201) {
        toast.success('Page permissions updated successfully.');
        getEmployeeDetails(employeeId);
      } else {
        toast.error('Failed to update page permissions.');
      }
    } catch (error) {
      logger.error('Error saving page permissions:', error);
      toast.error('Failed to update page permissions.');
    }
  }

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
              value={accessLevels.find(a => a.menuItemId === section.id)?.accessLevel || 'no_access'}
              onValueChange={(value) => updateAccessLevel(section.id, value as AccessLevel['accessLevel'])}
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
                  value={accessLevels.find(a => a.menuItemId === submenu.id)?.accessLevel || 'no_access'}
                  onValueChange={(value) => updateAccessLevel(submenu.id, value as AccessLevel['accessLevel'])}
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
                    onValueChange={(value) => updateAccessLevel(tab.id, value as AccessLevel['accessLevel'])}
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

  const getEmployeeDetails = async (id: string) => {
    try {
      let employeeDataResponse = await httpClient.get(`subuser?id=${employeeId}`);
      logger.log('Employee Details Response:', employeeDataResponse);
      if (employeeDataResponse.status === 200) {
        if (employeeDataResponse.data['data'] && employeeDataResponse.data['data'].length > 0
          && employeeDataResponse.data['data'][0]['subuser']
          && employeeDataResponse.data['data'][0]['subuser'].length > 0) {
          let subUser = employeeDataResponse.data['data'][0]['subuser'][0];
          let existingAccessLevels = subUser.accessUrls || [];
          logger.log('Existing Access Levels:', existingAccessLevels);
          if (existingAccessLevels.length === 0) {
            // If no existing access levels, initialize with no_access
            existingAccessLevels = allMenuItems.map(item => ({
              menuItem: item.name,
              menuItemId: item.id,
              level: item.level, // Default access level
              "url": item.href || 'N/A',
              "navigationType": item.level || 'unknown',
              "parentId": item.parentId || null,
              "hasChildren": item.children ? item.children.length > 0 : false,
              "accessLevel": 'no_access' as const
            }));
          }
          setAccessLevels(existingAccessLevels)
          logger.log('Setting employee state with:', subUser);
          setEmployee(subUser);
        }

        // setEditForm({
        //   name: employeeDataResponse.data.name,
        //   email: employeeDataResponse.data.email,
        //   phone: employeeDataResponse.data.phone,
        //   emergencyContact: employeeDataResponse.data.emergencyContact,
        //   department: employeeDataResponse.data.department,
        //   role: employeeDataResponse.data.role
        // });
      } else {
        toast.error('Failed to fetch employee details.');
      }
    } catch (error) {
      logger.error('Error fetching employee details:', error);
      toast.error('Failed to fetch employee details.');
    }

  }

  const getCompanyLocations = async () => {
    try {
      let locationsResponse = await httpClient.get(`company/locations`);
      logger.log('Company Locations Response:', locationsResponse);
      if (locationsResponse.status === 200) {
        if (locationsResponse.data['data'] && locationsResponse.data['data'].length > 0) {
          let locationsData = locationsResponse.data['data'];
          logger.log('Setting locationAssignments state with:', locationsData);
          let updatedLocations = locationsData.map(location => ({
            locationId: location._id,
            _id:location._id,
            locationName: location.name,
            assigned: false, // Default to unassigned, will update based on employee data
            unitId: location.unitId
          }));
          setLocationAssignments(updatedLocations);
        }

      } else {
        toast.error('Failed to fetch company locations.');
      }
    } catch (error) {
      logger.error('Error fetching company locations:', error);
      toast.error('Failed to fetch company locations.');
    }
  }

  useEffect(() => {
    // let employeeDetailResponse=awai
    getEmployeeDetails(employeeId);
  }, [employeeId]);

  useEffect(() => {
    logger.debug('Location assignments updated:', locationAssignments);
  }, [locationAssignments]);

  useEffect(() => {
    getCompanyLocations();
  }, []);

  return (
    <UnifiedSidebarLayout>
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
              <h1 className="text-2xl font-bold">{employee?.name}</h1>
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
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={editForm.emergencyContact}
                      onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={editForm.department} onValueChange={(value) => setEditForm({ ...editForm, department: value })}>
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
                    <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
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
                    <span className="font-medium">{employee?.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="font-medium">{employee?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span className="font-medium">{employee?.mobile || 'N/A'}</span>
                  </div>
                  {/* <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Emergency:</span>
                  <span className="font-medium">{employee?.emergencyContact}</span>
                </div> */}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Department:</span>
                    <span className="font-medium">{employee?.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Role:</span>
                    <Badge variant={employee?.role === 'Maker' ? 'default' : 'secondary'}>
                      {employee?.role || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={employee?.active ? 'default' : 'destructive'}>
                      {employee?.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">CreatedAt Date:</span>
                    <span className="font-medium">{new Date(employee?.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Manager:</span>
                    <span className="font-medium">{employee?.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="font-medium">{employee?.location}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissions & Locations Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Access Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure page permissions and location assignments for this employee
                </p>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="permissions" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Page Permissions
                    </TabsTrigger>
                    <TabsTrigger value="locations" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location Assignments
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="permissions" className="space-y-6">
                    <div className="space-y-6">
                      {renderNavigationAccess()}
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button onClick={handleSubmitPermissions}>
                        Submit Page Permissions
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="locations" className="space-y-6">
                    <div className="grid gap-3 md:grid-cols-2">
                      {locationAssignments && locationAssignments.map(location => (
                        <div key={location.locationId} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={`location-${location._id}`}
                            checked={location.assigned}
                            onCheckedChange={() => toggleLocationAssignment(location._id)}
                          />
                          <Label
                            htmlFor={`location-${location._id}`}
                            className="flex-1 cursor-pointer"
                          >
                            {location.locationName} ({location.unitId})
                          </Label>
                          {location.assigned && (
                            <Badge variant="default" className="text-xs">
                              Assigned
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button onClick={handleSubmitLocations}>
                        Submit Location Assignments
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UnifiedSidebarLayout>

  );
};

export default EmployeeDetailsPage;