
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Plus } from 'lucide-react';
import { ESGDDWorkflow } from '../../types/esgDD';
import { fundingStagesDisplay } from '../../data/esgDD';

interface ESGDDWorkflowsListProps {
  workflows: ESGDDWorkflow[];
}

const ESGDDWorkflowsList: React.FC<ESGDDWorkflowsListProps> = ({ workflows }) => {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          New Workflow
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CAP Items</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.length > 0 ? (
              workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.companyName}</TableCell>
                  <TableCell>{fundingStagesDisplay[workflow.fundingStage]}</TableCell>
                  <TableCell>{new Date(workflow.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                      ${workflow.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        workflow.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                        'bg-amber-100 text-amber-700'}`}>
                      {workflow.status === 'completed' ? 'Completed' : 
                        workflow.status === 'in_progress' ? 'In Progress' : 'Draft'}
                    </div>
                  </TableCell>
                  <TableCell>{workflow.capItems.length}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No ESG due diligence workflows found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ESGDDWorkflowsList;
