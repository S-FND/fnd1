
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BiodiversityImpact: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biodiversity Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          The company's operations have been assessed for their impact on local biodiversity using
          the Biodiversity Impact Assessment Protocol. Key findings include:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>No operations in or adjacent to protected areas or areas of high biodiversity value</li>
          <li>Implementation of habitat restoration projects covering 45 hectares</li>
          <li>Zero incidents of non-compliance with environmental regulations related to biodiversity</li>
        </ul>
        <p className="mt-3 font-semibold">Overall Biodiversity Impact Rating: Low Positive</p>
      </CardContent>
    </Card>
  );
};

export default BiodiversityImpact;
