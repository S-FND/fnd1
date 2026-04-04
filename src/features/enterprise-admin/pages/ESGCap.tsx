
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useRouteProtection } from '@/hooks/useRouteProtection';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Upload, Download, Search, FileUp, FileText, FileSpreadsheet } from 'lucide-react';
import { mockESGCapItems } from '../data/esgDD';
import { machineDDCapItems } from '@/features/machine-dd/data/mockMachineDD';
import { ESGCapItem } from '../types/esgDD';
import { ESGCapTable } from '../components/esg-cap/ESGCapTable';

const ESGCapPage = () => {
  const { isLoading } = useRouteProtection(['admin', 'unit_admin']);
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ESGCapItem; direction: 'asc' | 'desc' } | null>(
    { key: 'deadline', direction: 'asc' }
  );
  const [items, setItems] = useState<ESGCapItem[]>([...mockESGCapItems, ...machineDDCapItems]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [isDragging, setIsDragging] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'unit_admin')) {
    return <Navigate to="/login" />;
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof ESGCapItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleItemUpdate = (updatedItem: ESGCapItem) => {
    setItems(prevItems => 
      prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div>
        <Link to="/esg-dd" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to ESG DD
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">ESG Corrective Action Plan</h1>
        <p className="text-muted-foreground">
          Track and manage corrective actions from ESG due diligence assessments.
        </p>
      </div>

      {/* Action Bar */}
      <Card className="shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left: Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search issues..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setIsDownloadOpen(true)} className="flex-1 sm:flex-initial">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <Button onClick={() => setIsUploadOpen(true)} className="flex-1 sm:flex-initial">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <ESGCapTable 
            sortedItems={sortedItems} 
            sortConfig={sortConfig} 
            requestSort={requestSort}
            onItemUpdate={handleItemUpdate}
          />
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 pb-6">
        <Button variant="outline" size="lg">
          Request CAP Change
        </Button>
        <Button size="lg">
          Accept CAP
        </Button>
      </div>

      {/* Upload Document Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload supporting documents for ESG corrective action items.
            </DialogDescription>
          </DialogHeader>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX, XLSX, CSV (Max 10MB)
            </p>
            <input id="file-upload" type="file" className="hidden" accept=".pdf,.docx,.xlsx,.csv" />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Template Modal */}
      <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Download Template</DialogTitle>
            <DialogDescription>
              Select a format to download the ESG CAP template.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {[
              { value: 'pdf', label: 'PDF Document', icon: FileText, desc: 'Best for printing and sharing' },
              { value: 'docx', label: 'Word Document', icon: FileText, desc: 'Editable text format' },
              { value: 'xlsx', label: 'Excel Spreadsheet', icon: FileSpreadsheet, desc: 'For data entry and analysis' },
            ].map((format) => (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  selectedFormat === format.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <format.icon className={`h-5 w-5 ${selectedFormat === format.value ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="text-sm font-medium">{format.label}</p>
                  <p className="text-xs text-muted-foreground">{format.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download {selectedFormat.toUpperCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ESGCapPage;
