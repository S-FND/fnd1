
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiGet, useApiPost } from '@/hooks/useApi';
import { companyService, authService } from '@/services/apiService';
import { toast } from 'sonner';
import { logger } from '@/hooks/logger';

// Example component showing how to use the HTTP interceptor system
const ApiUsageExample: React.FC = () => {
  const { data, loading, error, get } = useApiGet();
  const { data: postData, loading: postLoading, post } = useApiPost();

  // Example: Fetch data on component mount
  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      await get('/company/profile', {
        onSuccess: (data) => {
          logger.log('Company profile loaded:', data);
          toast.success('Company profile loaded successfully');
        },
        onError: (error) => {
          logger.error('Failed to load company profile:', error);
        }
      });
    } catch (error) {
      // Error is already handled by interceptors
      logger.error('Error caught in component:', error);
    }
  };

  const updateCompanyProfile = async () => {
    try {
      await post('/company/update', 
        { name: 'Updated Company Name', industry: 'Technology' },
        {
          onSuccess: (data) => {
            toast.success('Company profile updated successfully');
            fetchCompanyProfile(); // Refresh data
          }
        }
      );
    } catch (error) {
      // Error is already handled by interceptors
    }
  };

  // Example using service functions
  const loginExample = async () => {
    try {
      const response = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      toast.success('Login successful');
    } catch (error) {
      // Error handled by interceptors
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>API Usage Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Company Profile Data:</h3>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {data && (
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>

        <div className="space-x-2">
          <Button onClick={fetchCompanyProfile} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Company Profile'}
          </Button>
          
          <Button onClick={updateCompanyProfile} disabled={postLoading}>
            {postLoading ? 'Updating...' : 'Update Profile'}
          </Button>
          
          <Button onClick={loginExample} variant="outline">
            Test Login
          </Button>
        </div>

        {postData && (
          <div>
            <h3 className="font-semibold mb-2">Post Response:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(postData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiUsageExample;
