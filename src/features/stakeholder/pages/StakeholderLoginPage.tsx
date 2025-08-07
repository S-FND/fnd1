
import React, { useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MaterialTopic, sasbTopics, griTopics } from '../../enterprise-admin/data/frameworkTopics';
import { StakeholderPrioritization, Stakeholder, initialStakeholders } from '../../enterprise-admin/data/stakeholderPrioritization';
import StakeholderMaterialityDashboard from './StakeholderMaterialityDashboard';
import StakeholderResultsView from './StakeholderResultsView';

// Helper functions for localStorage
const getStoredStakeholders = (): Stakeholder[] => {
  const stored = localStorage.getItem('stakeholders');
  return stored ? JSON.parse(stored) : initialStakeholders;
};

const saveStakeholders = (stakeholders: Stakeholder[]) => {
  localStorage.setItem('stakeholders', JSON.stringify(stakeholders));
};

const getStakeholderByEmail = (email: string): Stakeholder | null => {
  const stakeholders = getStoredStakeholders();
  return stakeholders.find(s => s.email === email) || null;
};

// Mock stakeholder session data - maps emails to their assigned topics
const mockStakeholderSessions = {
  'john@company.com': {
    groupName: 'Executive Assessment',
    topics: [
      ...sasbTopics.slice(0, 4),
      ...griTopics.slice(0, 3)
    ] as MaterialTopic[],
    canViewResults: true
  },
  'sarah@company.com': {
    groupName: 'Management Review',
    topics: [
      ...sasbTopics.slice(0, 3),
      ...griTopics.slice(0, 4)
    ] as MaterialTopic[],
    canViewResults: true
  },
  'demo@stakeholder.com': {
    groupName: 'Demo Assessment',
    topics: [
      ...sasbTopics.slice(0, 5),
      ...griTopics.slice(0, 2)
    ] as MaterialTopic[],
    canViewResults: false
  }
};

const StakeholderLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stakeholderData, setStakeholderData] = useState<any>({
    stakeholderName: 'John Smith',
    groupName: 'Executive Assessment',
    topics: [
      ...sasbTopics.slice(0, 4),
      ...griTopics.slice(0, 3)
    ] as MaterialTopic[],
    hasSubmitted: false,
    canViewResults: true
  });
  const [currentView, setCurrentView] = useState<'assessment' | 'results'>('assessment');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get stakeholder data from stored stakeholders
      const stakeholder = getStakeholderByEmail(email);
      const sessionConfig = mockStakeholderSessions[email as keyof typeof mockStakeholderSessions];
      
      if (stakeholder && sessionConfig && password === 'stakeholder123') {
        const hasSubmitted = stakeholder.prioritizations.length > 0;
        
        const stakeholderData = {
          stakeholder,
          stakeholderName: stakeholder.name,
          groupName: sessionConfig.groupName,
          topics: sessionConfig.topics,
          hasSubmitted,
          canViewResults: sessionConfig.canViewResults
        };
        
        setStakeholderData(stakeholderData);
        setIsAuthenticated(true);
        setCurrentView(hasSubmitted ? 'results' : 'assessment');
        toast.success(`Welcome, ${stakeholder.name}!`);
      } else {
        toast.error('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrioritizations = (prioritizations: any[]) => {
    if (!stakeholderData?.stakeholder) return;
    
    // Convert prioritizations to the proper format
    const stakeholderPrioritizations: StakeholderPrioritization[] = prioritizations.map(p => ({
      topicId: p.topicId,
      businessImpact: p.businessImpact,
      sustainabilityImpact: p.sustainabilityImpact,
      comments: p.comments || '',
      dateSubmitted: new Date().toISOString()
    }));

    // Update the stakeholder data
    const stakeholders = getStoredStakeholders();
    const updatedStakeholders = stakeholders.map(s => 
      s.id === stakeholderData.stakeholder.id 
        ? { ...s, prioritizations: stakeholderPrioritizations }
        : s
    );
    
    saveStakeholders(updatedStakeholders);
    
    // Update local state to reflect the save (but not submitted yet)
    setStakeholderData({
      ...stakeholderData,
      stakeholder: { ...stakeholderData.stakeholder, prioritizations: stakeholderPrioritizations }
    });
    
    toast.success('Your prioritizations have been saved as draft!');
  };

  const handleSubmitPrioritizations = (prioritizations: any[]) => {
    if (!stakeholderData?.stakeholder) return;
    
    // Convert prioritizations to the proper format  
    const stakeholderPrioritizations: StakeholderPrioritization[] = prioritizations.map(p => ({
      topicId: p.topicId,
      businessImpact: p.businessImpact,
      sustainabilityImpact: p.sustainabilityImpact,
      comments: p.comments || '',
      dateSubmitted: new Date().toISOString()
    }));

    // Update the stakeholder data in localStorage
    const stakeholders = getStoredStakeholders();
    const updatedStakeholders = stakeholders.map(s => 
      s.id === stakeholderData.stakeholder.id 
        ? { ...s, prioritizations: stakeholderPrioritizations }
        : s
    );
    
    saveStakeholders(updatedStakeholders);
    
    // Update local state to reflect submission
    setStakeholderData({
      ...stakeholderData,
      stakeholder: { ...stakeholderData.stakeholder, prioritizations: stakeholderPrioritizations },
      hasSubmitted: true,
      canViewResults: true
    });
    
    setCurrentView('results');
    toast.success('Your prioritizations have been submitted successfully!');
  };

  // if (!isAuthenticated) {
  //   return (
  //     <UnifiedSidebarLayout>
  //       <div className="space-y-6">
  //         <div>
  //           <h1 className="text-2xl font-bold tracking-tight">Stakeholder Login</h1>
  //           <p className="text-muted-foreground">
  //             Login to participate in the materiality assessment process
  //           </p>
  //         </div>

  //         <div className="max-w-md mx-auto">
  //           <Card>
  //             <CardHeader className="text-center">
  //               <CardTitle>Stakeholder Portal Access</CardTitle>
  //               <CardDescription>
  //                 Please login with the credentials provided in your invitation email
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <form onSubmit={handleLogin} className="space-y-4">
  //                 <div className="space-y-2">
  //                   <Label htmlFor="email">Email</Label>
  //                   <Input
  //                     id="email"
  //                     type="email"
  //                     value={email}
  //                     onChange={(e) => setEmail(e.target.value)}
  //                     placeholder="Enter your email"
  //                     required
  //                   />
  //                 </div>
                  
  //                 <div className="space-y-2">
  //                   <Label htmlFor="password">Password</Label>
  //                   <Input
  //                     id="password"
  //                     type="password"
  //                     value={password}
  //                     onChange={(e) => setPassword(e.target.value)}
  //                     placeholder="Enter your password"
  //                     required
  //                   />
  //                 </div>
                  
  //                 <Button 
  //                   type="submit" 
  //                   className="w-full" 
  //                   disabled={isLoading}
  //                 >
  //                   {isLoading ? 'Logging in...' : 'Login'}
  //                 </Button>
  //               </form>
                
  //               <div className="mt-6 space-y-3">
  //                 <div className="text-center text-sm text-muted-foreground">
  //                   <p className="font-medium mb-2">Demo Accounts:</p>
  //                 </div>
  //                 <div className="space-y-2 text-xs">
  //                   <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
  //                     <span>john@company.com</span>
  //                     <Badge variant="outline" className="text-xs">Not Submitted</Badge>
  //                   </div>
  //                   <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
  //                     <span>sarah@company.com</span>
  //                     <Badge variant="secondary" className="text-xs">Submitted</Badge>
  //                   </div>
  //                   <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
  //                     <span>demo@stakeholder.com</span>
  //                     <Badge variant="outline" className="text-xs">Demo</Badge>
  //                   </div>
  //                   <p className="text-center text-muted-foreground mt-2">
  //                     Password: <code>stakeholder123</code>
  //                   </p>
  //                 </div>
  //               </div>
  //             </CardContent>
  //           </Card>
  //         </div>
  //       </div>
  //     </UnifiedSidebarLayout>
  //   );
  // }

  return (
    <UnifiedSidebarLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Materiality Assessment Portal</h1>
            <p className="text-muted-foreground">
              Welcome, {stakeholderData?.stakeholderName} | Assessment Group: {stakeholderData.groupName}
            </p>
          </div>
          <div className="flex gap-2">
            {stakeholderData?.canViewResults && (
              <>
                <Button
                  variant={currentView === 'assessment' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('assessment')}
                  disabled={stakeholderData.hasSubmitted}
                >
                  Assessment
                </Button>
                <Button
                  variant={currentView === 'results' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('results')}
                >
                  Results
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAuthenticated(false);
                setStakeholderData(null);
                toast.info('Logged out successfully');
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {currentView === 'assessment' ? (
          <StakeholderMaterialityDashboard
            stakeholderName={stakeholderData.stakeholderName}
            groupName={stakeholderData.groupName}
            topics={stakeholderData.topics}
            onSavePrioritizations={handleSavePrioritizations}
            onSubmitPrioritizations={handleSubmitPrioritizations}
            existingPrioritizations={stakeholderData.stakeholder?.prioritizations || []}
            hasSubmitted={stakeholderData.hasSubmitted}
          />
        ) : (
          <StakeholderResultsView
            stakeholderName={stakeholderData.stakeholderName}
            groupName={stakeholderData.groupName}
            topics={stakeholderData.topics}
          />
        )}
      </div>
    </UnifiedSidebarLayout>
  );
};

export default StakeholderLoginPage;
