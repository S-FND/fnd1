
import React, { useState } from 'react';
import { UnifiedSidebarLayout } from '@/components/layout/UnifiedSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MaterialTopic, sasbTopics, griTopics } from '../../enterprise-admin/data/frameworkTopics';
import StakeholderMaterialityDashboard from './StakeholderMaterialityDashboard';
import StakeholderResultsView from './StakeholderResultsView';

// Mock stakeholder session data
const mockStakeholderSessions = {
  'john@company.com': {
    stakeholderName: 'John Smith',
    groupName: 'Executive Assessment',
    topics: [
      ...sasbTopics.slice(0, 4),
      ...griTopics.slice(0, 3)
    ] as MaterialTopic[],
    hasSubmitted: false,
    canViewResults: true
  },
  'sarah@company.com': {
    stakeholderName: 'Sarah Johnson',
    groupName: 'Management Review',
    topics: [
      ...sasbTopics.slice(0, 3),
      ...griTopics.slice(0, 4)
    ] as MaterialTopic[],
    hasSubmitted: true,
    canViewResults: true
  },
  'demo@stakeholder.com': {
    stakeholderName: 'Demo Stakeholder',
    groupName: 'Demo Assessment',
    topics: [
      ...sasbTopics.slice(0, 5),
      ...griTopics.slice(0, 2)
    ] as MaterialTopic[],
    hasSubmitted: false,
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
      // Simulate authentication
      const sessionData = mockStakeholderSessions[email as keyof typeof mockStakeholderSessions];
      
      if (sessionData && password === 'stakeholder123') {
        setStakeholderData(sessionData);
        setIsAuthenticated(true);
        setCurrentView(sessionData.hasSubmitted ? 'results' : 'assessment');
        toast.success(`Welcome, ${sessionData.stakeholderName}!`);
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
    console.log('Saving prioritizations:', prioritizations);
    toast.success('Your prioritizations have been saved as draft!');
  };

  const handleSubmitPrioritizations = (prioritizations: any[]) => {
    console.log('Submitting prioritizations:', prioritizations);
    setStakeholderData({
      ...stakeholderData,
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
