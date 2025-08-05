import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, MapPin, Phone, Mail, User, Save } from 'lucide-react';
import { toast } from 'sonner';

const SupplierProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: user?.supplierInfo?.name || '',
    category: user?.supplierInfo?.category || '',
    contactPerson: user?.supplierInfo?.contactPerson || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: '',
    website: '',
    description: '',
    certifications: '',
    yearEstablished: '',
    employeeCount: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to the backend
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      companyName: user?.supplierInfo?.name || '',
      category: user?.supplierInfo?.category || '',
      contactPerson: user?.supplierInfo?.contactPerson || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      country: '',
      website: '',
      description: '',
      certifications: '',
      yearEstablished: '',
      employeeCount: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information and sustainability credentials
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic information about your company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              {isEditing ? (
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.companyName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Industry Category</Label>
              {isEditing ? (
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sustainable Packaging">Sustainable Packaging</SelectItem>
                    <SelectItem value="Green Technology">Green Technology</SelectItem>
                    <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                    <SelectItem value="Waste Management">Waste Management</SelectItem>
                    <SelectItem value="Organic Food">Organic Food</SelectItem>
                    <SelectItem value="Eco-friendly Materials">Eco-friendly Materials</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">{formData.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearEstablished">Year Established</Label>
              {isEditing ? (
                <Input
                  id="yearEstablished"
                  type="number"
                  value={formData.yearEstablished}
                  onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.yearEstablished || 'Not specified'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount">Number of Employees</Label>
              {isEditing ? (
                <Select value={formData.employeeCount} onValueChange={(value) => handleInputChange('employeeCount', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-1000">201-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">{formData.employeeCount || 'Not specified'}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your company's mission, services, and sustainability focus..."
                rows={4}
              />
            ) : (
              <p className="text-sm">{formData.description || 'No description provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            {isEditing ? (
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.example.com"
              />
            ) : (
              <p className="text-sm">{formData.website || 'Not provided'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Primary contact details for your company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              {isEditing ? (
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.contactPerson}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
          <CardDescription>
            Your company's physical location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            ) : (
              <p className="text-sm">{formData.address || 'Not provided'}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.city || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              {isEditing ? (
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.country || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sustainability Certifications</CardTitle>
          <CardDescription>
            List your environmental and sustainability certifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications</Label>
            {isEditing ? (
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                placeholder="List your certifications (e.g., ISO 14001, B-Corp, LEED, etc.)"
                rows={3}
              />
            ) : (
              <p className="text-sm">{formData.certifications || 'No certifications listed'}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierProfile;