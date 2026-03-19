import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw, Pencil, Trash2, Loader2, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StakeholderFormData, Stakeholder, StakeholderSubcategory } from './types';
import { useForm } from 'react-hook-form';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import { toast } from 'sonner';
import { httpClient } from '@/lib/httpClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApiStakeholder {
  _id: string;
  name: string;
  organization?: string;
  email: string;
  phone: string;
  subcategoryId: string;
  notes?: string;
  engagementLevel: 'low' | 'medium' | 'high';
  influence: 'low' | 'medium' | 'high';
  interest: 'low' | 'medium' | 'high';
  userId?: any;
  lastContact?: string;
  createdAt?: string;
  updatedAt?: string;
  companyEntityId?: string;
  __v?: number;
}

interface ApiCategory {
  _id: string;
  name: string;
  description?: string;
  category: 'internal' | 'external';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  status: boolean;
  data?: T;
  message?: string;
}

const ManageStakeholders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [categories, setCategories] = useState<StakeholderSubcategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch stakeholders and categories on component mount
  useEffect(() => {
    fetchStakeholders();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await httpClient.get<ApiResponse<ApiCategory[]>>('stakeholder-categories');
      console.log('Categories response:', response);
      
      if (response.data?.status === true && response.data?.data) {
        if (Array.isArray(response.data.data)) {
          const transformedData: StakeholderSubcategory[] = response.data.data.map((item: ApiCategory) => ({
            id: item._id,
            name: item.name,
            description: item.description || '',
            category: item.category
          }));
          setCategories(transformedData);
          console.log('Categories loaded:', transformedData.length);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchStakeholders = async () => {
    try {
      setIsLoading(true);
      const response = await httpClient.get<ApiStakeholder[]>(API_ENDPOINTS.STAKEHOLDERS.LIST);
      console.log('Stakeholder list response:', response);
      
      if (Array.isArray(response.data)) {
        const transformedData: Stakeholder[] = response.data.map((item: ApiStakeholder) => ({
          id: item._id,
          name: item.name,
          organization: item.organization || '',
          email: item.email,
          phone: item.phone,
          subcategoryId: item.subcategoryId,
          notes: item.notes || '',
          engagementLevel: item.engagementLevel,
          influence: item.influence,
          interest: item.interest,
          lastContact: item.lastContact ? new Date(item.lastContact) : new Date(),
          userId: typeof item.userId === 'object' ? item.userId?._id : item.userId
        }));
        setStakeholders(transformedData);
        console.log('Transformed stakeholders:', transformedData.length);
      } else {
        console.error('Response data is not an array:', response.data);
        toast.error('Invalid data format received');
      }
    } catch (error: any) {
      console.error('Error fetching stakeholders:', error);
      toast.error(error.response?.data?.message || 'Failed to load stakeholders');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter stakeholders based on search term
  const filteredStakeholders = stakeholders.filter(
    (stakeholder) =>
      stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stakeholder.organization && 
       stakeholder.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stakeholder.email && 
       stakeholder.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      getSubcategoryDisplay(stakeholder.subcategoryId)?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const form = useForm<StakeholderFormData>({
    defaultValues: {
      name: '',
      organization: '',
      email: '',
      phone: '',
      subcategoryId: '',
      notes: '',
      engagementLevel: 'medium',
      influence: 'medium',
      interest: 'medium'
    }
  });

  const editForm = useForm<StakeholderFormData>({
    defaultValues: {
      name: '',
      organization: '',
      email: '',
      phone: '',
      subcategoryId: '',
      notes: '',
      engagementLevel: 'medium',
      influence: 'medium',
      interest: 'medium'
    }
  });

  const onSubmitCreate = async (data: StakeholderFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting stakeholder data:', data);
      
      const formattedData = {
        name: data.name,
        organization: data.organization || '',
        email: data.email,
        phone: data.phone,
        subcategoryId: data.subcategoryId,
        notes: data.notes || '',
        engagementLevel: data.engagementLevel,
        influence: data.influence,
        interest: data.interest
        // No _id for create
      };

      const response = await httpClient.post<ApiResponse<any>>(
        API_ENDPOINTS.STAKEHOLDERS.CREATE, 
        formattedData
      );
      console.log('Create stakeholder response:', response);
      
      if (response.data?.status === true) {
        toast.success('Stakeholder added successfully');
        setIsDialogOpen(false);
        form.reset();
        await fetchStakeholders();
      } else {
        toast.error(response.data?.message || 'Failed to add stakeholder');
      }
    } catch (error: any) {
      console.error('Error creating stakeholder:', error);
      
      // Handle duplicate email/phone error
      if (error.response?.data?.message?.includes('already registered')) {
        toast.error('Email or phone number is already registered');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add stakeholder');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEdit = async (data: StakeholderFormData) => {
    if (!editingStakeholder) return;
    
    try {
      setIsSubmitting(true);
      console.log('Updating stakeholder:', data);
      
      // For update, include _id in the request body and use the same POST endpoint
      const formattedData = {
        _id: editingStakeholder.id, // Include _id for update
        name: data.name,
        organization: data.organization || '',
        email: data.email,
        phone: data.phone,
        subcategoryId: data.subcategoryId,
        notes: data.notes || '',
        engagementLevel: data.engagementLevel,
        influence: data.influence,
        interest: data.interest
      };

      // Use POST instead of PUT for update
      const response = await httpClient.post<ApiResponse<any>>(
        API_ENDPOINTS.STAKEHOLDERS.CREATE, // Same endpoint as create
        formattedData
      );
      console.log('Update stakeholder response:', response);
      
      if (response.data?.status === true) {
        toast.success('Stakeholder updated successfully');
        setIsEditDialogOpen(false);
        setEditingStakeholder(null);
        editForm.reset();
        await fetchStakeholders();
      } else {
        toast.error(response.data?.message || 'Failed to update stakeholder');
      }
    } catch (error: any) {
      console.error('Error updating stakeholder:', error);
      
      // Handle duplicate email/phone error
      if (error.response?.data?.message?.includes('already registered')) {
        toast.error('Email or phone number is already registered by another stakeholder');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update stakeholder');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      setIsLoading(true);
      // Check if DELETE endpoint exists, otherwise use a different approach
      // Your backend might not have a DELETE endpoint, so we need to check
      try {
        const response = await httpClient.delete<ApiResponse<void>>(
          `${API_ENDPOINTS.STAKEHOLDERS.DELETE(id)}`
        );
        
        if (response.data?.status === true) {
          setStakeholders(prev => prev.filter(s => s.id !== id));
          toast.success('Stakeholder deleted successfully');
        } else {
          toast.error(response.data?.message || 'Failed to delete stakeholder');
        }
      } catch (deleteError: any) {
        // If DELETE endpoint doesn't exist, show message
        console.error('Delete error:', deleteError);
        toast.error('Delete functionality not implemented in backend');
      }
    } catch (error: any) {
      console.error('Error deleting stakeholder:', error);
      toast.error(error.response?.data?.message || 'Failed to delete stakeholder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    editForm.reset({
      name: stakeholder.name,
      organization: stakeholder.organization || '',
      email: stakeholder.email,
      phone: stakeholder.phone,
      subcategoryId: stakeholder.subcategoryId,
      notes: stakeholder.notes || '',
      engagementLevel: stakeholder.engagementLevel,
      influence: stakeholder.influence,
      interest: stakeholder.interest
    });
    setIsEditDialogOpen(true);
  };

  const getSubcategoryDisplay = (subcategoryId: string) => {
    if (!subcategoryId) return { id: '', name: '-', category: 'external' as const };
    const found = categories.find(sc => sc.id === subcategoryId);
    return found || { id: subcategoryId, name: 'Unknown', category: 'external' as const };
  };

  // Group categories by type for better organization in select
  const getCategoryOptions = () => {
    const internalCategories = categories.filter(c => c.category === 'internal');
    const externalCategories = categories.filter(c => c.category === 'external');
    
    return (
      <>
        {internalCategories.length > 0 && (
          <>
            <SelectItem value="internal-header" disabled className="font-semibold text-blue-600 bg-blue-50">
              ─── INTERNAL CATEGORIES ───
            </SelectItem>
            {internalCategories.map((category) => (
              <SelectItem key={category.id} value={category.id} className="pl-6">
                {category.name}
              </SelectItem>
            ))}
          </>
        )}
        
        {externalCategories.length > 0 && (
          <>
            <SelectItem value="external-header" disabled className="font-semibold text-amber-600 bg-amber-50">
              ─── EXTERNAL CATEGORIES ───
            </SelectItem>
            {externalCategories.map((category) => (
              <SelectItem key={category.id} value={category.id} className="pl-6">
                {category.name}
              </SelectItem>
            ))}
          </>
        )}

        {categories.length === 0 && (
          <SelectItem value="no-categories" disabled>
            No categories available
          </SelectItem>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Stakeholders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} categories available • {stakeholders.length} total stakeholders
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              fetchStakeholders();
              fetchCategories();
            }}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          {/* Create Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isLoading || isSubmitting}>
                <Plus className="mr-2 h-4 w-4" /> Add Stakeholder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Stakeholder</DialogTitle>
                <DialogDescription>
                  Add a new stakeholder to your organization's registry. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: 'Name is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., John Doe" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="organization"
                      rules={{ required: 'Organization is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Acme Inc." {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subcategoryId"
                      rules={{ required: 'Category is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isSubmitting || categories.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={
                                  categories.length === 0 
                                    ? "No categories available" 
                                    : "Select a category"
                                } />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {getCategoryOptions()}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{ 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="john@example.com" 
                              type="email" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      rules={{ required: 'Phone number is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+1 (555) 123-4567" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="engagementLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Engagement</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="influence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Influence</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about this stakeholder..." 
                            className="resize-none"
                            rows={3}
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsDialogOpen(false);
                        form.reset();
                      }} 
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : 'Add Stakeholder'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Stakeholder</DialogTitle>
                <DialogDescription>
                  Update stakeholder information. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    rules={{ required: 'Name is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., John Doe" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Acme Inc." {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
                      name="subcategoryId"
                      rules={{ required: 'Category is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isSubmitting || categories.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {getCategoryOptions()}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="email"
                      rules={{ 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="john@example.com"
                              type="email" 
                              {...field} 
                              disabled={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
                      name="phone"
                      rules={{ required: 'Phone number is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+1 (555) 123-4567" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={editForm.control}
                      name="engagementLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Engagement</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
                      name="influence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Influence</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
                      name="interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={editForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about this stakeholder..." 
                            className="resize-none"
                            rows={3}
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingStakeholder(null);
                        editForm.reset();
                      }} 
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : 'Update Stakeholder'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Stakeholders</CardTitle>
          <CardDescription>
            View and manage all stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, organization, email, or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading stakeholders...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredStakeholders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-lg">No stakeholders found</p>
                        <p className="text-sm">
                          {searchTerm ? 'Try a different search term' : 'Add your first stakeholder to get started'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStakeholders.map((stakeholder) => {
                    const subcategory = getSubcategoryDisplay(stakeholder.subcategoryId);
                    return (
                      <TableRow key={stakeholder.id} className="group">
                        <TableCell className="font-medium">{stakeholder.name}</TableCell>
                        <TableCell>{stakeholder.organization || '-'}</TableCell>
                        <TableCell>{subcategory.name}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            subcategory.category === 'internal' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                          }`}>
                            {subcategory.category === 'internal' ? 'Internal' : 'External'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{stakeholder.email}</div>
                            <div className="text-xs text-muted-foreground">{stakeholder.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            stakeholder.engagementLevel === 'high'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : stakeholder.engagementLevel === 'medium'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {stakeholder.engagementLevel ? 
                              stakeholder.engagementLevel.charAt(0).toUpperCase() + stakeholder.engagementLevel.slice(1) 
                              : 'Medium'}
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(stakeholder)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(stakeholder.id, stakeholder.name)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell> */}
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(stakeholder)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageStakeholders;