
import React from 'react';
import { Button } from "@/components/ui/button";

const ActionButtons: React.FC = () => {
  return (
    <div className="pt-6 flex justify-center md:justify-end">
      <Button variant="outline" className="mr-2">Download GHG Report</Button>
      <Button>Calculate New Period</Button>
    </div>
  );
};

export default ActionButtons;
