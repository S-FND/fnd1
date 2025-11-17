import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UnitConverterTool from './UnitConverterTool';

interface UnitConverterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFromUnit?: string;
  initialToUnit?: string;
  initialValue?: number;
}

export const UnitConverterDialog: React.FC<UnitConverterDialogProps> = ({
  open,
  onOpenChange,
  initialFromUnit,
  initialToUnit,
  initialValue,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unit Converter</DialogTitle>
          <DialogDescription>
            Convert values between different units before entering your data
          </DialogDescription>
        </DialogHeader>
        <UnitConverterTool
          initialFromUnit={initialFromUnit}
          initialToUnit={initialToUnit}
          initialValue={initialValue}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UnitConverterDialog;