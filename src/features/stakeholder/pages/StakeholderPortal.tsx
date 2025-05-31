
import React, { useState } from 'react';
import StakeholderLogin from './StakeholderLogin';
import StakeholderMaterialityDashboard from './StakeholderMaterialityDashboard';
import { MaterialTopic, sasbTopics, griTopics } from '../../enterprise-admin/data/frameworkTopics';

// Mock data for demonstration
const mockStakeholderSession = {
  stakeholderName: 'John Doe',
  groupName: 'Executive Assessment',
  topics: [
    ...sasbTopics.slice(0, 3),
    ...griTopics.slice(0, 2)
  ] as MaterialTopic[]
};

const StakeholderPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stakeholderData, setStakeholderData] = useState(mockStakeholderSession);

  const handleLogin = (credentials: { username: string; password: string }) => {
    // In a real implementation, validate credentials against the database
    // For now, we'll simulate a successful login
    console.log('Login attempt with:', credentials);
    setIsAuthenticated(true);
  };

  const handleSavePrioritizations = (prioritizations: any[]) => {
    console.log('Saving prioritizations:', prioritizations);
    // In a real implementation, save to database
  };

  if (!isAuthenticated) {
    return <StakeholderLogin onLogin={handleLogin} />;
  }

  return (
    <StakeholderMaterialityDashboard
      stakeholderName={stakeholderData.stakeholderName}
      groupName={stakeholderData.groupName}
      topics={stakeholderData.topics}
      onSavePrioritizations={handleSavePrioritizations}
    />
  );
};

export default StakeholderPortal;
