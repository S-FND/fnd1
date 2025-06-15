
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { defaultStakeholderSubcategories } from '../../data/stakeholders';
import { cheqStakeholders } from '../../data/cheq-mock-data';

const CheQStakeholders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [engagementFilter, setEngagementFilter] = useState('all');

  // Filter stakeholders based on search and filters
  const filteredStakeholders = cheqStakeholders.filter(stakeholder => {
    // Search filter
    const searchMatch = 
      stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stakeholder.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stakeholder.email && stakeholder.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const subcategory = defaultStakeholderSubcategories.find(sub => sub.id === stakeholder.subcategoryId);
    const categoryMatch = categoryFilter === 'all' || subcategory?.category === categoryFilter;
    
    // Engagement filter
    const engagementMatch = engagementFilter === 'all' || stakeholder.engagementLevel === engagementFilter;
    
    return searchMatch && categoryMatch && engagementMatch;
  });

  // Convert last contact date to formatted string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Get category name from subcategory ID
  const getCategoryFromSubcategoryId = (subId: string) => {
    const subcategory = defaultStakeholderSubcategories.find(sub => sub.id === subId);
    return subcategory?.category === 'internal' ? 'Internal' : 'External';
  };

  // Get subcategory name from ID
  const getSubcategoryName = (subId: string) => {
    const subcategory = defaultStakeholderSubcategories.find(sub => sub.id === subId);
    return subcategory ? subcategory.name : subId;
  };

  // Get badge color based on engagement level
  const getBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="search" className="text-sm font-medium">Search Stakeholders</label>
          <Input
            id="search"
            placeholder="Search by name, organization, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-48">
          <label htmlFor="categoryFilter" className="text-sm font-medium">Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="categoryFilter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-48">
          <label htmlFor="engagementFilter" className="text-sm font-medium">Engagement Level</label>
          <Select value={engagementFilter} onValueChange={setEngagementFilter}>
            <SelectTrigger id="engagementFilter">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline">Export Data</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead className="hidden md:table-cell">Subcategory</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Last Contact</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead className="hidden lg:table-cell">Influence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStakeholders.map((stakeholder) => (
              <TableRow key={stakeholder.id}>
                <TableCell className="font-medium">{stakeholder.name}</TableCell>
                <TableCell>{stakeholder.organization}</TableCell>
                <TableCell className="hidden md:table-cell">{getSubcategoryName(stakeholder.subcategoryId)}</TableCell>
                <TableCell className="hidden md:table-cell">{getCategoryFromSubcategoryId(stakeholder.subcategoryId)}</TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(stakeholder.lastContact)}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(stakeholder.engagementLevel)}>
                    {stakeholder.engagementLevel.charAt(0).toUpperCase() + stakeholder.engagementLevel.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline">
                    {stakeholder.influence.charAt(0).toUpperCase() + stakeholder.influence.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-muted-foreground">
          Showing {filteredStakeholders.length} of {cheqStakeholders.length} stakeholders
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheQStakeholders;
