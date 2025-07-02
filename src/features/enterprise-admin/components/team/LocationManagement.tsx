import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus } from 'lucide-react';
import { fetchLocationData, createLocation } from "../../services/teamMangment";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


const LocationManagement = ({ locations, refreshData }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const facilityTypeOptions = [
    'Plant',
    'Warehouse',
    'DC',
    'Office-HQ',
    'Office-Sales',
    'Office-Regional/Zonal',
    'Others',
    'Parent'
  ];
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    gstNumber: '',
    geotag: '',
    country: '',
    state: '',
    city: '',
    facilityType: '',
    facilityId: '',
    otherFacilityType: '',
    unitId: '',
    category: '',
    categoryDescription: ''
  });

  // const locationTypes = ['Office', 'Warehouse', 'Manufacturing Unit'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];

  // Fetch locations
  // const getLocations = async () => {
  //   setLoading(true);
  //   const response = await fetchLocationData();
  //   if (response) {

  //     setLocations(response.data.filter(location => location.active !== false));
  //   } else {
  //     toast.error("error");
  //   }
  //   setLoading(false);
  // };

  // Add new location
  const handleAddLocation = async () => {
    setLoading(true);
    const [result, error] = await createLocation({
      ...formData,
      active: true
    });
    if (result) {
      toast.success("Location successfully added");
      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        address: '',
        gstNumber: '',
        geotag: '',
        country: '',
        state: '',
        city: '',
        facilityType: '',
        facilityId: '',
        otherFacilityType: '',
        unitId: '',
        category: '',
        categoryDescription: ''
      });
      refreshData();
    } else {
      toast.error("Error adding location");
    }
    setLoading(false);
  };

  // Remove location
  // const handleRemoveLocation = async (locationId) => {
  //   setLoading(true);
  //   const locationToRemove = locations.find(loc => loc._id === locationId);

  //   if (locationToRemove) {
  //     const [result, error] = await createLocation({
  //       ...locationToRemove,
  //       active: false
  //     });

  //     if (result) {
  //       toast.success("Location successfully removed");
  //       getLocations();
  //     } else {
  //       toast.error("error");
  //     }
  //   }
  //   setLoading(false);
  // };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handle select changes
  const handleSelectChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Filter locations based on search term
  const filteredLocations = locations.filter(location => {
    const searchValue = searchTerm.toLowerCase();
    return (
      location?.name?.toLowerCase().includes(searchValue) ||
      location?.city?.toLowerCase().includes(searchValue) ||
      location?.type?.toLowerCase().includes(searchValue)
    );
  });

  // useEffect(() => {
  //   getLocations();
  // }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Location Management</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Location Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter location name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitId">Unit ID</Label>
                    <Input
                      id="unitId"
                      placeholder="Enter unit ID"
                      value={formData.unitId}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="type">Location Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange(value, 'type')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationTypes.map(type => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div> */}
                  {/* <div>
                    <Label htmlFor="facilityType">Facility Type</Label>
                    <Input 
                      id="facilityType" 
                      placeholder="Enter facility type" 
                      value={formData.facilityType}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  {/* Facility Type Dropdown */}
                  <div>
                    <Label htmlFor="facilityType">Facility Type</Label>
                    <Select
                      value={formData.facilityType}
                      onValueChange={(value) => handleSelectChange(value, 'facilityType')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilityTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="Enter category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  {/* <div>
                    <Label htmlFor="city">City</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleSelectChange(value, 'city')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div> */}
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsAddDialogOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddLocation}
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Location"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !locations.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredLocations.map((location) => (
              <Card key={location._id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {location.city}
                      </div>
                    </div>
                    <Badge variant="outline">{location.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{location.employeeCount || 0} Employees</span>
                      <span className="text-sm font-medium">Unit ID: {location.unitId}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {location.departments?.map((dept) => (
                        <Badge key={dept} variant="secondary" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        // onClick={() => handleRemoveLocation(location._id)}
                        disabled={loading}
                      >
                        {loading ? "Removing..." : "Remove"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredLocations.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">
              {searchTerm ? "No locations match your search" : "No locations found"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationManagement;