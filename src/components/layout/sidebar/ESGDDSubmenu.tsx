import React, { useDebugValue, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FileSearch, ChevronRight } from 'lucide-react';
import { SidebarMenuSubItem, SidebarMenuSubButton, SidebarMenuSub } from '@/components/ui/sidebar';
import { SidebarSubmenu } from './SidebarSubmenu';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { NavigationItem } from './navigationData';
import { logger } from '@/hooks/logger';

interface ESGDDSubmenuProps {
  submenu?: NavigationItem[];
  isExpanded: boolean;
  allowedUrls?: string[];
  onToggle: () => void;
}

export const ESGDDSubmenu: React.FC<ESGDDSubmenuProps> = ({
  submenu,
  isExpanded,
  allowedUrls = [],
  onToggle
}) => {
  console.log('submenu------->', submenu);
  const location = useLocation();
  const { user } = useAuth();
  const [isIRLExpanded, setIsIRLExpanded] = useState(
    location.pathname.startsWith('/esg-dd/irl') || location.pathname.startsWith('/esg-dd/advanced')
  );
  const isESGDDPath = location.pathname.startsWith('/esg-dd');

  // Get company funding stage from user context or default to empty
  const companyFundingStage = user?.company?.fundingStage || '';

  // Define funding stages that require Additional DD Details (using enum values)
  const advancedFundingStages = [
    'series_b',
    'series_c',
    'series_d_plus',
    'pre_ipo',
    'public_listed'
  ];

  const showAdditionalDD = advancedFundingStages.includes(companyFundingStage);

  const isIRLPath = location.pathname.startsWith('/esg-dd/irl') || location.pathname.startsWith('/esg-dd/advanced');

  useEffect(() => {
    // Expand IRL submenu if current path is under IRL
    logger.debug("🔵 ESGDDSubmenu: Checking if IRL submenu should be expanded", isIRLExpanded);
  }, []);

  return (
    <SidebarSubmenu
      name="ESG DD"
      icon={FileSearch}
      isExpanded={isExpanded}
      isActive={isESGDDPath}
      onToggle={onToggle}
    >
      {submenu?.map((item) => {
        const isActive = location.pathname === item.href;

        return (
          <div key={item.href} data-lov-id={item.id}>
            {/* 🔹 Normal item (no children) */}
            {!item.submenu?.length && (
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={isActive}>
                  <Link to={item.href}>
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )}

            {/* 🔹 Parent with children (Manual Assessment case) */}
            {item.submenu?.length > 0 && (
              <>
                <SidebarMenuSubButton
                  onClick={() => setIsIRLExpanded(!isIRLExpanded)}
                  isActive={isActive}
                  className="w-full justify-between"
                >
                  <span>{item.name}</span>
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isIRLExpanded && "rotate-90"
                    )}
                  />
                </SidebarMenuSubButton>

                {isIRLExpanded && (
                  <SidebarMenuSub className="ml-4 border-l border-sidebar-border/30">
                    {item.submenu.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === subItem.href}
                        >
                          <Link to={subItem.href}>
                            <span>{subItem.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </>
            )}
          </div>
        );
      })}
    </SidebarSubmenu>
  );
};
