
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { OfficeSpace } from './types';

interface OfficeSpaceSectionProps {
  officeSpaces: OfficeSpace[];
  setOfficeSpaces: (spaces: OfficeSpace[]) => void;
}

const OfficeSpaceSection: React.FC<OfficeSpaceSectionProps> = ({ officeSpaces, setOfficeSpaces }) => {
  const addOfficeSpace = () => {
    setOfficeSpaces([...officeSpaces, { location: '', type: '', address: '', geotagLocation: '', numberOfSeats: '' }]);
  };

  const removeOfficeSpace = (index: number) => {
    setOfficeSpaces(officeSpaces.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>11. Type of office space & no. of seats</Label>
      {officeSpaces.map((space, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Office Space {index + 1}</h4>
            {officeSpaces.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeOfficeSpace(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={space.location}
                onChange={(e) => {
                  const newSpaces = [...officeSpaces];
                  newSpaces[index].location = e.target.value;
                  setOfficeSpaces(newSpaces);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={space.type}
                onValueChange={(value) => {
                  const newSpaces = [...officeSpaces];
                  newSpaces[index].type = value;
                  setOfficeSpaces(newSpaces);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coworking">Coworking</SelectItem>
                  <SelectItem value="leased">Leased</SelectItem>
                  <SelectItem value="wfh">Work From Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={space.address}
                onChange={(e) => {
                  const newSpaces = [...officeSpaces];
                  newSpaces[index].address = e.target.value;
                  setOfficeSpaces(newSpaces);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Geotag Location</Label>
              <Input
                value={space.geotagLocation}
                onChange={(e) => {
                  const newSpaces = [...officeSpaces];
                  newSpaces[index].geotagLocation = e.target.value;
                  setOfficeSpaces(newSpaces);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>No. of seats (NA if WFH)</Label>
              <Input
                value={space.numberOfSeats}
                onChange={(e) => {
                  const newSpaces = [...officeSpaces];
                  newSpaces[index].numberOfSeats = e.target.value;
                  setOfficeSpaces(newSpaces);
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addOfficeSpace} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Office Space
      </Button>
    </div>
  );
};

export default OfficeSpaceSection;
