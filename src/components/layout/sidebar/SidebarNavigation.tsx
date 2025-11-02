
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { SidebarNavItem } from './SidebarNavItem';
import { ESGDDSubmenu } from './ESGDDSubmenu';
import { ESGManagementSubmenu } from './ESGManagementSubmenu';
import { ReportsSubmenu } from './ReportsSubmenu';
import { StakeholdersSubmenu } from './StakeholdersSubmenu';
import { AuditSubmenu } from './AuditSubmenu';
// import { SDGSubmenu } from './SDGSubmenu';
import { getNavigationItems } from './navigationData';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PageAccessContext, PageAccessItem } from '@/context/PageAccessContext';
import { logger } from '@/hooks/logger';
import { SidebarSubmenu } from './SidebarSubmenu';
import { FileSearch } from 'lucide-react';
import { useAuthProvider } from '@/hooks/useAuthProvider';
import { log } from 'console';

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


  useEffect(() => {
    const loggedInUser = localStorage.getItem("fandoro-user");
    const loggedInUserRole = loggedInUser ? JSON.parse(loggedInUser).role : null;

    if (!pageAccessList || pageAccessList.length === 0) {
      setVisibleItems([]); // explicitly clear while loading
      return;
    }

    if (loggedInUserRole === "admin") {
      setVisibleItems(getNavigationItems("admin"));
      return;
    }

    // 🔁 Inherit access from parent to children
    const inheritedList = pageAccessList.map(child => {
      if (child.accessLevel === "no_access" && child.url) {
        const parent = pageAccessList.find(p =>
          p.url &&
          p.accessLevel !== "no_access" &&
          child.url.startsWith(p.url + "/")
        );
        if (parent) return { ...child, accessLevel: parent.accessLevel };
      }
      return child;
    });

    const allowedUrls = new Set(
      inheritedList
        .filter(p => p.url && p.accessLevel !== "no_access")
        .map(p => p.url)
    );

    // 🔍 Simple, flat filtering (no recursion needed for 1-level submenus)
    const filtered = getNavigationItems("all-access")
      .map(menu => {
        if (!menu.href) return null;

        const menuAllowed = allowedUrls.has(menu.href);
        const allowedSubmenus = menu.submenu?.filter(sub =>
          sub.href && allowedUrls.has(sub.href)
        ) || [];

        if (menuAllowed || allowedSubmenus.length > 0) {
          return { ...menu, submenu: allowedSubmenus };
        }
        return null;
      })
      .filter(Boolean);

    setVisibleItems(filtered);
  }, [pageAccessList, userRole]);

  useEffect(() => {
    logger.debug("🔵 SidebarNavigation: Updated visibleItems:", visibleItems);
  }, [visibleItems]);

  // useEffect(() => {
  //   let userData = user;
  //   logger.log('🔵 SidebarNavigation: User data:', userData);
  //   let localStorageData = JSON.parse(localStorage.getItem('fandoro-user'));
  //   logger.log('🔵 SidebarNavigation: LocalStorage user data:', localStorageData);

  //   logger.debug("🔵 SidebarNavigation: Checking page access for role:", pageAccessList);
  //   console.log("🔵 SidebarNavigation: Checking page access for visibleItems:", visibleItems);
  //   logger.debug("🔵 SidebarNavigation: Current user checkPageAccess:", checkPageAccess('/admin'));
  // }, []);

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

            // if (item.name === 'SDG') {
            //   return (
            //     <SDGSubmenu
            //       key={item.name}
            //       isExpanded={expandedMenus.sdg}
            //       onToggle={() => toggleMenu('sdg')}
            //     />
            //   );
            // }

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
