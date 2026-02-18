
import React from 'react';
import { MachineDDWizard } from '../components/MachineDDWizard';
import { Bot } from 'lucide-react';

const MachineDDPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="h-7 w-7" /> Machine DD
        </h1>
        <p className="text-muted-foreground mt-1">
          Automated ESG Due Diligence — AI-powered assessment generation
        </p>
      </div>

      <MachineDDWizard />
    </div>
  );
};

export default MachineDDPage;
