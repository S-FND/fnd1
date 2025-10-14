import React from 'react';
import { ApprovalInbox } from '@/components/maker-checker/ApprovalInbox';

const ApprovalInboxPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approval Inbox</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve pending changes from your team
        </p>
      </div>
      <ApprovalInbox />
    </div>
  );
};

export default ApprovalInboxPage;
