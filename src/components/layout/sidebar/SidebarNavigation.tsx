
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { SidebarNavItem } from './SidebarNavItem';
import { ESGDDSubmenu } from './ESGDDSubmenu';
import { ESGManagementSubmenu } from './ESGManagementSubmenu';
import { ReportsSubmenu } from './ReportsSubmenu';
import { StakeholdersSubmenu } from './StakeholdersSubmenu';
import { AuditSubmenu } from './AuditSubmenu';
import { SDGSubmenu } from './SDGSubmenu';
import { getNavigationItems } from './navigationData';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PageAccessContext, PageAccessItem } from '@/context/PageAccessContext';
import { logger } from '@/hooks/logger';
import { SidebarSubmenu } from './SidebarSubmenu';
import { FileSearch } from 'lucide-react';
import { useAuthProvider } from '@/hooks/useAuthProvider';
import { log } from 'console';
import { useVerifierStatus } from '@/hooks/useVerifierStatus';

interface SidebarNavigationProps {
  role: string;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (menuKey: string) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  role,
  expandedMenus,
  toggleMenu
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const { pageAccessList, checkPageButtonAccess, setPageAccessList, userRole } = useContext(PageAccessContext);
  // const {User}=useContext(AuthProvider)
  // const visibleItems = getNavigationItems('all-access' );
  // || role

  const [visibleItems, setVisibleItems] = useState([]);
  const [allowedUrlsList, setAllowedUrlsList] = useState<string[]>([]);

  const { isVerifier, loading: verifierLoading } = useVerifierStatus();

  // Filter items based on verifier status
//  const visibleItems = getNavigationItems(role).filter(item => {
//     // Show "Approvals to be Done" for admins, managers, unit_admins, or verified verifiers
//     if (item.name === 'Approvals to be Done') {
//       // Show for admin roles always (don't wait for verifier check), or if user is specifically a verifier
//       const isAdminRole = ['admin', 'manager', 'unit_admin', 'portfolio_company_admin', 'super_admin'].includes(role);
//       return isAdminRole || isVerifier;
//     }
//     return true;
//   });


  useEffect(() => {
    logger.debug("User role in SidebarNavigation:", userRole);
    let loggedInUser = localStorage.getItem('fandoro-user');
    let loggedInUserRole = loggedInUser ? JSON.parse(loggedInUser).role : null;
    logger.debug("🔵 SidebarNavigation: Logged in user role:", loggedInUserRole);
    logger.debug("🔵 SidebarNavigation: Page access list:", pageAccessList);
    //!pageAccessList || pageAccessList.length === 0 && 
    if (loggedInUserRole === 'admin') {
      logger.debug("🔵 SidebarNavigation: No page access found.");


      // If no permissions, show all menus
      setVisibleItems(getNavigationItems(loggedInUserRole !== 'admin' ? 'all-access' : 'admin'));
    } else {
      // Filter based on permissions
      const allowedUrls = pageAccessList
        .filter((p: PageAccessItem) => !['no_access'].includes(p.accessLevel) && p.url)
        .map((p: PageAccessItem) => p.url); logger.debug("🔵 SidebarNavigation: Allowed URLs from pageAccessList:", allowedUrls);
      setAllowedUrlsList(allowedUrls);
      const filtered = getNavigationItems("all-access")
        .map((menu) => {
          // Check if parent menu itself has permission
          const menuAllowed = allowedUrls.includes(menu.href);

          // Filter submenus that have permission
          let allowedSubmenus = [];
          if (menu.submenu && menu.submenu.length > 0) {
            allowedSubmenus = menu.submenu.filter((sub) => allowedUrls.includes(sub.href));
          }

          // Include menu if:
          // 1️⃣ Parent menu is allowed OR
          // 2️⃣ Any submenu is allowed
          if (menuAllowed || allowedSubmenus.length > 0) {
            return { ...menu, submenu: allowedSubmenus };
          }

          return null; // exclude menu
        })
        .filter(Boolean);

      setVisibleItems(filtered);
    }
  }, [pageAccessList]);

  // useEffect(() => {
  //   logger.debug("🔵 SidebarNavigation: Updated visibleItems:", visibleItems);
  // }, [visibleItems]);

  // useEffect(() => {
  //   let userData = user;
  //   logger.log('🔵 SidebarNavigation: User data:', userData);
  //   let localStorageData = JSON.parse(localStorage.getItem('fandoro-user'));
  //   logger.log('🔵 SidebarNavigation: LocalStorage user data:', localStorageData);

  //   logger.debug("🔵 SidebarNavigation: Checking page access for role:", pageAccessList);
  //   console.log("🔵 SidebarNavigation: Checking page access for visibleItems:", visibleItems);
  //   logger.debug("🔵 SidebarNavigation: Current user checkPageAccess:", checkPageAccess('/admin'));
  // }, []);

  useEffect(() => {
    logger.debug("🔵 SidebarNavigation: Expanded menus state changed:", expandedMenus);
  }, [expandedMenus]);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href));
            // Handle special menu items with submenus
            if (item.name === 'ESG Management') {
              return (
                <ESGManagementSubmenu
                  key={item.name}
                  submenu={item.submenu}
                  isExpanded={expandedMenus.esgManagement}
                  // allowedUrls={allowedUrlsList}
                  onToggle={() => toggleMenu('esgManagement')}
                />
              );
            }

            else if (item.name === 'ESG DD') {
              return (
                <ESGDDSubmenu
                  key={item.name}
                  submenu={item.submenu}
                  isExpanded={expandedMenus.esgdd}
                  // allowedUrls={allowedUrlsList}
                  onToggle={() => toggleMenu('esgdd')}
                />

              );
            }

            else if (item.name === 'Audit') {
              return (
                <AuditSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.audit}
                  onToggle={() => toggleMenu('audit')}
                />
              );
            }

            else if (item.name === 'Reports') {
              return (
                <ReportsSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.reports}
                  onToggle={() => toggleMenu('reports')}
                />
              );
            }

            else if (item.name === 'Stakeholders') {
              return (
                <StakeholdersSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.stakeholders}
                  onToggle={() => toggleMenu('stakeholders')}
                  role={role}
                />
              );
            }

            if (item.name === 'SDG') {
              return (
                <SDGSubmenu
                  key={item.name}
                  isExpanded={expandedMenus.sdg}
                  onToggle={() => toggleMenu('sdg')}
                />
              );
            }

            // Regular menu items
            else {
              return (
                <SidebarNavItem
                  key={item.name}
                  icon={item.icon}
                  label={item.name}
                  href={item.href}
                  isActive={isActive}
                />
              );
            }
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
