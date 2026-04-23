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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, RefreshCw, Loader2, Trash2, Pencil, Database, AlertCircle } from "lucide-react";
import { defaultStakeholderSubcategories } from '../../data/stakeholders';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StakeholderSubcategory } from './types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { httpClient } from '@/lib/httpClient';

// API Response interfaces matching your NestJS controller with @Res() usage
interface ApiCategory {
  _id: string;
  name: string;
  description?: string;
  category: 'internal' | 'external';
  isActive: boolean;
  stakeholderCount?: number;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

interface ApiResponse<T> {
  status: boolean;
  data?: T;
  message?: string;
}

interface InitializeResult {
  created: number;
  skipped: number;
  total: number;
  details?: Array<{ name: string; status: string }>;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<StakeholderSubcategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<StakeholderSubcategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [lastInitialized, setLastInitialized] = useState<Date | null>(null);
  const [showInitSuccess, setShowInitSuccess] = useState(false);
  const [initResult, setInitResult] = useState<InitializeResult | null>(null);

  // Direct endpoint strings matching your NestJS controller
  const ENDPOINTS = {
    LIST: 'stakeholder-categories',
    CREATE: 'stakeholder-categories',
    UPDATE: (id: string) => `stakeholder-categories/${id}`,
    DELETE: (id: string) => `stakeholder-categories/${id}`,
    STATISTICS: 'stakeholder-categories/statistics',
    INITIALIZE: 'stakeholder-categories/initialize'
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (showInitSuccess) {
      const timer = setTimeout(() => {
        setShowInitSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showInitSuccess]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      // Build query params based on active tab filter
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.append('category', activeTab);
      }

      const url = activeTab === 'all'
        ? ENDPOINTS.LIST
        : `${ENDPOINTS.LIST}?${params.toString()}`;

      const response = await httpClient.get<ApiResponse<ApiCategory[]>>(url);
      console.log('Category list response:', response);

      if (response.data?.status === true && response.data?.data) {
        if (Array.isArray(response.data.data)) {
          const transformedData: StakeholderSubcategory[] = response.data.data.map((item: ApiCategory) => ({
            id: item._id,
            name: item.name,
            description: item.description || '',
            category: item.category
          }));
          setCategories(transformedData);
        } else {
          console.error('Response data is not an array:', response.data.data);
        }
      } else {
        console.error('Invalid response structure:', response.data);
        setCategories(defaultStakeholderSubcategories);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setCategories(defaultStakeholderSubcategories);
    } finally {
      setIsLoading(false);
    }
  };

  // Form for creating new category
  const createForm = useForm<StakeholderSubcategory>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
      category: 'internal'
    }
  });

  // Form for editing category
  const editForm = useForm<StakeholderSubcategory>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
      category: 'internal'
    }
  });

  const onSubmitCreate = async (data: StakeholderSubcategory) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting category data:', data);

      const createDto = {
        name: data.name,
        description: data.description,
        category: data.category
      };

      const response = await httpClient.post<ApiResponse<ApiCategory>>(
        ENDPOINTS.CREATE,
        createDto
      );
      console.log('Create category response:', response);

      if (response.data?.status === true && response.data?.data) {
        const newCategory: StakeholderSubcategory = {
          id: response.data.data._id,
          name: response.data.data.name,
          description: response.data.data.description || '',
          category: response.data.data.category
        };

        setCategories(prev => [...prev, newCategory]);
        toast.success(response.data.message || 'Category created successfully');
        setIsDialogOpen(false);
        createForm.reset({
          id: '',
          name: '',
          description: '',
          category: 'internal'
        });
      } else {
      }
    } catch (error: any) {
      console.error('Error creating category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEdit = async (data: StakeholderSubcategory) => {
    if (!editingCategory) return;

    try {
      setIsSubmitting(true);
      console.log('Updating category:', data);

      const updateDto = {
        name: data.name,
        description: data.description,
        category: data.category
      };

      const response = await httpClient.put<ApiResponse<ApiCategory>>(
        ENDPOINTS.UPDATE(editingCategory.id),
        updateDto
      );
      console.log('Update category response:', response);

      if (response.data?.status === true && response.data?.data) {
        setCategories(prev => prev.map(cat =>
          cat.id === editingCategory.id
            ? {
              id: response.data.data._id,
              name: response.data.data.name,
              description: response.data.data.description || '',
              category: response.data.data.category
            }
            : cat
        ));

        toast.success(response.data.message || 'Category updated successfully');
        setIsEditDialogOpen(false);
        setEditingCategory(null);
        editForm.reset();
      } else {
      }
    } catch (error: any) {
      console.error('Error updating category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setIsLoading(true);
      const response = await httpClient.delete<ApiResponse<void>>(
        ENDPOINTS.DELETE(id)
      );

      if (response.data?.status === true) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        toast.success(response.data.message || 'Category deleted successfully');
      } else {
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeDefaults = async () => {
    // Prevent double-clicking within 2 seconds
    if (isInitializing) {
      toast.warning('Initialization already in progress. Please wait...');
      return;
    }

    // Check if already initialized recently (within last 30 seconds)
    if (lastInitialized && (new Date().getTime() - lastInitialized.getTime() < 30000)) {
      const secondsAgo = Math.round((new Date().getTime() - lastInitialized.getTime()) / 1000);

      // Show a more informative confirmation
      if (!confirm(
        `⚠️ Categories were already initialized ${secondsAgo} seconds ago.\n\n` +
        `Initializing again may create duplicate entries if your service doesn't handle duplicates.\n\n` +
        `Are you sure you want to proceed?`
      )) {
        return;
      }
    } else {
      // Show confirmation dialog with details
      if (!confirm(
        '📋 Initialize Default Stakeholder Categories\n\n' +
        'This action will:\n' +
        '✅ Create default internal categories (e.g., Executive Team, Board Members)\n' +
        '✅ Create default external categories (e.g., Investors, Regulators)\n' +
        '⚠️ Will skip categories that already exist (if your service handles duplicates)\n' +
        '❌ Will not delete any existing categories\n\n' +
        'Do you want to continue?'
      )) {
        return;
      }
    }

    try {
      setIsInitializing(true);
      setInitResult(null);

      const toastId = toast.loading('Initializing default categories...');

      console.log('Calling initialize endpoint:', ENDPOINTS.INITIALIZE);
      const response = await httpClient.post<ApiResponse<InitializeResult>>(
        ENDPOINTS.INITIALIZE,
        {}
      );

      console.log('Initialize response:', response);

      if (response.data?.status === true) {
        // Set last initialized time
        setLastInitialized(new Date());

        // Store result if available
        if (response.data.data) {
          setInitResult(response.data.data);
        }

        // Show success message with details
        const result = response.data.data;
        if (result) {
          toast.success(
            `✅ Initialized: ${result.created} created, ${result.skipped} skipped`,
            { id: toastId, duration: 5000 }
          );

          if (result.created > 0) {
            setShowInitSuccess(true);
          } else {
            toast.info('All categories already exist. No new categories were created.', {
              id: toastId,
              duration: 4000
            });
          }
        } else {
          toast.success(
            response.data.message || 'Default categories initialized successfully',
            { id: toastId, duration: 3000 }
          );
        }

        // Refresh the categories list
        await fetchCategories();
      } else {

      }
    } catch (error: any) {
      console.error('Error initializing defaults:', error);

      // Handle specific error cases
      if (error.response?.status === 409) {
        toast.warning(
          'Categories already exist in the database',
          { duration: 4000 }
        );
        // Still refresh to show existing categories
        await fetchCategories();
      } else if (error.response?.data?.message?.includes('duplicate') ||
        error.response?.data?.message?.includes('already exists')) {
        toast.info(
          'Categories already exist. No duplicates created.',
          { duration: 4000 }
        );
        // Still refresh to show existing categories
        await fetchCategories();
      } else {

      }
    } finally {
      setIsInitializing(false);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowInitSuccess(false), 5000);
    }
  };

  const handleEdit = (category: StakeholderSubcategory) => {
    setEditingCategory(category);
    editForm.reset({
      id: category.id,
      name: category.name,
      description: category.description,
      category: category.category
    });
    setIsEditDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchCategories();
    toast.info('Refreshing categories...');
  };

  // Filter categories for display based on active tab
  const getFilteredCategories = () => {
    if (activeTab === 'all') return categories;
    return categories.filter(cat => cat.category === activeTab);
  };

  // Check if categories exist
  const hasCategories = categories.length > 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Success Alert for Initialization */}
      {showInitSuccess && initResult && initResult.created > 0 && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">
            Default Categories Initialized!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Created {initResult.created} new categories. {initResult.skipped} categories already existed.
            {initResult.details && (
              <ul className="mt-2 list-disc list-inside text-sm">
                {initResult.details.slice(0, 3).map((detail, idx) => (
                  <li key={idx}>{detail.name}: {detail.status}</li>
                ))}
                {initResult.details.length > 3 && (
                  <li>...and {initResult.details.length - 3} more</li>
                )}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3">
        {/* Header (centered) */}
        <div className="flex justify-center text-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Stakeholder Categories
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage stakeholder categories and types for your organization
            </p>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex justify-end gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading || isInitializing}
            size="default"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>

          <Button
            variant={hasCategories ? "secondary" : "default"}
            onClick={handleInitializeDefaults}
            disabled={isLoading || isInitializing}
            size="default"
            className="relative min-w-[160px]"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                {lastInitialized ? "Re-initialize" : "Initialize Defaults"}
              </>
            )}

            {!isInitializing && lastInitialized && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </Button>

          {/* Create Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isLoading || isSubmitting || isInitializing} size="default">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new stakeholder category for your organization. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    rules={{ required: 'Category name is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Executive Team, Board Members, Investors"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the purpose and typical stakeholders in this category"
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

                  <FormField
                    control={createForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Category Type *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                            disabled={isSubmitting}
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="internal" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Internal
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="external" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                External
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        createForm.reset({
                          id: '',
                          name: '',
                          description: '',
                          category: 'internal'
                        });
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : 'Create Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the stakeholder category details.
                </DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    rules={{ required: 'Category name is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Executive Team, Board Members, Investors"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the purpose and typical stakeholders in this category"
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

                  <FormField
                    control={editForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Category Type *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-4"
                            disabled={isSubmitting}
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="internal" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Internal
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="external" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                External
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingCategory(null);
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
                      ) : 'Update Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Stakeholder Categories</CardTitle>
              <CardDescription>
                Total of {categories.length} categories ({categories.filter(c => c.category === 'internal').length} internal, {categories.filter(c => c.category === 'external').length} external)
                {lastInitialized && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    Last initialized: {lastInitialized.toLocaleTimeString()}
                  </span>
                )}
              </CardDescription>
            </div>
            {!hasCategories && !isLoading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInitializeDefaults}
                disabled={isInitializing}
                className="text-muted-foreground"
              >
                <Database className="mr-2 h-4 w-4" />
                Quick Initialize
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="internal">Internal</TabsTrigger>
              <TabsTrigger value="external">External</TabsTrigger>
            </TabsList>

            {/* All Categories Tab */}
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Category Name</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <div className="flex items-center justify-center text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading categories...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : getFilteredCategories().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                          <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col items-center gap-2">
                              <Database className="h-12 w-12 text-muted-foreground/50" />
                              <p className="text-lg font-medium">No categories found</p>
                              <p className="text-sm max-w-md text-center">
                                Get started by adding categories manually or initialize the default ones.
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(true)}
                                disabled={isInitializing}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Manually
                              </Button>
                              <Button
                                onClick={handleInitializeDefaults}
                                disabled={isInitializing}
                              >
                                {isInitializing ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Initializing...
                                  </>
                                ) : (
                                  <>
                                    <Database className="mr-2 h-4 w-4" />
                                    Initialize Defaults
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredCategories().map((category) => (
                        <TableRow key={category.id} className="group">
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.category === 'internal'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                              }`}>
                              {category.category === 'internal' ? 'Internal' : 'External'}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {category.description || <span className="italic">No description</span>}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(category)}
                                disabled={isLoading || isInitializing}
                                title="Edit category"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(category.id, category.name)}
                                disabled={isLoading || isInitializing}
                                title="Delete category"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Internal Categories Tab */}
            <TabsContent value="internal" className="space-y-4">
              {/* Similar content as before but with initialize button in empty state */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-12">
                          <div className="flex items-center justify-center text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : categories.filter(c => c.category === 'internal').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                          <div className="flex flex-col items-center gap-4">
                            <p className="text-lg">No internal categories found</p>
                            <Button
                              variant="outline"
                              onClick={handleInitializeDefaults}
                              disabled={isInitializing}
                              size="sm"
                            >
                              <Database className="mr-2 h-4 w-4" />
                              Initialize Defaults
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories
                        .filter(category => category.category === 'internal')
                        .map((category) => (
                          <TableRow key={category.id} className="group">
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {category.description || <span className="italic">No description</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(category)}
                                  disabled={isLoading || isInitializing}
                                  title="Edit category"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(category.id, category.name)}
                                  disabled={isLoading || isInitializing}
                                  title="Delete category"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* External Categories Tab */}
            <TabsContent value="external" className="space-y-4">
              {/* Similar content as before but with initialize button in empty state */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-12">
                          <div className="flex items-center justify-center text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Loading...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : categories.filter(c => c.category === 'external').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                          <div className="flex flex-col items-center gap-4">
                            <p className="text-lg">No external categories found</p>
                            <Button
                              variant="outline"
                              onClick={handleInitializeDefaults}
                              disabled={isInitializing}
                              size="sm"
                            >
                              <Database className="mr-2 h-4 w-4" />
                              Initialize Defaults
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories
                        .filter(category => category.category === 'external')
                        .map((category) => (
                          <TableRow key={category.id} className="group">
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {category.description || <span className="italic">No description</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(category)}
                                  disabled={isLoading || isInitializing}
                                  title="Edit category"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(category.id, category.name)}
                                  disabled={isLoading || isInitializing}
                                  title="Delete category"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement;