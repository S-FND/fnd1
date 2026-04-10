import React, { useState, useEffect } from 'react';
import StakeholderLogin from './StakeholderLogin';
import StakeholderMaterialityDashboard from './StakeholderMaterialityDashboard';
import StakeholderResultsView from './StakeholderResultsView';
import { MaterialTopic, sasbTopics, griTopics } from '../../enterprise-admin/data/frameworkTopics';
import { logger } from '@/hooks/logger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Get user from localStorage
const storedUser = JSON.parse(localStorage.getItem('fandoro-user') || '{}');
console.log('fandoro-user:', storedUser);

// Mock data for demonstration
const mockStakeholderSession = {
  stakeholderName: storedUser.name || '',
  stakeholderEmail: storedUser.email || '',
  stakeholderId: storedUser._id || '',
  groupName: '',
  topics: [
    ...sasbTopics.slice(0, 3),
    ...griTopics.slice(0, 2)
  ] as MaterialTopic[]
};

const StakeholderPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stakeholderData, setStakeholderData] = useState(mockStakeholderSession);
  const [activeTab, setActiveTab] = useState('assessment');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [existingPrioritizations, setExistingPrioritizations] = useState<any[]>([]);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    // If user exists in localStorage, auto-login
    if (storedUser && storedUser._id) {
      console.log('Auto-login with user:', storedUser);
      setIsAuthenticated(true);
      
      // Load saved assessment from localStorage
      const savedKey = `materiality_${storedUser._id}_${storedUser._id}_Executive_Assessment`;
      const savedData = localStorage.getItem(savedKey);
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.prioritizations) {
            setExistingPrioritizations(parsed.prioritizations);
          }
          if (parsed.hasSubmitted) {
            setHasSubmitted(parsed.hasSubmitted);
            if (parsed.hasSubmitted) {
              setActiveTab('results');
            }
          }
          console.log('Loaded saved assessment:', parsed);
        } catch (error) {
          console.error('Error loading saved assessment:', error);
        }
      }
    }
  }, []);

  const handleLogin = (credentials: { username: string; password: string }) => {
    // For demo, accept any credentials
    logger.log('Login attempt with:', credentials);
    
    // Create a mock user if needed
    const mockUser = {
      _id: 'mock-user-id',
      name: credentials.username.split('@')[0] || 'Stakeholder',
      email: credentials.username,
      role: 'StakeHolder'
    };
    
    localStorage.setItem('fandoro-user', JSON.stringify(mockUser));
    setIsAuthenticated(true);
    
    // Update stakeholder data with login info
    setStakeholderData({
      ...stakeholderData,
      stakeholderName: mockUser.name,
      stakeholderEmail: mockUser.email,
      stakeholderId: mockUser._id
    });
  };

  const handleSavePrioritizations = (prioritizations: any[]) => {
    logger.log('Saving prioritizations:', prioritizations);
    
    // Save to localStorage
    const saveKey = `materiality_${stakeholderData.stakeholderId}_${stakeholderData.stakeholderId}_${stakeholderData.groupName.replace(/\s/g, '_')}`;
    localStorage.setItem(saveKey, JSON.stringify({
      prioritizations,
      timestamp: new Date().toISOString(),
      stakeholderName: stakeholderData.stakeholderName,
      groupName: stakeholderData.groupName,
      version: '1.0',
      hasSubmitted: false
    }));
  };

  const handleSubmitPrioritizations = (prioritizations: any[]) => {
    logger.log('Submitting prioritizations:', prioritizations);
    
    // Save as submitted to localStorage
    const saveKey = `materiality_${stakeholderData.stakeholderId}_${stakeholderData.stakeholderId}_${stakeholderData.groupName.replace(/\s/g, '_')}`;
    localStorage.setItem(saveKey, JSON.stringify({
      prioritizations,
      timestamp: new Date().toISOString(),
      stakeholderName: stakeholderData.stakeholderName,
      groupName: stakeholderData.groupName,
      version: '1.0',
      hasSubmitted: true,
      submittedAt: new Date().toISOString()
    }));
    
    setHasSubmitted(true);
    setActiveTab('results');
  };

  const handleLogout = () => {
    localStorage.removeItem('fandoro-user');
    setIsAuthenticated(false);
    setHasSubmitted(false);
    setActiveTab('assessment');
  };

  if (!isAuthenticated) {
    return <StakeholderLogin onLogin={handleLogin} />;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Stakeholder Portal</h1>
          <p className="text-muted-foreground">
            Welcome, {stakeholderData.stakeholderName} | Group: {stakeholderData.groupName}
          </p>
          {stakeholderData.stakeholderEmail && (
            <p className="text-xs text-muted-foreground mt-1">
              {stakeholderData.stakeholderEmail}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-md hover:bg-red-50"
        >
          Logout
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="assessment" disabled={hasSubmitted}>
            Materiality Assessment
          </TabsTrigger>
          <TabsTrigger value="results">
            Aggregated Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <StakeholderMaterialityDashboard
            stakeholderName={stakeholderData.stakeholderName}
            groupName={stakeholderData.groupName}
            topics={stakeholderData.topics}
            onSavePrioritizations={handleSavePrioritizations}
            onSubmitPrioritizations={handleSubmitPrioritizations}
            existingPrioritizations={existingPrioritizations}
            hasSubmitted={hasSubmitted}
            stakeholderId={stakeholderData.stakeholderId}
          />
        </TabsContent>

        <TabsContent value="results">
          <StakeholderResultsView
            stakeholderName={stakeholderData.stakeholderName}
            groupName={stakeholderData.groupName}
            topics={stakeholderData.topics}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StakeholderPortal;