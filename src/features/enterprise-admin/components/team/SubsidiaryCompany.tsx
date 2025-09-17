import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { fetchSubsidiaries, createSubsidiary, updateSubsidiary } from '../../services/teamMangment';

const SubsidiaryCompany = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subsidiaries, setSubsidiaries] = useState([]);
  // Form state
  const [formData, setFormData] = useState({
    _id: '',
    entityId: '',
    companyName: '',
    address: '',
    gstNumber: '',
    geotag: '',
    country: 'India',
    state: '',
    city: '',
    facilityType: '',
    otherFacilityType: '',
    unitId: '',
    cin: '',
    category: '',
    categoryDescription: '',
    userName: '',
    domain: '',
    designation: '',
    userEmail: ''
  });

  // Load subsidiaries on mount
  useEffect(() => {
    getSubsidiaries();
  }, []);

  const getSubsidiaries = async () => {
    setLoading(true);
    const response = await fetchSubsidiaries();
    if (response?.data) {
      setSubsidiaries(response.data);
    } else {
      toast.error("Failed to load subsidiaries");
    }
    setLoading(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle select change
  const handleSelectChange = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add new company
  const handleSaveCompany = async () => {
    if (!formData.companyName || !formData.userEmail || !formData.gstNumber || !formData.cin) {
      toast.error("Please fill in Company Name required fields.");
      return;
    }

    setLoading(true);

    const payload = {
      _id: formData._id || undefined, // only include when editing
      companyName: formData.companyName,
      address: formData.address,
      userName: formData.userName,
      domain: formData.domain,
      designation: formData.designation,
      gst: formData.gstNumber,
      cin: formData.cin,
      userEmail: formData.userEmail,
      active: true
    };

    try {
      let result, error;
      if (formData._id) {
        [result, error] = await updateSubsidiary(formData.entityId, {
          ...payload,
          _id: formData._id,
          entityId: formData.entityId,
        });
      } else {
        [result, error] = await createSubsidiary(payload);
      }
      // const [result, error] = await createSubsidiary(payload);
      if (result) {
        toast.success(formData._id ? "Subsidiary updated successfully" : "Subsidiary added successfully");
        setIsAddDialogOpen(false);
        resetForm();
        getSubsidiaries(); // Refresh list
      } else {
        toast.error(error);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      _id: '',
      entityId: '',
      companyName: '',
      address: '',
      gstNumber: '',
      geotag: '',
      country: 'India',
      state: '',
      city: '',
      facilityType: '',
      otherFacilityType: '',
      unitId: '',
      cin: '',
      category: '',
      categoryDescription: '',
      userName: '',
      domain: '',
      designation: '',
      userEmail: ''
    });
  };

  // Filter subsidiaries by search term
  const filteredCompanies = subsidiaries.filter(company => {
    const searchValue = searchTerm.toLowerCase();
    return (
      company?.companyName?.toLowerCase().includes(searchValue) ||
      company?.address?.toLowerCase().includes(searchValue)
    );
  });

  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveCompany = async (id: string,entityId: string) => {
    setRemovingId(id);
    try {
      const [result, error] = await updateSubsidiary(entityId, {
        _id: id,
        softDelete: true, // soft delete / deactivate
      });
      if (result) {
        toast.success("Subsidiary removed successfully");
        getSubsidiaries();
      } else {
        toast.error(error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRemovingId(null);
    }
  };

  const handleEditCompany = (company: any) => {
    setFormData({
      _id: company._id,
      entityId: company.entityId || "",
      companyName: company.companyName || "",
      address: company.address || "",
      gstNumber: company.gst || "",
      cin: company.cin || "",
      userName: company.userName || "",
      domain: company.domain || "",
      designation: company.designation || "",
      userEmail: company.userEmail || "",
      geotag: company.geotag || "",
      country: company.country || "India",
      state: company.state || "",
      city: company.city || "",
      facilityType: company.facilityType || "",
      otherFacilityType: company.otherFacilityType || "",
      unitId: company.unitId || "",
      category: company.category || "",
      categoryDescription: company.categoryDescription || ""
    });
    setIsAddDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Subsidiary Company Management</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subsidiary
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {formData._id ? "Edit Subsidiary Company" : "Add New Subsidiary Company"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="userName">Full Name</Label>
                      <Input
                        id="userName"
                        placeholder="Enter Full Name"
                        value={formData.userName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="userEmail">Email Address *</Label>
                      <Input
                        id="userEmail"
                        placeholder="Enter Email "
                        value={formData.userEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        placeholder="Enter Designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="Enter Company Name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <Label htmlFor="domain">Registered Domain</Label>
                      <Input
                        id="domain"
                        placeholder="Enter Registered Domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gstNumber">GST Number *</Label>
                      <Input
                        id="gstNumber"
                        placeholder="Enter GST Number"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <Label htmlFor="cin">CIN *</Label>
                      <Input
                        id="cin"
                        placeholder="Enter CIN Number"
                        value={formData.cin}
                        onChange={handleInputChange}
                      />
                    </div>
                    {/* <div>
                      <Label>Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange(value, 'category')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="product" value="Product">Product</SelectItem>
                          <SelectItem key="function" value="Function">Function</SelectItem>
                          <SelectItem key="department" value="Department">Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>

                  <div>
                    <Label htmlFor="address">Registered Office Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCompany} className="flex-1" disabled={loading}>
                      {loading ? (formData._id ? "Updating..." : "Adding...") : (formData._id ? "Update Company" : "Add Company")}
                    </Button>

                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCompanies.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">
              {searchTerm ? "No results found" : "No subsidiary companies found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredCompanies.map((company) => (
              <Card key={company._id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        📍 {company.city}
                      </div>
                    </div>
                    <Badge variant="outline">{company.unitId}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{company.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {company.employeeCount || 0} Employees
                      </span>
                      <span className="text-sm font-medium">ID: {company.unitId}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {['IT', 'HR', 'Sales'].map((dept) => (
                        <Badge key={dept} variant="secondary" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditCompany(company)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        disabled={removingId === company._id}
                        onClick={() => handleRemoveCompany(company._id,company.entityId)}
                      >
                        {removingId === company._id ? "Removing..." : "Remove"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubsidiaryCompany;