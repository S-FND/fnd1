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
import { Network, Plus, Search, RefreshCw } from "lucide-react";
import { sampleStakeholders, defaultStakeholderSubcategories } from '../../data/stakeholders';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StakeholderFormData, Stakeholder } from './types';
import { useForm } from 'react-hook-form';
import { useApiGet, useApiPost } from '@/hooks/useApi';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import { toast } from 'sonner';
import { httpClient } from '@/lib/httpClient';

const ManageStakeholders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // API hooks for demonstration
  const { data: apiStakeholders, loading: fetchLoading, error: fetchError, get: fetchStakeholders } = useApiGet<Stakeholder[]>();
  const { loading: createLoading, post: createStakeholder } = useApiPost<Stakeholder>();

  // Dummy API call on component mount
  useEffect(() => {
    handleFetchStakeholders();
  }, []);

  const handleFetchStakeholders = async () => {
    try {
      let stakeHolderList=await httpClient.get(API_ENDPOINTS.STAKEHOLDERS.LIST)
      logger.log('stakeHolderList',stakeHolderList)
      if(stakeHolderList.status == 200){
        if (stakeHolderList?.data && Array.isArray(stakeHolderList.data)) {
          const data: Stakeholder[] = stakeHolderList.data;
          setStakeholders(data);
        }
      }
    } catch (error) {
      // Error already handled by interceptors, using local data
      logger.log('Fallback to local data');
    }
  };

  // Filter stakeholders based on search term
  const filteredStakeholders = stakeholders.filter(
    (stakeholder) =>
      stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stakeholder.organization && 
       stakeholder.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      defaultStakeholderSubcategories
        .find(sc => sc.id === stakeholder.subcategoryId)?.name
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

  const onSubmit = async (data: StakeholderFormData) => {
    try {
      logger.log('data',data)
      let createStakeHolder=await httpClient.post(API_ENDPOINTS.STAKEHOLDERS.CREATE,data)
      logger.log('createStakeHolder',createStakeHolder)
      if(createStakeHolder['data']['status']){
        setIsDialogOpen(false);
        handleFetchStakeholders();
      }
    } catch (error) {
      // Fallback to local addition
      // const newStakeholder: Stakeholder = {
      //   id: `${stakeholders.length + 1}`,
      //   ...data,
      //   lastContact: new Date()
      // };
      // setStakeholders([...stakeholders, newStakeholder]);
      // setIsDialogOpen(false);
      // form.reset();
    }
  };

  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Stakeholders</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleFetchStakeholders}
            disabled={fetchLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${fetchLoading ? 'animate-spin' : ''}`} />
            {fetchLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Stakeholder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Stakeholder</DialogTitle>
                <DialogDescription>
                  Add a new stakeholder to your organization's registry
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Stakeholder name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subcategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {defaultStakeholderSubcategories.map((category) => (
                                <SelectItem key={category.id} value={`${category.id}|${category.category}`}>
                                  {category.name} ({category.category === 'internal' ? 'Internal' : 'External'})
                                </SelectItem>
                              ))}
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
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
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
                          <Textarea placeholder="Additional notes about this stakeholder" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createLoading}>
                      {createLoading ? 'Adding...' : 'Add Stakeholder'}
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
            {fetchError && (
              <span className="text-amber-600 ml-2">
                (Using local data - API unavailable)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search stakeholders..." 
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStakeholders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No stakeholders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStakeholders.map((stakeholder) => {
                    const subcategory = defaultStakeholderSubcategories.find(
                      sc => sc.id === stakeholder.subcategoryId.split('|')[0]
                    );
                    return (
                      <TableRow key={stakeholder.id}>
                        <TableCell className="font-medium">{stakeholder.name}</TableCell>
                        <TableCell>{stakeholder.organization || '-'}</TableCell>
                        <TableCell>{subcategory?.name || '-'}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            subcategory?.category === 'internal' 
                              ? 'bg-blue-50 text-blue-800' 
                              : 'bg-amber-50 text-amber-800'
                          }`}>
                            {subcategory?.category === 'internal' ? 'Internal' : 'External'}
                          </div>
                        </TableCell>
                        <TableCell>{stakeholder.email || '-'}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            stakeholder.engagementLevel === 'high'
                              ? 'bg-green-50 text-green-800'
                              : stakeholder.engagementLevel === 'medium'
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-gray-50 text-gray-800'
                          }`}>
                            {stakeholder.engagementLevel || 'Medium'}
                          </div>
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
