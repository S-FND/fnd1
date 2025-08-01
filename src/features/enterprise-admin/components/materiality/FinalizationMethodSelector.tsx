import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck } from 'lucide-react';

interface FinalizationMethodSelectorProps {
  onSelectMethod: (method: 'internal' | 'stakeholder') => void;
}

const FinalizationMethodSelector: React.FC<FinalizationMethodSelectorProps> = ({
  onSelectMethod
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Finalization Method</CardTitle>
        <CardDescription>
          Select how you want to finalize your material topics for ESG management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Internal Finalization</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select material topics internally without detailed stakeholder engagement
                  </p>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => onSelectMethod('internal')}
                >
                  Choose Internal Method
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Stakeholder Engagement</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Engage stakeholders to prioritize topics based on their input and aggregated scoring
                  </p>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => onSelectMethod('stakeholder')}
                >
                  Choose Stakeholder Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalizationMethodSelector;