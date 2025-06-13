
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const WorkforceDevelopment: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workforce Development</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h4 className="font-semibold">Employment Creation and Skills Development</h4>
          <Separator className="my-2" />
          <ul className="list-disc pl-6">
            <li>Created 120 new jobs in underserved communities</li>
            <li>Provided 4,500+ hours of technical and professional development training</li>
            <li>Implemented apprenticeship program benefiting 35 youth from local communities</li>
          </ul>
          <p className="mt-2 font-semibold">Impact Rating: High Positive</p>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold">Diversity and Inclusion</h4>
          <Separator className="my-2" />
          <ul className="list-disc pl-6">
            <li>48% female representation in workforce (industry average: 32%)</li>
            <li>35% underrepresented groups in management positions</li>
            <li>95% equal pay ratio between genders for comparable positions</li>
          </ul>
          <p className="mt-2 font-semibold">Impact Rating: Medium Positive</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkforceDevelopment;
