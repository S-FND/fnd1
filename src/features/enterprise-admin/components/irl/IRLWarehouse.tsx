
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const IRLWarehouse = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse</CardTitle>
        <CardDescription>
          Warehouse information has been moved to the Facility tab
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            The warehouse information section has been moved to the Facility tab under Advanced IRL for better organization. 
            Please navigate to the Facility tab to provide warehouse details.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default IRLWarehouse;
