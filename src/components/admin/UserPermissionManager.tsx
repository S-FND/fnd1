// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';
// import { useToast } from '@/hooks/use-toast';
// import { useUserPermissions } from '@/hooks/useUserPermissions';
// import { usePortfolioAuth } from '@/hooks/usePortfolioAuth';
// import { DetailedNavigationItem, getDetailedNavigationStructure, flattenNavigationItems } from '@/data/navigation/detailedNavigation';
// import { supabase } from '@/integrations/supabase/client';
// import { Eye, User, Settings2, Save, RotateCcw } from 'lucide-react';

// interface UserProfile {
//   id: string;
//   user_id: string;
//   full_name: string | null;
//   email: string;
//   role: string;
// }

// interface UserPermissionManagerProps {
//   targetUser: UserProfile;
// }

// const UserPermissionManager: React.FC<UserPermissionManagerProps> = ({ targetUser }) => {
//   const { toast } = useToast();
//   const { profile } = usePortfolioAuth();
  
//   const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
//   const [previewMode, setPreviewMode] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Get all navigation items for permissions management
//   const getAllNavigationItems = () => {
//     const navigationStructure = getDetailedNavigationStructure();
//     const allItems = flattenNavigationItems(navigationStructure);
    
//     return allItems.map(item => ({
//       ...item,
//       hasPermission: getDefaultPermissionForRole(item, targetUser.role)
//     }));
//   };

//   // Get default permission based on role
//   const getDefaultPermissionForRole = (item: DetailedNavigationItem, userRole: string): boolean => {
//     if (!item.allowedRoles) return true; // If no role restrictions, allow access
//     return item.allowedRoles.includes(userRole as any);
//   };

//   // Initialize selected permissions
//   useEffect(() => {
//     const navigationStructure = getDetailedNavigationStructure();
//     const initialPermissions: Record<string, boolean> = {};
    
//     const collectPermissions = (items: DetailedNavigationItem[]) => {
//       items.forEach(item => {
//         initialPermissions[item.id] = getDefaultPermissionForRole(item, targetUser.role);
//         if (item.children) {
//           collectPermissions(item.children);
//         }
//       });
//     };
    
//     collectPermissions(navigationStructure);
//     setSelectedPermissions(initialPermissions);
//     setLoading(false);
//   }, [targetUser.user_id, targetUser.role]);

//   // Check if there are unsaved changes
//   useEffect(() => {
//     const navigationStructure = getDetailedNavigationStructure();
//     const defaultPermissions: Record<string, boolean> = {};
    
//     const collectDefaultPermissions = (items: DetailedNavigationItem[]) => {
//       items.forEach(item => {
//         defaultPermissions[item.id] = getDefaultPermissionForRole(item, targetUser.role);
//         if (item.children) {
//           collectDefaultPermissions(item.children);
//         }
//       });
//     };
    
//     collectDefaultPermissions(navigationStructure);
    
//     const changed = Object.keys(selectedPermissions).some(
//       key => selectedPermissions[key] !== defaultPermissions[key]
//     );
    
//     setHasChanges(changed);
//   }, [selectedPermissions, targetUser.role]);

//   const handlePermissionChange = (menuItemId: string, granted: boolean) => {
//     setSelectedPermissions(prev => ({
//       ...prev,
//       [menuItemId]: granted
//     }));

//     // Auto-grant parent permissions if child is granted
//     if (granted) {
//       const navigationStructure = getDetailedNavigationStructure();
//       const allItems = flattenNavigationItems(navigationStructure);
//       const item = allItems.find(i => i.id === menuItemId);
      
//       if (item?.parentId) {
//         setSelectedPermissions(prev => ({
//           ...prev,
//           [item.parentId!]: true
//         }));
//       }
//     }

//     // Auto-revoke child permissions if parent is revoked
//     if (!granted) {
//       const navigationStructure = getDetailedNavigationStructure();
//       const allItems = flattenNavigationItems(navigationStructure);
//       const children = allItems.filter(i => i.parentId === menuItemId);
      
//       const updates: Record<string, boolean> = {};
//       children.forEach(child => {
//         updates[child.id] = false;
//         // Recursively revoke grandchildren
//         const grandchildren = allItems.filter(i => i.parentId === child.id);
//         grandchildren.forEach(gc => {
//           updates[gc.id] = false;
//         });
//       });
      
//       setSelectedPermissions(prev => ({
//         ...prev,
//         ...updates
//       }));
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
      
//       // For demo purposes, simulate saving
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       toast({
//         title: "Success",
//         description: `Permissions updated for ${targetUser.full_name || targetUser.email}`,
//       });
      
//       setHasChanges(false);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update permissions. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = () => {
//     const navigationStructure = getDetailedNavigationStructure();
//     const resetPermissions: Record<string, boolean> = {};
    
//     const collectPermissions = (items: DetailedNavigationItem[]) => {
//       items.forEach(item => {
//         resetPermissions[item.id] = getDefaultPermissionForRole(item, targetUser.role);
//         if (item.children) {
//           collectPermissions(item.children);
//         }
//       });
//     };
    
//     collectPermissions(navigationStructure);
//     setSelectedPermissions(resetPermissions);
//   };

//   const renderNavigationTree = (items: DetailedNavigationItem[], level: number = 0) => {
//     return items.map((item) => {
//       const isSelected = selectedPermissions[item.id] ?? false;
//       const indent = level * 24;
      
//       return (
//         <div key={item.id} className="space-y-2">
//           <div className="flex items-center space-x-3" style={{ marginLeft: `${indent}px` }}>
//             <Checkbox
//               id={item.id}
//               checked={isSelected}
//               onCheckedChange={(checked) => handlePermissionChange(item.id, !!checked)}
//             />
//             <div className="flex items-center space-x-2">
//               {item.icon && <item.icon className="h-4 w-4" />}
//               <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
//                 {item.name}
//               </label>
//               <Badge variant={item.level === 'main' ? 'default' : item.level === 'submenu' ? 'secondary' : 'outline'}>
//                 {item.level}
//               </Badge>
//             </div>
//           </div>
          
//           {item.children && item.children.length > 0 && (
//             <div className="ml-6">
//               {renderNavigationTree(item.children, level + 1)}
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   const getPreviewNavigation = () => {
//     const navigationStructure = getDetailedNavigationStructure();
    
//     const filterItems = (items: DetailedNavigationItem[]): DetailedNavigationItem[] => {
//       return items.filter(item => {
//         const hasPermission = selectedPermissions[item.id] ?? false;
        
//         if (!hasPermission) return false;

//         if (item.children && item.children.length > 0) {
//           const filteredChildren = filterItems(item.children);
//           if (filteredChildren.length === 0 && !item.href) return false;
          
//           return {
//             ...item,
//             children: filteredChildren
//           };
//         }

//         return true;
//       }).map(item => {
//         if (item.children && item.children.length > 0) {
//           return {
//             ...item,
//             children: filterItems(item.children)
//           };
//         }
//         return item;
//       });
//     };

//     return filterItems(navigationStructure);
//   };

//   const renderPreviewTree = (items: DetailedNavigationItem[], level: number = 0) => {
//     return items.map((item) => {
//       const indent = level * 16;
      
//       return (
//         <div key={item.id} className="space-y-1">
//           <div className="flex items-center space-x-2 py-1" style={{ marginLeft: `${indent}px` }}>
//             {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
//             <span className="text-sm">{item.name}</span>
//             <Badge variant="outline" className="text-xs">
//               {item.level}
//             </Badge>
//           </div>
          
//           {item.children && item.children.length > 0 && (
//             <div>
//               {renderPreviewTree(item.children, level + 1)}
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center justify-center">
//             <div className="text-muted-foreground">Loading permissions...</div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   const navigationStructure = getDetailedNavigationStructure();
//   const previewNavigation = getPreviewNavigation();

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <User className="h-5 w-5" />
//           Manage Permissions: {targetUser.full_name || targetUser.email}
//         </CardTitle>
//         <CardDescription>
//           Assign specific page and feature access to this team member. Changes will be applied immediately after saving.
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent className="space-y-6">
//         <Tabs defaultValue="permissions" value={previewMode ? "preview" : "permissions"}>
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="permissions" onClick={() => setPreviewMode(false)}>
//               <Settings2 className="h-4 w-4 mr-2" />
//               Configure Permissions
//             </TabsTrigger>
//             <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
//               <Eye className="h-4 w-4 mr-2" />
//               Preview Navigation
//             </TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="permissions" className="space-y-4">
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-muted-foreground">
//                 Select the pages and features this user can access
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleReset}
//                   disabled={saving || !hasChanges}
//                 >
//                   <RotateCcw className="h-4 w-4 mr-2" />
//                   Reset
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={handleSave}
//                   disabled={saving || !hasChanges}
//                 >
//                   <Save className="h-4 w-4 mr-2" />
//                   {saving ? 'Saving...' : 'Save Changes'}
//                 </Button>
//               </div>
//             </div>
            
//             <ScrollArea className="h-[600px] border rounded-md p-4">
//               <div className="space-y-4">
//                 <div className="text-xs text-muted-foreground mb-4 p-3 bg-muted rounded">
//                   <strong>Navigation Structure:</strong> Select which pages and features {targetUser.full_name || targetUser.email} can access. 
//                   This includes main pages, submenus, and individual tabs within each section.
//                 </div>
//                 {renderNavigationTree(navigationStructure)}
//               </div>
//             </ScrollArea>
//           </TabsContent>
          
//           <TabsContent value="preview" className="space-y-4">
//             <div className="text-sm text-muted-foreground">
//               Preview of how the navigation will appear for this user
//             </div>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Navigation Preview</CardTitle>
//                 <CardDescription>
//                   This is how the sidebar navigation will look for {targetUser.full_name || targetUser.email}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-[600px] w-full rounded-md border p-4">
//                   {previewNavigation.length > 0 ? (
//                     <div className="space-y-3">
//                       {renderPreviewTree(previewNavigation)}
//                     </div>
//                   ) : (
//                     <div className="text-center text-muted-foreground py-12">
//                       No accessible pages selected. User will only see the dashboard.
//                     </div>
//                   )}
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// };

// export default UserPermissionManager;