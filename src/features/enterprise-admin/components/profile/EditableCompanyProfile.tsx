
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { companySchema, CompanyFormData } from './schemas/companySchema';
import { defaultCompanyData } from './data/defaultCompanyData';
import CompanyEditForm from './CompanyEditForm';
import CompanyDisplay from './CompanyDisplay';
import { AutosaveForm } from '@/components/portfolio/AutosaveForm';

const EditableCompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: defaultCompanyData,
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Mock API call - replace with actual API integration
      console.log('Updating company profile:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Company profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update company profile');
    }
  };

  const handleCancel = () => {
    form.reset(defaultCompanyData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <AutosaveForm
        entityType="company_profile"
        defaultValues={form.getValues()}
        onSubmit={onSubmit}
        debounceMs={2000}
        className="space-y-6"
      >
        {(autosaveForm) => (
          <CompanyEditForm 
            form={autosaveForm} 
            onSubmit={onSubmit} 
            onCancel={handleCancel} 
          />
        )}
      </AutosaveForm>
    );
  }

  return (
    <CompanyDisplay 
      data={form.getValues()} 
      onEdit={handleEdit} 
    />
  );
};

export default EditableCompanyProfile;
