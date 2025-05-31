
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X } from 'lucide-react';

const AdvancedIRLPhotos = () => {
  const [formData, setFormData] = useState({
    electricalPanelPhoto: null,
    pantryAreaPhoto: null,
    workingAreasPhotos: [],
    emergencyExitsPhotos: [],
    officeSpacePhotos: [],
    fireExtinguishersPhotos: [],
    productLabelingPhotos: [],
    productPackagingPhotos: [],
    productInfoCompliant: false,
    labelingCertification: '',
    appScreenshot: null,
    dashboardScreenshot: null
  });

  const handleFileUpload = (fieldName: string, file: File | null) => {
    setFormData({ ...formData, [fieldName]: file });
  };

  const handleMultipleFileUpload = (fieldName: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData({ ...formData, [fieldName]: fileArray });
    }
  };

  const handleSave = () => {
    console.log('Saving Advanced IRL Photos data:', formData);
  };

  const handleSubmit = () => {
    console.log('Submitting Advanced IRL Photos data:', formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced IRL - Photo Documentation</CardTitle>
        <CardDescription>
          Upload required photographs and screenshots for facility and product documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Office Infrastructure Photos */}
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Office Infrastructure Photos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="electricalPanelPhoto">1. Electrical Main Panel Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="electricalPanelPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('electricalPanelPhoto', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="electricalPanelPhoto" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload photo of electrical main panel showing surrounding area</p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pantryAreaPhoto">2. Pantry Area Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="pantryAreaPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('pantryAreaPhoto', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="pantryAreaPhoto" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload photo of pantry area</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Working Areas Photos */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workingAreasPhotos">3. Working Areas Occupied by Company</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Input
                id="workingAreasPhotos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileUpload('workingAreasPhotos', e.target.files)}
                className="hidden"
              />
              <label htmlFor="workingAreasPhotos" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload multiple photos of working areas</p>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyExitsPhotos">4. Emergency Exits, Signages, and Warning Signs</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Input
                id="emergencyExitsPhotos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileUpload('emergencyExitsPhotos', e.target.files)}
                className="hidden"
              />
              <label htmlFor="emergencyExitsPhotos" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload photos of emergency exits and safety signages</p>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="officeSpacePhotos">5. General Office Space Photos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Input
                id="officeSpacePhotos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileUpload('officeSpacePhotos', e.target.files)}
                className="hidden"
              />
              <label htmlFor="officeSpacePhotos" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload general photos of overall office space</p>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fireExtinguishersPhotos">6. Fire Extinguishers and Smoke Detectors</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Input
                id="fireExtinguishersPhotos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileUpload('fireExtinguishersPhotos', e.target.files)}
                className="hidden"
              />
              <label htmlFor="fireExtinguishersPhotos" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload photos showing locations of fire extinguishers and smoke detectors</p>
              </label>
            </div>
          </div>
        </div>

        {/* Product Documentation */}
        <div className="border-l-4 border-green-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Product Documentation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productLabelingPhotos">7. Product Labeling Photos/Details</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="productLabelingPhotos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMultipleFileUpload('productLabelingPhotos', e.target.files)}
                  className="hidden"
                />
                <label htmlFor="productLabelingPhotos" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload photos or details of product labeling</p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPackagingPhotos">8. Product Packaging Photos/Details</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="productPackagingPhotos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMultipleFileUpload('productPackagingPhotos', e.target.files)}
                  className="hidden"
                />
                <label htmlFor="productPackagingPhotos" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload photos or details of product packaging</p>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="productInfoCompliant"
                checked={formData.productInfoCompliant}
                onCheckedChange={(checked) => setFormData({ ...formData, productInfoCompliant: !!checked })}
              />
              <Label htmlFor="productInfoCompliant">9. Is product information labeled as per compliance?</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="labelingCertification">10. Labeling Practices Certification Details</Label>
              <Textarea
                id="labelingCertification"
                value={formData.labelingCertification}
                onChange={(e) => setFormData({ ...formData, labelingCertification: e.target.value })}
                placeholder="Provide details if any certification has been secured for labeling practices"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Digital Assets */}
        <div className="border-l-4 border-purple-500 pl-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">Digital Assets (If Applicable)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appScreenshot">11. App Screenshot</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="appScreenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('appScreenshot', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="appScreenshot" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload screenshot of the app (if applicable)</p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboardScreenshot">12. Dashboard Screenshot</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="dashboardScreenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('dashboardScreenshot', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="dashboardScreenshot" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload screenshot of the dashboard (if applicable)</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Upload Instructions:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ensure all photos are clear and well-lit</li>
            <li>• File formats: JPG, PNG, PDF (for documents)</li>
            <li>• Maximum file size: 5MB per file</li>
            <li>• Multiple files can be uploaded where indicated</li>
            <li>• Include wide-angle shots to show context and surroundings</li>
          </ul>
        </div>

        <div className="flex gap-4 pt-6">
          <Button onClick={handleSave} variant="outline" className="flex-1">
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedIRLPhotos;
