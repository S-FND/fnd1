import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { companySchema, CompanyFormData } from './schemas/companySchema';
import { defaultCompanyData } from './data/defaultCompanyData';
import CompanyEditForm from './CompanyEditForm';
import CompanyDisplay from './CompanyDisplay';
import { fetchProfileData, updateCompanyData } from '../../services/companyApi';

const EditableCompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<CompanyFormData | null>(null);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: defaultCompanyData,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProfileData();
        setApiData(data);
        form.reset(data); // Populate form with fetched data
      } catch (error) {
        toast.error('Failed to load company data');
        // Fallback to default data
        setApiData(defaultCompanyData);
        form.reset(defaultCompanyData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const onSubmit = async (data: CompanyFormData) => {
    console.log('Submitting Form Data:', data); // Debugging log
    try {
      setIsLoading(true);
      const updatedData = await updateCompanyData(data);
      const response = await fetchProfileData();
      setApiData(response);
      form.reset(response); // Reset form with updated data
      toast.success('user_id' in data ? 'Company profile updated successfully' : 'Company profile created successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update/create company profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset(apiData); // Reset form to last known state
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {isEditing ? (
        <CompanyEditForm
          form={form}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      ) : (
        <CompanyDisplay
          data={apiData}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default EditableCompanyProfile;