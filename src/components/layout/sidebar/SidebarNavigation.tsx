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

  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const [allowedUrlsList, setAllowedUrlsList] = useState<string[]>([]);

  // ✅ NEW: Add state for sidebarHide settings
  const [sidebarHideMap, setSidebarHideMap] = useState<Record<string, boolean>>({});

  const { isVerifier, loading: verifierLoading } = useVerifierStatus();

  // ✅ NEW: Function to get sidebarHide settings from localStorage
  const getSidebarHideSettings = () => {
    try {
      const accessData = localStorage.getItem('fandoro-access');
      if (!accessData || accessData === 'undefined' || accessData === 'null') {
        return {};
      }
      const parsed = JSON.parse(accessData);
      const companyFeatures = parsed['companyFeaturePageAccess'] || [];
      const hideMap: Record<string, boolean> = {};
      companyFeatures.forEach((feature: any) => {
        hideMap[feature.feature] = feature.sidebarHide === true;
      });
      return hideMap;
    } catch (error) {
      console.error('Error getting sidebar hide settings:', error);
      return {};
    }
  };

  // ✅ NEW: Function to check if menu item should be visible
  const shouldShowMenuItem = (featureName: string): boolean => {
    return sidebarHideMap[featureName] !== true;
  };

  useEffect(() => {
    // ✅ NEW: Load sidebarHide settings
    const hideSettings = getSidebarHideSettings();
    setSidebarHideMap(hideSettings);

    logger.debug("User role in SidebarNavigation:", userRole);
    let loggedInUser = localStorage.getItem('fandoro-user');
    let loggedInUserRole = loggedInUser ? JSON.parse(loggedInUser).role : null;
    logger.debug("🔵 SidebarNavigation: Logged in user role:", loggedInUserRole);
    logger.debug("🔵 SidebarNavigation: Page access list:", pageAccessList);

    if (loggedInUserRole === 'admin') {
      logger.debug("🔵 SidebarNavigation: Admin user - filtering with sidebarHide");

      // ✅ CHANGED: Filter admin menus by sidebarHide
      const allMenus = getNavigationItems('admin');
      const filteredMenus = allMenus
        .map((menu) => {
          const shouldHideMenu = hideSettings[menu.name] === true;
          if (shouldHideMenu) {
            return null;
          }

          // SUBMENU FILTER
          let filteredSubmenu = [];
if (menu.submenu?.length > 0) {
  filteredSubmenu = menu.submenu
    .map((sub) => {
      // Skip if sidebarHide is true
      if (hideSettings[sub.name] === true) return null;

      // For items with real URLs, keep them
      if (sub.href && sub.href !== "#") {
        return sub;
      }

      // For items with href === "#", keep them only if they have visible nested submenus
      if (sub.submenu?.length > 0) {
        const visibleNested = sub.submenu.filter(
          (nested) => hideSettings[nested.name] !== true && nested.href && nested.href !== "#"
        );
        if (visibleNested.length > 0) {
          return { ...sub, submenu: visibleNested };
        }
      }
      return null;
    })
    .filter(Boolean);
}
          return {
            ...menu,
            submenu: filteredSubmenu
          };
        })
        .filter(Boolean);
      setVisibleItems(filteredMenus);
    } else {
      // Filter based on permissions
      const allowedUrls = pageAccessList
        .filter((p: PageAccessItem) => !['no_access'].includes(p.accessLevel) && p.url)
        .map((p: PageAccessItem) => p.url);
      logger.debug("🔵 SidebarNavigation: Allowed URLs from pageAccessList:", allowedUrls);
      setAllowedUrlsList(allowedUrls);

      const filtered = getNavigationItems("all-access")
        .map((menu) => {
          // ✅ CHANGED: Check sidebarHide first
          if (hideSettings[menu.name] === true) {
            logger.debug(`Excluding ${menu.name} - sidebarHide is true`);
            return null;
          }

          // Check if parent menu itself has permission
          const menuAllowed = allowedUrls.includes(menu.href);

          // Filter submenus that have permission AND not hidden by sidebarHide
          let allowedSubmenus = [];
          if (menu.submenu && menu.submenu.length > 0) {
            allowedSubmenus = menu.submenu
              .map((sub) => {
                const subAllowed =
                  sub.href === "#" || allowedUrls.includes(sub.href);
                const subNotHidden =
                  hideSettings[sub.name] !== true;
                if (!subAllowed || !subNotHidden) {
                  return null;
                }
                let filteredNestedSubmenu = [];
                if (sub.submenu?.length > 0) {
                  filteredNestedSubmenu = sub.submenu.filter((nestedSub) => {
                    const nestedAllowed = allowedUrls.includes(nestedSub.href);
                    const nestedNotHidden =
                      hideSettings[nestedSub.name] !== true;
                    return nestedAllowed && nestedNotHidden;
                  });
                }
                return {
                  ...sub,
                  submenu: filteredNestedSubmenu
                };
              })
              .filter(Boolean);
          }

          // Include menu if parent is allowed OR has allowed submenus
          if (menuAllowed || allowedSubmenus.length > 0) {
            return { ...menu, submenu: allowedSubmenus };
          }

          return null;
        })
        .filter(Boolean);

      setVisibleItems(Array.isArray(filtered) ? filtered : []);
    }
  }, [pageAccessList]);

  useEffect(() => {
    logger.debug("🔵 SidebarNavigation: Expanded menus state changed:", expandedMenus);
  }, [expandedMenus]);

  const safeVisibleItems = Array.isArray(visibleItems) ? visibleItems : [];
  
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {safeVisibleItems.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href));

            // Handle special menu items with submenus
            if (item.name === 'ESG Management') {
              // ✅ CHANGED: Filter submenu items
              const filteredSubmenu = item.submenu?.filter((sub: any) => shouldShowMenuItem(sub.name)) || [];
              return (
                <ESGManagementSubmenu
                  key={item.name}
                  submenu={filteredSubmenu}
                  isExpanded={expandedMenus.esgManagement}
                  onToggle={() => toggleMenu('esgManagement')}
                />
              );
            }
            else if (item.name === 'ESG DD') {
              // ✅ CHANGED: Filter submenu items
              const filteredSubmenu = item.submenu?.filter((sub: any) => shouldShowMenuItem(sub.name)) || [];
              return (
                <ESGDDSubmenu
                  key={item.name}
                  submenu={filteredSubmenu}
                  isExpanded={expandedMenus.esgdd}
                  onToggle={() => toggleMenu('esgdd')}
                />
              );
            }
            else if (item.name === 'Audit') {
              const filteredSubmenu =
                item.submenu?.filter((sub: any) => shouldShowMenuItem(sub.name)) || [];
              return (
                <AuditSubmenu
                  key={item.name}
                  submenu={filteredSubmenu}
                  isExpanded={expandedMenus.audit}
                  onToggle={() => toggleMenu('audit')}
                />
              );
            }
            else if (item.name === 'Reports') {
              // ✅ CHANGED: Filter submenu items
              const filteredSubmenu = item.submenu?.filter((sub: any) => shouldShowMenuItem(sub.name)) || [];
              return (
                <ReportsSubmenu
                  key={item.name}
                  submenu={filteredSubmenu}
                  isExpanded={expandedMenus.reports}
                  onToggle={() => toggleMenu('reports')}
                />
              );
            }
            else if (item.name === 'Stakeholders') {
              // ✅ CHANGED: Filter submenu items
              const filteredSubmenu = item.submenu?.filter((sub: any) => shouldShowMenuItem(sub.name)) || [];
              return (
                <StakeholdersSubmenu
                  key={item.name}
                  submenu={item.submenu || []}
                  isExpanded={expandedMenus.stakeholders}
                  onToggle={() => toggleMenu('stakeholders')}
                  role={role}
                />
              );
            }
            else if (item.name === 'SDG') {
              const filteredSubmenu =
                item.submenu?.filter((sub: any) => shouldShowMenuItem(sub.name)) || [];

              return (
                <SDGSubmenu
                  key={item.name}
                  submenu={filteredSubmenu}
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