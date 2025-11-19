import React from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import ActionLogViewer from '@/components/action-log/ActionLogPage';

const ActionLogPage: React.FC = () => {
  return (
    <UnifiedSidebarLayout>
      <ActionLogViewer />
    </UnifiedSidebarLayout>
  );
};

export default ActionLogPage;
