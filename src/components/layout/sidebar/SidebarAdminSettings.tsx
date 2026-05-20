import React from 'react';
import { useLocation } from 'react-router-dom';
import { Building2, Settings } from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';

interface SidebarAdminSettingsProps {
  role: string;
}

export const SidebarAdminSettings: React.FC<SidebarAdminSettingsProps> = ({ role }) => {
  const location = useLocation();

  // Helper to check if a feature is hidden (same logic as in SidebarNavigation)
  const isFeatureHidden = (featureName: string): boolean => {
    try {
      const accessData = localStorage.getItem('fandoro-access');
      if (!accessData || accessData === 'undefined' || accessData === 'null') return false;
      const parsed = JSON.parse(accessData);
      const companyFeatures = parsed['companyFeaturePageAccess'] || [];
      const feature = companyFeatures.find((f: any) => f.feature === featureName);
      return feature?.sidebarHide === true;
    } catch {
      return false;
    }
  };

  const hideCompany = isFeatureHidden('Company Profile');
  const hideSettings = isFeatureHidden('Settings');

  if (role !== 'admin' && role !== 'manager') {
    return null;
  }

  // Hide the entire group if both items are hidden
  if (hideCompany && hideSettings) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {!hideCompany && (
            <SidebarNavItem
              icon={Building2}
              label="Company Profile"
              href="/company"
              isActive={location.pathname === '/company'}
            />
          )}
          {!hideSettings && (
            <SidebarNavItem
              icon={Settings}
              label="Settings"
              href="/settings"
              isActive={location.pathname === '/settings'}
            />
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};