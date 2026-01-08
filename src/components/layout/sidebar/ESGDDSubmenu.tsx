
// import React, { useState } from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import { BarChart3, FileSearch, FileText, LineChart } from 'lucide-react';
// import { SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
// import { SidebarSubmenu } from './SidebarSubmenu';
// import { useAuth } from '@/context/AuthContext';
// import { NavigationItem } from './navigationData';

// interface ESGDDSubmenuProps {
//   submenu?: NavigationItem[];
//   isExpanded: boolean;
//   allowedUrls?: string[];
//   onToggle: () => void;
// }

// export const ESGDDSubmenu: React.FC<ESGDDSubmenuProps> = ({
//   submenu,
//   isExpanded,
//   allowedUrls = [],
//   onToggle
// }) => {
//   const location = useLocation();
//   const { user } = useAuth();

//   const [isIRLExpanded, setIsIRLExpanded] = useState(
//     location.pathname.startsWith('/esg-dd/irl') || location.pathname.startsWith('/esg-dd/advanced')
//   );

//   const isESGDDPath = location.pathname.startsWith('/esg-dd');

//   // Get company funding stage from user context or default to empty
//   const companyFundingStage = user?.company?.fundingStage || '';

//   // Define funding stages that require Additional DD Details (using enum values)
//   const advancedFundingStages = [
//     'series_b',
//     'series_c',
//     'series_d_plus',
//     'pre_ipo',
//     'public_listed'
//   ];

//   const showAdditionalDD = advancedFundingStages.includes(companyFundingStage);

//   const submenuItems = [
//     { name: "Overview", href: '/esg-dd', icon: BarChart3 },
//     { name: "IRL", href: "/esg-dd/irl", icon: FileText },
//     { name: "Advanced IRL", href: "/esg-dd/advanced", icon: LineChart },
//     { name: "ESG DD Reports", href: '/esg-dd/reports', icon: BarChart3 },
//     { name: "ESG CAP", href: "/esg-dd/cap", icon: FileText },
//     { name: "Additional DD Details", href: "/esg-dd/additional", icon: LineChart }
//   ];

//   const isIRLPath = location.pathname.startsWith('/esg-dd/irl') || location.pathname.startsWith('/esg-dd/advanced');

//   return (
//     <SidebarSubmenu
//       name="ESG DD"
//       icon={FileSearch}
//       isExpanded={isExpanded}
//       isActive={isESGDDPath}
//       onToggle={onToggle}
//     >

// {submenu.map((item) => {
//   const isActive = location.pathname === item.href;
//   return (
//     //Show additional DD Details only for advanced funding stages if applicable
//     <SidebarMenuSubItem key={item.href}>
//       <SidebarMenuSubButton asChild isActive={location.pathname === item.href}>
//         <Link to={item.href}>
//           <span>{item.name}</span>
//         </Link>
//       </SidebarMenuSubButton>
//     </SidebarMenuSubItem>
//   );
// })}




//       {/* <SidebarMenuSubItem>
//         <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd'}>
//           <Link to="/esg-dd">
//             <span>Overview</span>
//           </Link>
//         </SidebarMenuSubButton>
//       </SidebarMenuSubItem>
//       <SidebarMenuSubItem>
//         <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/irl'}>
//           <Link to="/esg-dd/irl">
//             <span>IRL</span>
//           </Link>
//         </SidebarMenuSubButton>
//       </SidebarMenuSubItem>
//       <SidebarMenuSubItem>
//         <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/advanced'}>
//           <Link to="/esg-dd/advanced">
//             <span>Advanced IRL</span>
//           </Link>
//         </SidebarMenuSubButton>
//       </SidebarMenuSubItem>
//       <SidebarMenuSubItem>
//         <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/reports'}>
//           <Link to="/esg-dd/reports">
//             <span>ESG DD Reports</span>
//           </Link>
//         </SidebarMenuSubButton>
//       </SidebarMenuSubItem>
//       <SidebarMenuSubItem>
//         <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/cap'}>
//           <Link to="/esg-dd/cap">
//             <span>ESG CAP</span>
//           </Link>
//         </SidebarMenuSubButton>
//       </SidebarMenuSubItem>
//       {showAdditionalDD && (
//         <SidebarMenuSubItem>
//           <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/additional'}>
//             <Link to="/esg-dd/additional">
//               <span>Additional DD Details</span>
//             </Link>
//           </SidebarMenuSubButton>
//         </SidebarMenuSubItem>
//       )} */}
//     </SidebarSubmenu>
//   );
// };

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
      {submenu.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          //Show additional DD Details only for advanced funding stages if applicable
          <div key={item.href}>
            {item.href !== '/esg-dd/manual' && item.href !== '/esg-dd/automated' && <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild isActive={isActive}>
                <Link to={item.href}>
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>}
            {item.href === '/esg-dd/manual' && (
              <SidebarMenuSubButton
                onClick={() => setIsIRLExpanded(!isIRLExpanded)}
                isActive={isIRLPath}
                className="w-full justify-between"
              >
                <span>Manual Assessment</span>
                <ChevronRight
                  className={cn(
                    "h-3 w-3 shrink-0 transition-transform duration-200",
                    isIRLExpanded && "rotate-90"
                  )}
                />
              </SidebarMenuSubButton>)
            }

            {item.href === '/esg-dd/manual' && isIRLExpanded && (
              <SidebarMenuSub className="ml-4 border-l border-sidebar-border/30">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location.pathname === '/esg-dd/irl'}
                  >
                    <Link to="/esg-dd/irl">
                      <span>IRL Assessment</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location.pathname === '/esg-dd/advanced'}
                  >
                    <Link to="/esg-dd/advanced">
                      <span>Advanced IRL</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
            {item.href === '/esg-dd/automated' && (
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild >
                  <a href="https://startups.fandoro.ai/" target="_blank" rel="noopener noreferrer" className="w-full">
                    <span>Automated Assessment</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )}
          </div>
        );
      })}

      {/* <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd'}>
          <Link to="/esg-dd">
            <span>Overview</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem> */}

      {/* IRL with nested submenu */}
      {/* <SidebarMenuSubItem>
        <SidebarMenuSubButton 
          onClick={() => setIsIRLExpanded(!isIRLExpanded)}
          isActive={isIRLPath}
          className="w-full justify-between"
        >
          <span>Manual Assessment</span>
          <ChevronRight 
            className={cn(
              "h-3 w-3 shrink-0 transition-transform duration-200",
              isIRLExpanded && "rotate-90"
            )} 
          />
        </SidebarMenuSubButton>
      </SidebarMenuSubItem> */}

      {/* {isIRLExpanded && (
        <SidebarMenuSub className="ml-4 border-l border-sidebar-border/30">
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/irl'}>
              <Link to="/esg-dd/irl">
                <span>IRL Assessment</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/advanced'}>
              <Link to="/esg-dd/advanced">
                <span>Advanced IRL</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      )} */}

      {/* <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild >
          <a href="https://startups.fandoro.ai/" target="_blank" rel="noopener noreferrer" className="w-full">
            <span>Automated Assessment</span>
          </a>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/reports'}>
          <Link to="/esg-dd/reports">
            <span>ESG DD Reports</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/cap'}>
          <Link to="/esg-dd/cap">
            <span>ESG CAP</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
      {showAdditionalDD && (
        <SidebarMenuSubItem>
          <SidebarMenuSubButton asChild isActive={location.pathname === '/esg-dd/additional'}>
            <Link to="/esg-dd/additional">
              <span>Additional DD Details</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      )} */}
    </SidebarSubmenu>
  );
};
