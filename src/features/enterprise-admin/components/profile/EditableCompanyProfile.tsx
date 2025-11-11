import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { companySchema, CompanyFormData } from './schemas/companySchema';
import { defaultCompanyData } from './data/defaultCompanyData';
import CompanyEditForm from './CompanyEditForm';
import CompanyDisplay from './CompanyDisplay';
import { fetchProfileData, updateProfileData,updateCompanyFeatures } from '../../services/companyApi';
import { defaultPermissions } from '@/config/permissions'; // Make sure to import this
import { logger } from '@/hooks/logger';

const EditableCompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<CompanyFormData | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null); // Add user state

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: defaultCompanyData,
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("fandoro-user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      
      // Set default companyId if needed (similar to your auth provider)
      if ((user.role === 'admin') && !user.companyId) {
        user.companyId = user._id;
        localStorage.setItem("fandoro-user", JSON.stringify(user));
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data :any = await fetchProfileData();
        if (data) {
          const storedUser = JSON.parse(localStorage.getItem("fandoro-user") || "{}");
          storedUser.entityId = data.entityId;
          localStorage.setItem("fandoro-user", JSON.stringify(storedUser));
          setCurrentUser(storedUser);
          setApiData(data);
          form.reset(data);
        }
      } catch (error) {
        // toast.error('Failed to load company data');
        setApiData(defaultCompanyData);
        form.reset(defaultCompanyData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNewCompanySetup = async (entityId: string) => {
    try {
      const features = await updateCompanyFeatures(entityId, [
        { feature: "ESG DD", adminEnabled: true, url: "/esg-dd" },
      ]);

      localStorage.setItem(
        "fandoro-access",
        JSON.stringify(features || [])
      );
    } catch (err) {
      logger.error("Failed to set up company features:", err);
    }
  };
  const onSubmit = async (data: CompanyFormData) => {
    if (!currentUser) {
      toast.error('User information not available');
      return;
    }

    try {
      setIsLoading(true);
      const submissionData = {
        ...data,
        user_id: currentUser._id // Use the currentUser state
      };
      const entityId = currentUser?.entityId || null;
      const updatedData = await updateProfileData(submissionData,entityId);
      const response = await fetchProfileData();

      // Update localStorage if needed
      if (response) {
        localStorage.setItem("fandoro-user", JSON.stringify(response));
        const storedAccess = localStorage.getItem("fandoro-access");
        const isEmpty = !storedAccess || storedAccess === "null" || storedAccess === "undefined" || storedAccess === "[]" || storedAccess === "";
        if (isEmpty && response?.entityId) {
          await handleNewCompanySetup(response.entityId);
        }
      }
      
      setApiData(response);
      form.reset(response);
      toast.success('Company profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update company profile');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of your component remains the same ...
  const handleCancel = () => {
    form.reset(apiData);
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