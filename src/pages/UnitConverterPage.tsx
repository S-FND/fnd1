import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UnitConverterTool from '@/components/ghg/UnitConverterTool';

export const UnitConverterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Unit Converter</h1>
          <p className="text-muted-foreground mt-1">
            Convert between different units for accurate GHG emissions data entry
          </p>
        </div>
      </div>

      <UnitConverterTool />
    </div>
  );
};

export default UnitConverterPage;
