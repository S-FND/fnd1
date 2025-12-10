import React from 'react';
import { useParams } from 'react-router-dom';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import EHSTrainingDetails from '@/components/ehs/training-form/EHSTrainingDetails';

const EHSTrainingDetailPage = () => {
  const { id } = useParams();

  return (
    <UnifiedSidebarLayout>
      <EHSTrainingDetails id={id} />
    </UnifiedSidebarLayout>
  );
};

export default EHSTrainingDetailPage;