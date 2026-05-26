// import React from 'react';
// import { useLocation, Link } from 'react-router-dom';
// import { ChevronDown, ChevronRight, Target, FileText, FileSearch } from 'lucide-react';
// import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// interface MISSubmenuProps {
//     isExpanded: boolean;
//     onToggle: () => void;
// }

// export const MISSubmenu: React.FC<MISSubmenuProps> = ({
//     isExpanded,
//     onToggle
// }) => {
//     const location = useLocation();

//     const submenuItems = [
//         { name: "Dashboard", href: "/mis/dashboard", icon: FileSearch },
//         { name: "KPI Entry", href: "/mis/data-entry", icon: FileText },
//         { name: "Preview & Submit", href: "/mis/preview-submit", icon: FileText },

//     ];

//     return (
//         <SidebarMenuItem>
//             <Collapsible open={isExpanded} onOpenChange={onToggle}>
//                 <CollapsibleTrigger asChild>
//                     <SidebarMenuButton className="w-full justify-between">
//                         <div className="flex items-center gap-2">
//                             <Target className="h-4 w-4" />
//                             <span>MIS</span>
//                         </div>
//                         {isExpanded ? (
//                             <ChevronDown className="h-4 w-4" />
//                         ) : (
//                             <ChevronRight className="h-4 w-4" />
//                         )}
//                     </SidebarMenuButton>
//                 </CollapsibleTrigger>
//                 <CollapsibleContent>
//                     <SidebarMenuSub>
//                         {submenuItems.map((item) => {
//                             const isActive = location.pathname === item.href;
//                             return (
//                                 <SidebarMenuSubItem key={item.name}>
//                                     <SidebarMenuSubButton asChild isActive={isActive}>
//                                         <Link to={item.href}>
//                                             <item.icon className="h-4 w-4" />
//                                             <span>{item.name}</span>
//                                         </Link>
//                                     </SidebarMenuSubButton>
//                                 </SidebarMenuSubItem>
//                             );
//                         })}
//                     </SidebarMenuSub>
//                 </CollapsibleContent>
//             </Collapsible>
//         </SidebarMenuItem>
//     );
// };

import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import {
    ChevronDown, ChevronRight, Target, FileText, FileSearch,
    Calendar, CalendarDays, ClipboardList, Briefcase, Truck,
    Users, Package, AlertCircle, Award, HelpCircle, Building2,
    Droplets, Zap, Recycle, Lock,
    MessageSquare,
    Eye,
    LayoutDashboard
} from 'lucide-react';
import {
    SidebarMenuItem, SidebarMenuButton, SidebarMenuSub,
    SidebarMenuSubItem, SidebarMenuSubButton
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCompanyFeatures, QUARTERLY_FEATURES, ANNUAL_FEATURES } from '@/hooks/useCompanyFeatures';
// import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const FEATURE_ICONS: Record<string, React.ElementType> = {
    businessInformation: Briefcase,
    sourcingFulfillment: Truck,
    social: Users,
    primarySecondaryPackaging: Package,
    fashionMaterials: Package,
    incidentLog: AlertCircle,
    productServiceCertifications: Award,
    healthCare: HelpCircle,
    operations: Building2,
    certifications: Award,
    governancePolicies: FileText,
    waterManagement: Droplets,
    energyManagement: Zap,
    wasteManagement: Recycle,
    csr: Users,
    externalReporting: FileText,
};

interface MISSubmenuProps {
    isExpanded: boolean;
    onToggle: () => void;
}

export const MISSubmenu: React.FC<MISSubmenuProps> = ({ isExpanded, onToggle }) => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { user, effectiveCompanyId } = useAuth();

    const [kpiExpanded, setKpiExpanded] = useState(false);
    const [quarterlyOpen, setQuarterlyOpen] = useState(true);
    const [annualOpen, setAnnualOpen] = useState(true);

    const companyId = effectiveCompanyId || user?.companyId || 'company-1';
    const { isFeatureEnabled, loading } = useCompanyFeatures(companyId);

    // Persist & sync quarter/year from URL
    const [lastQuarter, setLastQuarter] = useState(() =>
        sessionStorage.getItem('fireside_selected_quarter') || 'Q1'
    );
    const [lastYear, setLastYear] = useState(() =>
        sessionStorage.getItem('fireside_selected_year') || '2025'
    );

    const urlQuarter = searchParams.get('quarter');
    const urlYear = searchParams.get('year');

    useEffect(() => {
        if (urlQuarter) {
            setLastQuarter(urlQuarter);
            sessionStorage.setItem('fireside_selected_quarter', urlQuarter);
        }
        if (urlYear) {
            setLastYear(urlYear);
            sessionStorage.setItem('fireside_selected_year', urlYear);
        }
    }, [urlQuarter, urlYear]);

    const selectedQuarter = urlQuarter || lastQuarter;
    const selectedYear = urlYear || lastYear;
    const isQ4Selected = selectedQuarter === 'Q4';

    const enabledQuarterlyFeatures = QUARTERLY_FEATURES.filter(f => isFeatureEnabled(f.key));
    const enabledAnnualFeatures = ANNUAL_FEATURES.filter(f => isFeatureEnabled(f.key));

    const isMISRoute = location.pathname.startsWith('/mis/');

    // Auto-expand MIS top-level when on any MIS page
    useEffect(() => {
        if (isMISRoute && !isExpanded) {
            onToggle();
        }
    }, [isMISRoute]);

    // Auto-expand KPI Entry submenu when on a kpi-entry route
    const isOnKpiRoute =
        location.pathname === '/mis/data-entry' ||
        location.pathname === '/mis/kpi-entry';

    useEffect(() => {
        if (isOnKpiRoute) setKpiExpanded(true);
    }, [isOnKpiRoute]);

    return (
        <SidebarMenuItem>
            <Collapsible open={isExpanded} onOpenChange={onToggle}>
                {/* ── MIS top-level trigger ── */}
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span>MIS</span>
                        </div>
                        {isExpanded
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />
                        }
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>

                        {/* Dashboard */}
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={location.pathname === '/mis/dashboard'}>
                                <Link to="/mis/dashboard">
                                    <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* ── KPI Entry — nested collapsible ── */}
                        <SidebarMenuSubItem>
                            <Collapsible open={kpiExpanded} onOpenChange={setKpiExpanded}>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton
                                        isActive={isOnKpiRoute}
                                        className="w-full justify-between cursor-pointer"
                                    >
                                        <Link to="/mis/data-entry" className="flex items-center gap-2">
                                            <ClipboardList className="h-4 w-4" />
                                            <span>KPI Entry</span>
                                        </Link>
                                        {kpiExpanded
                                            ? <ChevronDown className="h-3 w-3 ml-auto" />
                                            : <ChevronRight className="h-3 w-3 ml-auto" />
                                        }
                                    </SidebarMenuSubButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    {/* ── Quarterly KPIs ── */}
                                    <Collapsible open={quarterlyOpen} onOpenChange={setQuarterlyOpen}>
                                        <CollapsibleTrigger className={cn(
                                            'flex items-center gap-2 w-full px-2 py-1.5 pl-6 text-xs',
                                            'font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground',
                                            'transition-colors rounded-md hover:bg-sidebar-accent/50'
                                        )}>
                                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>Quarterly KPIs</span>
                                            <ChevronDown className={cn(
                                                'h-3 w-3 ml-auto transition-transform duration-200',
                                                quarterlyOpen && 'rotate-180'
                                            )} />
                                        </CollapsibleTrigger>

                                        <CollapsibleContent className="space-y-0.5 mt-0.5">
                                            {!loading && enabledQuarterlyFeatures.map((feature) => {
                                                const Icon = FEATURE_ICONS[feature.key] || ClipboardList;
                                                const isActive =
                                                    location.pathname === '/mis/kpi-entry' &&
                                                    location.search.includes(`feature=${feature.key}`);
                                                return (
                                                    <Link
                                                        key={feature.key}
                                                        to={`/mis/kpi-entry?tab=quarterly&feature=${feature.key}&quarter=${selectedQuarter}&year=${selectedYear}`}
                                                        className={cn(
                                                            'flex items-center gap-2 pl-10 pr-3 py-1 rounded text-xs transition-colors',
                                                            isActive
                                                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                                                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                                        )}
                                                    >
                                                        <Icon className="h-3 w-3 flex-shrink-0" />
                                                        <span className="truncate">{feature.label}</span>
                                                    </Link>
                                                );
                                            })}
                                        </CollapsibleContent>
                                    </Collapsible>

                                    {/* ── Annual KPIs ── */}
                                    <Collapsible open={annualOpen} onOpenChange={setAnnualOpen}>
                                        <CollapsibleTrigger className={cn(
                                            'flex items-center gap-2 w-full px-2 py-1.5 pl-6 text-xs',
                                            'font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground',
                                            'transition-colors rounded-md hover:bg-sidebar-accent/50'
                                        )}>
                                            <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>Annual KPIs</span>
                                            {!isQ4Selected && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Lock className="h-3 w-3 ml-1 text-sidebar-foreground/30" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        <p className="text-xs">Annual KPIs are only available in Q4</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            <ChevronDown className={cn(
                                                'h-3 w-3 ml-auto transition-transform duration-200',
                                                annualOpen && 'rotate-180'
                                            )} />
                                        </CollapsibleTrigger>

                                        <CollapsibleContent className="space-y-0.5 mt-0.5">
                                            {!isQ4Selected ? (
                                                <p className="pl-10 pr-3 py-1.5 text-[10px] text-sidebar-foreground/50 italic leading-relaxed">
                                                    Annual KPIs only available in Q4.
                                                </p>
                                            ) : (
                                                !loading && enabledAnnualFeatures.map((feature) => {
                                                    const Icon = FEATURE_ICONS[feature.key] || ClipboardList;
                                                    const isActive =
                                                        location.pathname === '/mis/kpi-entry' &&
                                                        location.search.includes(`feature=${feature.key}`);
                                                    return (
                                                        <Link
                                                            key={feature.key}
                                                            to={`/mis/kpi-entry?tab=annual&feature=${feature.key}&quarter=Q4&year=${selectedYear}`}
                                                            className={cn(
                                                                'flex items-center gap-2 pl-10 pr-3 py-1 rounded text-xs transition-colors',
                                                                isActive
                                                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                                                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                                            )}
                                                        >
                                                            <Icon className="h-3 w-3 flex-shrink-0" />
                                                            <span className="truncate">{feature.label}</span>
                                                        </Link>
                                                    );
                                                })
                                            )}
                                        </CollapsibleContent>
                                    </Collapsible>
                                </CollapsibleContent>
                            </Collapsible>
                        </SidebarMenuSubItem>

                        {/* Preview & Submit */}
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={location.pathname === '/mis/preview-submit'}>
                                <Link to="/mis/preview-submit">
                                    <Eye className="w-5 h-5 flex-shrink-0" />
                                    <span>Preview & Submit</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={location.pathname === '/mis/support'}>
                                <Link to="/mis/support">
                                    <MessageSquare className="w-5 h-5 flex-shrink-0" />
                                    <span>Help & Support</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
};

// export const MISSubmenu: React.FC<MISSubmenuProps> = ({ isExpanded, onToggle }) => {
//     const location = useLocation();
//     const [searchParams] = useSearchParams();
//     const { user, effectiveCompanyId } = useAuth();

//     const [kpiExpanded, setKpiExpanded] = useState(false);
//     const [quarterlyOpen, setQuarterlyOpen] = useState(true);
//     const [annualOpen, setAnnualOpen] = useState(true);

//     const companyId = effectiveCompanyId || user?.companyId || 'company-1';
//     const { isFeatureEnabled, loading } = useCompanyFeatures(companyId);

//     // Persist & sync quarter/year from URL
//     const [lastQuarter, setLastQuarter] = useState(() =>
//         sessionStorage.getItem('fireside_selected_quarter') || 'Q1'
//     );
//     const [lastYear, setLastYear] = useState(() =>
//         sessionStorage.getItem('fireside_selected_year') || '2025'
//     );

//     const urlQuarter = searchParams.get('quarter');
//     const urlYear = searchParams.get('year');

//     useEffect(() => {
//         if (urlQuarter) {
//             setLastQuarter(urlQuarter);
//             sessionStorage.setItem('fireside_selected_quarter', urlQuarter);
//         }
//         if (urlYear) {
//             setLastYear(urlYear);
//             sessionStorage.setItem('fireside_selected_year', urlYear);
//         }
//     }, [urlQuarter, urlYear]);

//     const selectedQuarter = urlQuarter || lastQuarter;
//     const selectedYear = urlYear || lastYear;
//     const isQ4Selected = selectedQuarter === 'Q4';

//     const enabledQuarterlyFeatures = QUARTERLY_FEATURES.filter(f => isFeatureEnabled(f.key));
//     const enabledAnnualFeatures = ANNUAL_FEATURES.filter(f => isFeatureEnabled(f.key));

//     // Auto-expand KPI Entry submenu when on a kpi-entry route
//     const isOnKpiRoute =
//         location.pathname === '/mis/data-entry' ||
//         location.pathname === '/mis/kpi-entry';

//     useEffect(() => {
//         if (isOnKpiRoute) setKpiExpanded(true);
//     }, [isOnKpiRoute]);

//     const topItems = [
//         { name: 'Dashboard', href: '/mis/dashboard', icon: FileSearch },
//         { name: 'Preview & Submit', href: '/mis/preview-submit', icon: FileSearch },
//     ];

//     return (
//         <SidebarMenuItem>
//             <Collapsible open={isExpanded} onOpenChange={onToggle}>
//                 {/* ── MIS top-level trigger ── */}
//                 <CollapsibleTrigger asChild>
//                     <SidebarMenuButton className="w-full justify-between">
//                         <div className="flex items-center gap-2">
//                             <Target className="h-4 w-4" />
//                             <span>MIS</span>
//                         </div>
//                         {isExpanded
//                             ? <ChevronDown className="h-4 w-4" />
//                             : <ChevronRight className="h-4 w-4" />
//                         }
//                     </SidebarMenuButton>
//                 </CollapsibleTrigger>

//                 <CollapsibleContent>
//                     <SidebarMenuSub>

//                         {/* Dashboard */}
//                         <SidebarMenuSubItem>
//                             <SidebarMenuSubButton asChild isActive={location.pathname === '/mis/dashboard'}>
//                                 <Link to="/mis/dashboard">
//                                     <FileSearch className="h-4 w-4" />
//                                     <span>Dashboard</span>
//                                 </Link>
//                             </SidebarMenuSubButton>
//                         </SidebarMenuSubItem>

//                         {/* ── KPI Entry — nested collapsible ── */}
//                         <SidebarMenuSubItem>
//                             <Collapsible open={kpiExpanded} onOpenChange={setKpiExpanded}>
//                                 <CollapsibleTrigger asChild>
//                                     <SidebarMenuSubButton
//                                         isActive={isOnKpiRoute}
//                                         className="w-full justify-between cursor-pointer"
//                                     >
//                                         {/* <div className="flex items-center gap-2"> */}
//                                         <Link to="/mis/data-entry" className="flex items-center gap-2">
//                                             <ClipboardList className="h-4 w-4" />
//                                             <span>KPI Entry</span>
//                                         </Link>
//                                         {/* </div> */}
//                                         {kpiExpanded
//                                             ? <ChevronDown className="h-3 w-3 ml-auto" />
//                                             : <ChevronRight className="h-3 w-3 ml-auto" />
//                                         }
//                                     </SidebarMenuSubButton>
//                                 </CollapsibleTrigger>

//                                 <CollapsibleContent>
//                                     {/* ── Quarterly KPIs ── */}
//                                     <Collapsible open={quarterlyOpen} onOpenChange={setQuarterlyOpen}>
//                                         <CollapsibleTrigger className={cn(
//                                             'flex items-center gap-2 w-full px-2 py-1.5 pl-6 text-xs',
//                                             'font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground',
//                                             'transition-colors rounded-md hover:bg-sidebar-accent/50'
//                                         )}>
//                                             <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
//                                             <span>Quarterly KPIs</span>
//                                             <ChevronDown className={cn(
//                                                 'h-3 w-3 ml-auto transition-transform duration-200',
//                                                 quarterlyOpen && 'rotate-180'
//                                             )} />
//                                         </CollapsibleTrigger>

//                                         <CollapsibleContent className="space-y-0.5 mt-0.5">
//                                             {!loading && enabledQuarterlyFeatures.map((feature) => {
//                                                 const Icon = FEATURE_ICONS[feature.key] || ClipboardList;
//                                                 const isActive =
//                                                     location.pathname === '/mis/kpi-entry' &&
//                                                     location.search.includes(`feature=${feature.key}`);
//                                                 return (
//                                                     <Link
//                                                         key={feature.key}
//                                                         to={`/mis/kpi-entry?tab=quarterly&feature=${feature.key}&quarter=${selectedQuarter}&year=${selectedYear}`}
//                                                         className={cn(
//                                                             'flex items-center gap-2 pl-10 pr-3 py-1 rounded text-xs transition-colors',
//                                                             isActive
//                                                                 ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
//                                                                 : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
//                                                         )}
//                                                     >
//                                                         <Icon className="h-3 w-3 flex-shrink-0" />
//                                                         <span className="truncate">{feature.label}</span>
//                                                     </Link>
//                                                 );
//                                             })}
//                                         </CollapsibleContent>
//                                     </Collapsible>

//                                     {/* ── Annual KPIs ── */}
//                                     <Collapsible open={annualOpen} onOpenChange={setAnnualOpen}>
//                                         <CollapsibleTrigger className={cn(
//                                             'flex items-center gap-2 w-full px-2 py-1.5 pl-6 text-xs',
//                                             'font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground',
//                                             'transition-colors rounded-md hover:bg-sidebar-accent/50'
//                                         )}>
//                                             <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
//                                             <span>Annual KPIs</span>
//                                             {!isQ4Selected && (
//                                                 <Tooltip>
//                                                     <TooltipTrigger asChild>
//                                                         <Lock className="h-3 w-3 ml-1 text-sidebar-foreground/30" />
//                                                     </TooltipTrigger>
//                                                     <TooltipContent side="right">
//                                                         <p className="text-xs">Annual KPIs are only available in Q4</p>
//                                                     </TooltipContent>
//                                                 </Tooltip>
//                                             )}
//                                             <ChevronDown className={cn(
//                                                 'h-3 w-3 ml-auto transition-transform duration-200',
//                                                 annualOpen && 'rotate-180'
//                                             )} />
//                                         </CollapsibleTrigger>

//                                         <CollapsibleContent className="space-y-0.5 mt-0.5">
//                                             {!isQ4Selected ? (
//                                                 <p className="pl-10 pr-3 py-1.5 text-[10px] text-sidebar-foreground/50 italic leading-relaxed">
//                                                     Annual KPIs only available in Q4.
//                                                 </p>
//                                             ) : (
//                                                 !loading && enabledAnnualFeatures.map((feature) => {
//                                                     const Icon = FEATURE_ICONS[feature.key] || ClipboardList;
//                                                     const isActive =
//                                                         location.pathname === '/mis/kpi-entry' &&
//                                                         location.search.includes(`feature=${feature.key}`);
//                                                     return (
//                                                         <Link
//                                                             key={feature.key}
//                                                             to={`/mis/kpi-entry?tab=annual&feature=${feature.key}&quarter=Q4&year=${selectedYear}`}
//                                                             className={cn(
//                                                                 'flex items-center gap-2 pl-10 pr-3 py-1 rounded text-xs transition-colors',
//                                                                 isActive
//                                                                     ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
//                                                                     : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
//                                                             )}
//                                                         >
//                                                             <Icon className="h-3 w-3 flex-shrink-0" />
//                                                             <span className="truncate">{feature.label}</span>
//                                                         </Link>
//                                                     );
//                                                 })
//                                             )}
//                                         </CollapsibleContent>
//                                     </Collapsible>
//                                 </CollapsibleContent>
//                             </Collapsible>
//                         </SidebarMenuSubItem>

//                         {/* Preview & Submit */}
//                         <SidebarMenuSubItem>
//                             <SidebarMenuSubButton asChild isActive={location.pathname === '/mis/preview-submit'}>
//                                 <Link to="/mis/preview-submit">
//                                     <FileSearch className="h-4 w-4" />
//                                     <span>Preview & Submit</span>
//                                 </Link>
//                             </SidebarMenuSubButton>
//                         </SidebarMenuSubItem>

//                     </SidebarMenuSub>
//                 </CollapsibleContent>
//             </Collapsible>
//         </SidebarMenuItem>
//     );
// };