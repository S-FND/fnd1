
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { OutsourcedService } from './types';

interface OutsourcedServicesSectionProps {
  outsourcedServices: OutsourcedService[];
  setOutsourcedServices: (services: OutsourcedService[]) => void;
}

const OutsourcedServicesSection: React.FC<OutsourcedServicesSectionProps> = ({ 
  outsourcedServices, 
  setOutsourcedServices 
}) => {
  const addOutsourcedService = () => {
    setOutsourcedServices([...outsourcedServices, { agencyName: '', servicesDischarged: '', malePersons: '', femalePersons: '' }]);
  };

  const removeOutsourcedService = (index: number) => {
    setOutsourcedServices(outsourcedServices.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>16. Any outsourced services through professional services agencies?</Label>
      {outsourcedServices.map((service, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Outsourced Service {index + 1}</h4>
            {outsourcedServices.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeOutsourcedService(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Name of Agency</Label>
              <Input
                value={service.agencyName}
                onChange={(e) => {
                  const newServices = [...outsourcedServices];
                  newServices[index].agencyName = e.target.value;
                  setOutsourcedServices(newServices);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Services discharged</Label>
              <Input
                value={service.servicesDischarged}
                onChange={(e) => {
                  const newServices = [...outsourcedServices];
                  newServices[index].servicesDischarged = e.target.value;
                  setOutsourcedServices(newServices);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Male Persons</Label>
              <Input
                type="number"
                value={service.malePersons}
                onChange={(e) => {
                  const newServices = [...outsourcedServices];
                  newServices[index].malePersons = e.target.value;
                  setOutsourcedServices(newServices);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Female Persons</Label>
              <Input
                type="number"
                value={service.femalePersons}
                onChange={(e) => {
                  const newServices = [...outsourcedServices];
                  newServices[index].femalePersons = e.target.value;
                  setOutsourcedServices(newServices);
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addOutsourcedService} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Outsourced Service
      </Button>
    </div>
  );
};

export default OutsourcedServicesSection;
