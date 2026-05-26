// import { useEffect, useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { PageHeader } from '@/components/layout/PageHeader';
// import { CompletionRing } from '@/components/CompletionRing';
// import { PeerComparisonBadge } from '@/components/PeerComparisonBadge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Badge } from '@/components/ui/badge';
// // import { useAuth } from '@/contexts/AuthContext';
// import { useAllQuartersProgress } from '@/hooks/useAllQuartersProgress';
// import { usePeerComparison } from '@/hooks/usePeerComparison';
// import { useQuarterlyDataStatus } from '@/hooks/useQuarterlyDataStatus';
// import { useNavigate } from 'react-router-dom';
// import {
//   ClipboardList,
//   Trophy,
//   Calendar,
//   Eye,
//   Edit,
//   Plus,
//   Play,
//   BarChart3,
//   Leaf,
//   UsersRound,
//   Shield,
//   FileDown,
//   BookOpen,
//   ChevronLeft,
//   ChevronRight,
//   Lock
// } from 'lucide-react';
// import { isPeriodEditable } from '@/lib/companyAccessControl';
// // import { useAnalyticsDashboardData } from '@/hooks/useAnalyticsDashboardDataOld';
// import { usePortfolioRankings } from '@/hooks/usePortfolioRankings';
// import { ESGScoreDetailDialog } from '@/components/company-dashboard/ESGScoreDetailDialog';
// import { generateCompanyMISPdf } from '@/lib/companyMISPdf';
// import { ESGRecommendationsPanel } from '@/components/company-dashboard/ESGRecommendationsPanel';
// import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
// import { useAuth } from '@/context/AuthContext';
// import { useAnalyticsDashboardData } from '@/hooks/useAnalyticsDashboardData';
// import { useAdminSettings } from '@/hooks/useAdminSettings';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// const QUARTERS_INFO = [
//   { key: 'Q1', label: 'Q1', months: 'JFM', description: 'Jan-Mar' },
//   { key: 'Q2', label: 'Q2', months: 'AMJ', description: 'Apr-Jun' },
//   { key: 'Q3', label: 'Q3', months: 'JAS', description: 'Jul-Sep' },
//   { key: 'Q4', label: 'Q4', months: 'OND', description: 'Oct-Dec' },
// ];

// const CompanyDashboard = () => {
//   const { user,effectiveCompanyId } = useAuth();
//   const companyName = user?.name;
//   // const effectiveCompanyId = "company-4";
//   const navigate = useNavigate();
//   const companyId = effectiveCompanyId || user?.company_id ;
//   useEffect(() => {
//     console.log('Auth context values in CompanyDashboard:', { user, effectiveCompanyId, companyId });
//   }, [effectiveCompanyId,user]);

//   // State for selected quarter view — defaults to the open period (Q1 2026).
//   // Year can flip between 2025 (historical, view-only) and 2026 (current) via arrows.
//   const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1');
//   const [selectedYear, setSelectedYear] = useState<number>(2026);


//   // State for ESG score detail dialog
//   const [scoreDetailOpen, setScoreDetailOpen] = useState(false);
//   const [scoreDetailType, setScoreDetailType] = useState<'environment' | 'social' | 'governance' | 'composite'>('environment');
//   const [envNADialogOpen, setEnvNADialogOpen] = useState(false);

//   // TO
//   // ─── Published score period ───
//   // Grades, percentile cards, rankings and recommendations are *locked* to the
//   // last period Fireside published (default Q4/FY 2025). The data-entry table
//   // below continues to follow selectedYear/selectedQuarter so users can enter
//   // fresh numbers, but the score widgets do NOT recompute live every quarter.
//   const { getPublishedPeriod, loading: settingsLoading } = useAdminSettings();
//   const published = getPublishedPeriod();
//   const publishedYear = published.year;
//   const publishedQuarter = published.quarter;

//   const isLockedToPublished =
//     selectedYear !== publishedYear ||
//     selectedQuarter !== publishedQuarter;
//   // Use all quarters progress data from the database (respect company-specific period exclusions)
//   const allQuartersProgress = useAllQuartersProgress(companyId, selectedYear, 0, true);

//   // Use real peer comparison data
//   // const peerComparison = usePeerComparison(companyId, selectedQuarter, selectedYear);
//   const peerComparison = usePeerComparison(
//     companyId,
//     publishedQuarter,
//     publishedYear
//   );

//   // Fetch ESG scores for this company
//   // const analyticsData = useAnalyticsDashboardData({
//   //   period: 'quarterly',
//   //   quarter: selectedQuarter,
//   //   year: selectedYear,
//   //   companyId,
//   // });
//   const analyticsData = useAnalyticsDashboardData({
//     period: publishedQuarter === 'FY'
//       ? 'annual'
//       : 'quarterly',
//     quarter: publishedQuarter,
//     year: publishedYear,
//     companyId,
//   });

//   // Fetch all companies data (annual combined) for PDF chart comparisons
//   // const allCompaniesData = useAnalyticsDashboardData({
//   //   period: 'annual',
//   //   year: selectedYear,
//   // });
//   const allCompaniesData = useAnalyticsDashboardData({
//     period: 'annual',
//     year: publishedYear,
//   });

//   // Fetch portfolio rankings for PDF export
//   // const { rankings, isLoading: isRankingsLoading } = usePortfolioRankings(selectedYear, selectedQuarter);
//   const { rankings, isLoading: isRankingsLoading } =
//     usePortfolioRankings(
//       publishedYear,
//       publishedQuarter
//     );

//   // Get quarterly data status to show appropriate buttons
//   const quarterlyStatus = useQuarterlyDataStatus(companyId, selectedYear);

//   const {
//     quarters,
//     overallPercentage,
//     totalFilled,
//     totalAssigned,
//     isLoading
//   } = allQuartersProgress;

//   const {
//     completenessPercentile,
//     consistencyPercentile,
//     timelinessPercentile,
//     isLoading: isPeerLoading
//   } = peerComparison;

//   // Determine if any quarter has data to show appropriate header text
//   const hasAnyQuarterData = quarterlyStatus.Q1.hasData ||
//     quarterlyStatus.Q2.hasData ||
//     quarterlyStatus.Q3.hasData ||
//     quarterlyStatus.Q4.hasData;

//   // Handle quarter action click
//   const handleQuarterAction = (quarterKey: string, action: 'view' | 'edit' | 'add') => {
//     // Both 'add' and 'view'/'edit' go to Business Information for that quarter
//     navigate(`/mis/kpi-entry?tab=quarterly&feature=businessInformation&quarter=${quarterKey}&year=${selectedYear}`);
//   };

//   const handleDownloadMIS = () => {
//     // Use all-companies annual data for consistent ESG scores across all views
//     const allCosRaw = allCompaniesData.data?.quarterlyCombinedRawData || allCompaniesData.data?.companyRawData || [];
//     const companyRaw = allCosRaw.find(c => c.companyId === companyId);
//     if (!companyRaw) return;

//     const ranking = rankings.find(r => r.companyId === companyId);

//     // Use data from companyRaw (analytics) directly — no dependency on mockCompanies
//     const effectiveIndustry = companyRaw.industry || ranking?.industry || 'N/A';
//     const effectiveRevenueStage = companyRaw.revenueStage || '';

//     const effectiveRanking = ranking || {
//       companyId,
//       companyName: companyName || companyRaw.companyName || '',
//       brand: companyName || companyRaw.brand || '',
//       industry: effectiveIndustry,
//       completionPct: overallPercentage,
//       consistencyPct: 0,
//       timelinessScore: 0,
//       completenessPercentile,
//       consistencyPercentile,
//       timelinessPercentile,
//       esgCompleteness: { E: 0, S: 0, G: 0, overall: overallPercentage },
//     };

//     generateCompanyMISPdf({
//       companyName: companyName || companyRaw.brand || companyRaw.companyName || 'Company',
//       industry: effectiveIndustry,
//       revenueStage: effectiveRevenueStage,
//       companyId,
//       companyRaw,
//       allCompaniesRaw: allCosRaw,
//       ranking: effectiveRanking,
//       overallProgress: { filled: totalFilled, total: totalAssigned, percentage: overallPercentage },
//     });
//   };


//   return (
//     <UnifiedSidebarLayout>
//       <PageHeader
//         title={`Welcome, ${user?.name || 'User'}`}
//         subtitle={`${companyName} • ${selectedQuarter} ${selectedYear} ESG Data Collection`}
//         actions={
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               onClick={handleDownloadMIS}
//               disabled={analyticsData.isLoading || !analyticsData.data || allCompaniesData.isLoading}
//             >
//               <FileDown className="w-4 h-4 mr-2" />
//               Download MIS PDF
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 const storageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/founder-guide/Fireside_ESG_Platform_Founders_Guide.pdf`;
//                 const link = document.createElement('a');
//                 link.href = storageUrl;
//                 link.download = 'Fireside_ESG_Platform_Founders_Guide.pdf';
//                 link.target = '_blank';
//                 link.click();
//               }}
//             >
//               <BookOpen className="w-4 h-4 mr-2" />
//               Founder's Guide
//             </Button>
//             <Button onClick={() => window.open('https://firesidekpi.lovable.app/demo', '_blank')}>
//               <Play className="w-4 h-4 mr-2" />
//               View Demo
//             </Button>
//             <Button onClick={() => navigate(`/mis/data-entry?quarter=${selectedQuarter}&year=${selectedYear}`)}>
//               <ClipboardList className="w-4 h-4 mr-2" />
//               Continue Data Entry
//             </Button>
//           </div>
//         }
//       />

//       {isLockedToPublished && !settingsLoading && (
//         <Alert className="mb-4 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
//           <Lock className="w-4 h-4 text-amber-600" />

//           <AlertTitle className="text-amber-900 dark:text-amber-200">
//             Scores locked to {publishedQuarter} {publishedYear}
//           </AlertTitle>

//           <AlertDescription className="text-amber-800 dark:text-amber-300/90">
//             Your ESG grades, percentile cards, rankings and recommendations are
//             locked to {publishedQuarter} {publishedYear} results.

//             {selectedQuarter} {selectedYear} scores
//             will be published after the reporting window closes and Fireside completes
//             recalibration.

//             You can still enter data for
//             {selectedQuarter} {selectedYear}
//             in the table below.
//           </AlertDescription>
//         </Alert>
//       )}


//       {/* Progress Report - Stat Cards */}
//       {(() => {
//         // Compute Overall Rank percentile from average raw score (matching Category Breakdown)

//         const myRanking = rankings.find(r => r.companyId === companyId);
//         const myAvgScore = myRanking ? Math.round((myRanking.completionPct + myRanking.consistencyPct + myRanking.timelinessScore) / 3 * 10) / 10 : 0;
//         const allAvgScores = rankings.map(r => Math.round((r.completionPct + r.consistencyPct + r.timelinessScore) / 3 * 10) / 10);
//         const sortedAvg = [...allAvgScores].sort((a, b) => a - b);
//         let overallIdx = sortedAvg.findIndex(v => v >= myAvgScore);
//         if (overallIdx === -1) overallIdx = sortedAvg.length - 1;
//         const overallPct = sortedAvg.length <= 1 ? 99 : Math.max(1, Math.min(99, Math.round(((overallIdx + 1) / sortedAvg.length) * 99)));
//         const nCompanies = rankings.length;
//         const progressCards = [
//           { label: 'Overall Rank', value: overallPct, icon: <Trophy className="w-4 h-4 text-amber-600" />, color: 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10', n: nCompanies },
//           { label: 'Completeness', value: completenessPercentile, icon: <ClipboardList className="w-4 h-4 text-emerald-600" />, color: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20', n: nCompanies },
//           { label: 'Consistency', value: consistencyPercentile, icon: <BarChart3 className="w-4 h-4 text-blue-600" />, color: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10', n: nCompanies },
//           { label: 'Timeliness', value: timelinessPercentile, icon: <Calendar className="w-4 h-4 text-purple-600" />, color: 'border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10', n: nCompanies },
//         ];
//         // console.log('Peer comparison data:', { completenessPercentile, consistencyPercentile, timelinessPercentile, overallPct, progressCards });
//         const getOrdinalSuffix = (n: number): string => {
//           const s = ['th', 'st', 'nd', 'rd'];
//           const v = n % 100;
//           return s[(v - 20) % 10] || s[v] || s[0];
//         };

//         const getGrade = (percentile: number): { grade: string; color: string } => {
//           if (percentile >= 80) return { grade: 'AA', color: 'text-emerald-600' };
//           if (percentile >= 60) return { grade: 'A', color: 'text-blue-600' };
//           if (percentile >= 40) return { grade: 'BB', color: 'text-amber-600' };
//           if (percentile >= 20) return { grade: 'B', color: 'text-orange-600' };
//           return { grade: 'C', color: 'text-red-600' };
//         };

//         const getScoreGrade = (score: number): { grade: string; color: string } => {
//           if (score >= 80) return { grade: 'AA', color: 'text-emerald-600' };
//           if (score >= 60) return { grade: 'A', color: 'text-blue-600' };
//           if (score >= 40) return { grade: 'BB', color: 'text-amber-600' };
//           if (score >= 20) return { grade: 'B', color: 'text-orange-600' };
//           return { grade: 'C', color: 'text-red-600' };
//         };

//         return (
//           <>
//             <div className="flex items-center gap-2 mb-3">
//               <Trophy className="w-5 h-5 text-amber-500" />
//               <h2 className="text-base font-semibold">Progress Report - Category (AA–C)</h2>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//               {isPeerLoading ? [1, 2, 3, 4].map(i => (
//                 <Skeleton key={i} className="h-24 rounded-lg" />
//               )) : progressCards.map(card => {
//                 const { grade, color: gradeColor } = getGrade(card.value);
//                 return (
//                   <Card key={card.label} className={`${card.color} transition-all hover:shadow-md`}>
//                     <CardContent className="pt-3 pb-2">
//                       <div className="flex items-center justify-between mb-1">
//                         <p className="text-[11px] font-medium text-muted-foreground">{card.label}</p>
//                         {card.icon}
//                       </div>
//                       <div className="flex items-end gap-2">
//                         <span className={`text-2xl font-bold ${gradeColor}`}>{grade}</span>
//                         <span className="text-xs text-muted-foreground mb-1">grade</span>
//                       </div>
//                       <Badge variant="secondary" className="text-[9px] mt-1">n={card.n}</Badge>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>

//             {/* ESG Score Stat Cards */}
//             {(() => {
//               // Use all-companies annual data for ESG scores to ensure proper percentile normalization
//               // (single-company quarterly data normalizes against a pool of 1, giving incorrect percentiles)
//               const allAd = allCompaniesData.data;
//               const allRawData = allAd?.quarterlyCombinedRawData || allAd?.companyRawData || [];
//               const companyData = allRawData.find(c => c.companyId === companyId);
//               const companyHasEnvFeature = companyData?.hasEnvironmentFeature !== false;

//               // Compute cohort percentiles matching ESGCategoryBreakdown.assignPercentiles
//               // Use rank-based approach: sort ascending, assign percentile = round(((idx+1)/n)*99)
//               // Then look up this company by brand to get its exact percentile
//               const submitting = allRawData.filter(c => Object.keys(c.kpis).length > 0);
//               const envEligible = submitting.filter(c => (c as any).hasEnvironmentFeature);

//               const assignPercentilesForKey = (pool: typeof allRawData, key: string): Map<string, number> => {
//                 const entries = pool
//                   .filter(c => { const v = (c.insights as any)?.[key]; return v !== undefined && v !== null && !isNaN(v); })
//                   .map(c => ({ brand: c.brand, score: (c.insights as any)[key] as number }));
//                 if (entries.length === 0) return new Map();
//                 if (entries.length === 1) return new Map([[entries[0].brand, 99]]);
//                 const sorted = [...entries].sort((a, b) => {
//                   const diff = a.score - b.score;
//                   return diff !== 0 ? diff : a.brand.localeCompare(b.brand);
//                 });
//                 const result = new Map<string, number>();
//                 sorted.forEach((c, idx) => {
//                   result.set(c.brand, Math.max(1, Math.min(99, Math.round(((idx + 1) / sorted.length) * 99))));
//                 });
//                 return result;
//               };

//               const companyBrand = companyData?.brand || companyName || '';
//               const esgPctileMap = assignPercentilesForKey(submitting, 'esgCompositeScore');
//               const envPctileMap = assignPercentilesForKey(envEligible, 'circularEconomyIndex');
//               const socPctileMap = assignPercentilesForKey(submitting, 'socialScore');
//               const govPctileMap = assignPercentilesForKey(submitting, 'governanceScore');

//               const esgPctile = esgPctileMap.get(companyBrand) ?? 1;
//               const envPctile = envPctileMap.get(companyBrand) ?? 1;
//               const socPctile = socPctileMap.get(companyBrand) ?? 1;
//               const govPctile = govPctileMap.get(companyBrand) ?? 1;

//               const esgCards = [
//                 { label: 'ESG Composite Score', value: companyData?.insights?.esgCompositeScore ?? 0, percentile: esgPctile, icon: <BarChart3 className="w-4 h-4 text-emerald-600" />, color: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20', clickType: 'composite' as const, n: submitting.length },
//                 { label: 'Environment Score', value: companyData?.insights?.circularEconomyIndex ?? 0, percentile: envPctile, icon: <Leaf className="w-4 h-4 text-amber-600" />, color: 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10', clickType: 'environment' as const, n: envEligible.length },
//                 { label: 'Social Score', value: companyData?.insights?.socialScore ?? 0, percentile: socPctile, icon: <UsersRound className="w-4 h-4 text-blue-600" />, color: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10', clickType: 'social' as const, n: submitting.length },
//                 { label: 'Governance Score', value: companyData?.insights?.governanceScore ?? 0, percentile: govPctile, icon: <Shield className="w-4 h-4 text-purple-600" />, color: 'border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10', clickType: 'governance' as const, n: submitting.length },
//               ];
//               console.log('ESG score cards data:', { companyData, esgCards, esgPctileMap, envPctileMap, socPctileMap, govPctileMap });
//               return (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//                   {allAd ? esgCards.map(card => {
//                     const isEnvNA = card.clickType === 'environment' && !companyHasEnvFeature;
//                     const { grade, color: gradeColor } = getScoreGrade(card.percentile);
//                     return (
//                       <Card
//                         key={card.label}
//                         className={`${card.color} transition-all hover:shadow-md cursor-pointer hover:ring-2 hover:ring-primary/30`}
//                         onClick={() => {
//                           if (isEnvNA) {
//                             setEnvNADialogOpen(true);
//                           } else {
//                             setScoreDetailType(card.clickType);
//                             setScoreDetailOpen(true);
//                           }
//                         }}
//                       >
//                         <CardContent className="pt-3 pb-2">
//                           <div className="flex items-center justify-between mb-1">
//                             <p className="text-[11px] font-medium text-muted-foreground">{card.label}</p>
//                             {card.icon}
//                           </div>
//                           {isEnvNA ? (
//                             <div className="flex items-end gap-2">
//                               <span className="text-2xl font-bold text-muted-foreground">NA</span>
//                               <span className="text-xs text-muted-foreground mb-1">not applicable</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-end gap-2">
//                               <span className={`text-2xl font-bold ${gradeColor}`}>{grade}</span>
//                               <span className="text-xs text-muted-foreground mb-1">grade</span>
//                             </div>
//                           )}
//                           <div className="flex items-center justify-between mt-1">
//                             <Badge variant="secondary" className="text-[9px]">n={card.n}</Badge>
//                             <p className="text-[9px] text-muted-foreground">
//                               {isEnvNA ? 'Click for details →' : 'Click to view breakdown →'}
//                             </p>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     );
//                   }) : [1, 2, 3, 4].map(i => (
//                     <Skeleton key={i} className="h-24 rounded-lg" />
//                   ))}
//                 </div>
//               );
//             })()}
//           </>
//         );
//       })()}
//       {/* ESG Recommendations Panel */}
//       {(() => {
//         const allAd = allCompaniesData.data;
//         const allRaw = allAd?.quarterlyCombinedRawData || allAd?.companyRawData || [];
//         if (allRaw.length === 0 || allCompaniesData.isLoading) return null;
//         return (
//           <ESGRecommendationsPanel
//             companyId={companyId}
//             allCompaniesRaw={allRaw}
//             rankings={rankings}
//             year={publishedYear}
//           />
//         );
//       })()}

//       {/* Quarter Selection Buttons */}
//       <Card className="mb-6">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between gap-2">
//             <div>
//               <CardTitle className="flex items-center gap-2 text-base">
//                 <Calendar className="w-5 h-5 text-primary" />
//                 {hasAnyQuarterData ? 'Select Quarter to View/Edit' : 'Select Quarter'}
//               </CardTitle>
//               <p className="text-xs text-muted-foreground mt-1">
//                 {selectedYear === 2026
//                   ? 'Q1 2026 (JFM) is open for data entry. Future quarters unlock as the year progresses.'
//                   : 'Showing historical 2025 data — view only. Click the right arrow to return to 2026.'}
//               </p>
//             </div>
//             <Badge variant={selectedYear === 2026 ? 'default' : 'secondary'} className="text-xs">
//               {selectedYear}
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {quarterlyStatus.isLoading ? (
//             <div className="grid grid-cols-4 gap-3">
//               {[1, 2, 3, 4].map((i) => (
//                 <Skeleton key={i} className="h-32 rounded-lg" />
//               ))}
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               {/* Left arrow → go to 2025 */}
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="shrink-0 h-10 w-10"
//                 disabled={selectedYear === 2025}
//                 onClick={() => {
//                   setSelectedYear(2025);
//                   setSelectedQuarter('Q4');
//                 }}
//                 title="View 2025 quarters"
//                 aria-label="Previous year"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </Button>

//               <div className="grid grid-cols-4 gap-3 flex-1 min-w-0">
//                 {QUARTERS_INFO.map((q) => {
//                   const quarterStatus = quarterlyStatus[q.key as keyof typeof quarterlyStatus] as { hasData: boolean; entryCount: number };
//                   const hasData = quarterStatus?.hasData || false;
//                   const quarterProgress = quarters[q.key];
//                   const progressPct = quarterProgress?.percentage || 0;
//                   const isEditable = isPeriodEditable(q.key, selectedYear);
//                   // In 2026: only Q1 is selectable; Q2/Q3/Q4 are future periods (disabled).
//                   // In 2025: all quarters are selectable (view-only mode).
//                   const isFuture2026 = selectedYear === 2026 && !isEditable;
//                   const isDisabled = isFuture2026;
//                   const isSelected = selectedQuarter === q.key;

//                   return (
//                     <div
//                       key={q.key}
//                       className={`relative rounded-lg border-2 transition-all ${isDisabled
//                         ? 'border-dashed border-border bg-muted/30 cursor-not-allowed opacity-60'
//                         : isSelected
//                           ? 'border-primary bg-primary/5 cursor-pointer'
//                           : 'border-border hover:border-primary/50 cursor-pointer'
//                         }`}
//                       onClick={() => { if (!isDisabled) setSelectedQuarter(q.key); }}
//                       aria-disabled={isDisabled}
//                       title={isDisabled ? `${q.label} ${selectedYear} is not yet open` : undefined}
//                     >
//                       <div className="p-4 text-center">
//                         <div className="flex items-center justify-center gap-1 mb-1">
//                           <span className="text-lg font-bold">{q.label}</span>
//                           <Badge variant="outline" className="text-[10px] h-4">
//                             {q.months}
//                           </Badge>
//                           {isFuture2026 && <Lock className="w-3 h-3 text-muted-foreground" />}
//                         </div>
//                         <p className="text-xs text-muted-foreground">{q.description} {selectedYear}</p>

//                         {/* Progress indicator (hidden for future-locked quarters) */}
//                         {!isFuture2026 ? (
//                           <div className="mt-2">
//                             <div className="flex items-center justify-center gap-1.5">
//                               <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
//                                 <div
//                                   className="h-full bg-primary rounded-full transition-all"
//                                   style={{ width: `${progressPct}%` }}
//                                 />
//                               </div>
//                               <span className="text-xs font-medium">{progressPct}%</span>
//                             </div>
//                             {quarterProgress && (
//                               <p className="text-[10px] text-muted-foreground mt-0.5">
//                                 {quarterProgress.filled}/{quarterProgress.total} KPIs
//                               </p>
//                             )}
//                           </div>
//                         ) : (
//                           <p className="text-[10px] text-muted-foreground mt-2 italic">Not yet open</p>
//                         )}

//                         {isSelected && !isDisabled && (
//                           <div className="mt-3 flex gap-2 justify-center">
//                             {isEditable ? (
//                               hasData ? (
//                                 <>
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     className="h-7 text-xs px-2"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleQuarterAction(q.key, 'view');
//                                     }}
//                                   >
//                                     <Eye className="w-3 h-3 mr-1" />
//                                     View
//                                   </Button>
//                                   <Button
//                                     size="sm"
//                                     className="h-7 text-xs px-2"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleQuarterAction(q.key, 'edit');
//                                     }}
//                                   >
//                                     <Edit className="w-3 h-3 mr-1" />
//                                     Edit
//                                   </Button>
//                                 </>
//                               ) : (
//                                 <Button
//                                   size="sm"
//                                   className="h-7 text-xs px-3"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleQuarterAction(q.key, 'add');
//                                   }}
//                                 >
//                                   <Plus className="w-3 h-3 mr-1" />
//                                   Add details
//                                 </Button>
//                               )
//                             ) : (
//                               // Locked historical period — view only
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="h-7 text-xs px-2"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleQuarterAction(q.key, 'view');
//                                 }}
//                               >
//                                 <Eye className="w-3 h-3 mr-1" />
//                                 View
//                               </Button>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Right arrow → go to 2026 */}
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="shrink-0 h-10 w-10"
//                 disabled={selectedYear === 2026}
//                 onClick={() => {
//                   setSelectedYear(2026);
//                   setSelectedQuarter('Q1');
//                 }}
//                 title="View 2026 quarters"
//                 aria-label="Next year"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>



//       <Card className="mb-6 overflow-hidden">
//         <CardContent className="p-5 flex items-center gap-4">
//           {isLoading ? (
//             <Skeleton className="w-20 h-20 rounded-full" />
//           ) : (
//             <CompletionRing percentage={overallPercentage} size="lg" />
//           )}
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold mb-0.5">Overall KPI Progress</h3>
//             <p className="text-sm text-muted-foreground">
//               {totalFilled} of {totalAssigned} KPIs completed across all periods
//             </p>
//             {overallPercentage < 100 && (
//               <p className="text-xs text-status-warning mt-1">
//                 {totalAssigned - totalFilled} KPIs remaining
//               </p>
//             )}
//             {overallPercentage === 100 && (
//               <p className="text-xs text-status-success mt-1">
//                 ✓ All KPIs completed
//               </p>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Weightage Note */}
//       <Card className="border-dashed border-muted-foreground/30 bg-muted/30">
//         <CardContent className="pt-4 pb-4 space-y-3">
//           <p className="text-xs text-muted-foreground italic">
//             <strong>Note:</strong> Each KPI score has a different weightage, determined internally by Fireside, and is not equally distributed.
//           </p>
//           <div className="border-t border-border pt-2">
//             <p className="text-xs font-semibold text-muted-foreground mb-1">Glossary</p>
//             <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
//               <li><strong>EPR</strong> — Extended Producer Responsibility: A regulatory framework where producers are responsible for the end-of-life management of their products and packaging.</li>
//               <li><strong>VPN</strong> — Voluntary Plastic Neutrality: A voluntary commitment to offset plastic usage by recovering and recycling an equivalent amount of plastic waste.</li>
//               <li><strong>P&S Recycled/Pkg</strong> — Primary & Secondary Recycled Packaging: The percentage of primary and secondary packaging materials (plastic, paper, glass, metal, plant-based) that are sourced from recycled content.</li>
//               <li><strong>ESG</strong> — Environmental, Social & Governance: A framework for evaluating a company's performance across sustainability and ethical dimensions.</li>
//               <li><strong>CEI</strong> — Circular Economy Index: A composite score measuring a company's progress toward circular material flows, used as the Environment score.</li>
//               <li><strong>GHG</strong> — Greenhouse Gas: Gases that trap heat in the atmosphere, commonly tracked under Scope 1, 2, and 3 emissions.</li>
//               <li><strong>DEI</strong> — Diversity, Equity & Inclusion: Policies and metrics related to workforce diversity and equitable practices.</li>
//               <li><strong>SRI</strong> — Socially Responsible Investment: Investment strategies that consider social and environmental impact alongside financial returns.</li>
//             </ul>
//           </div>
//         </CardContent>
//       </Card>



//       {/* Environment NA Dialog */}
//       <Dialog open={envNADialogOpen} onOpenChange={setEnvNADialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Leaf className="w-5 h-5 text-amber-600" />
//               Environment Score — Not Applicable
//             </DialogTitle>
//           </DialogHeader>
//           <p className="text-sm text-muted-foreground">
//             Environment KPIs were not activated for your company. If you believe this is an error, please contact the Fireside team.
//           </p>
//         </DialogContent>
//       </Dialog>

//       {/* ESG Score Detail Dialog */}
//       <ESGScoreDetailDialog
//         open={scoreDetailOpen}
//         onOpenChange={setScoreDetailOpen}
//         scoreType={scoreDetailType}
//         companyId={companyId}
//         year={publishedYear}
//         dashboardViewMode={'category'}
//       />
//     </UnifiedSidebarLayout>
//   );
// };

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { CompletionRing } from '@/components/CompletionRing';
import { PeerComparisonBadge } from '@/components/PeerComparisonBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAllQuartersProgress } from '@/hooks/useAllQuartersProgress';
import { usePeerComparison } from '@/hooks/usePeerComparison';
import { useQuarterlyDataStatus } from '@/hooks/useQuarterlyDataStatus';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Trophy,
  Calendar,
  Eye,
  Edit,
  Plus,
  Play,
  BarChart3,
  Leaf,
  UsersRound,
  Shield,
  FileDown,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Lock
} from 'lucide-react';
import { isPeriodEditable } from '@/lib/companyAccessControl';
import { usePortfolioRankings } from '@/hooks/usePortfolioRankings';
import { ESGScoreDetailDialog } from '@/components/company-dashboard/ESGScoreDetailDialog';
import { generateCompanyMISPdf } from '@/lib/companyMISPdf';
import { ESGRecommendationsPanel } from '@/components/company-dashboard/ESGRecommendationsPanel';
import UnifiedSidebarLayout from '@/components/layout/UnifiedSidebarLayout';
import { useAuth } from '@/context/AuthContext';
import { useAnalyticsDashboardData } from '@/hooks/useAnalyticsDashboardData';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProgressCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  n: number;
}

interface EsgCard {
  label: string;
  value: number;
  percentile: number;
  icon: React.ReactNode;
  color: string;
  clickType: 'composite' | 'environment' | 'social' | 'governance';
  n: number;
  isEnvNA?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUARTERS_INFO = [
  { key: 'Q1', label: 'Q1', months: 'JFM', description: 'Jan-Mar' },
  { key: 'Q2', label: 'Q2', months: 'AMJ', description: 'Apr-Jun' },
  { key: 'Q3', label: 'Q3', months: 'JAS', description: 'Jul-Sep' },
  { key: 'Q4', label: 'Q4', months: 'OND', description: 'Oct-Dec' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGrade = (percentile: number): { grade: string; color: string } => {
  if (percentile >= 80) return { grade: 'AA', color: 'text-emerald-600' };
  if (percentile >= 60) return { grade: 'A',  color: 'text-blue-600' };
  if (percentile >= 40) return { grade: 'BB', color: 'text-amber-600' };
  if (percentile >= 20) return { grade: 'B',  color: 'text-orange-600' };
  return { grade: 'C', color: 'text-red-600' };
};

const assignPercentiles = (pool: any[], key: string): Map<string, number> => {
  const entries = pool
    .filter(c => { const v = c.insights?.[key]; return v !== undefined && v !== null && !isNaN(v); })
    .map(c => ({ brand: c.brand as string, score: c.insights[key] as number }));
  if (entries.length === 0) return new Map();
  if (entries.length === 1) return new Map([[entries[0].brand, 99]]);
  const sorted = [...entries].sort((a, b) => a.score - b.score || a.brand.localeCompare(b.brand));
  return new Map(
    sorted.map((c, idx) => [
      c.brand,
      Math.max(1, Math.min(99, Math.round(((idx + 1) / sorted.length) * 99))),
    ])
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const CompanyDashboard = () => {
  const { user, effectiveCompanyId } = useAuth();
  const companyName = user?.misCompanyId;
  // const effectiveCompanyId = "company-4";
  const navigate = useNavigate();
  const companyId = effectiveCompanyId || user?.company_id;
  useEffect(() => {
    console.log('Auth context values in CompanyDashboard:', { user, effectiveCompanyId, companyId });
  }, [effectiveCompanyId, user]);

  // ── Quarter / year selection ──────────────────────────────
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q1');
  const [selectedYear, setSelectedYear]       = useState<number>(2026);

  // ── Dialog state ──────────────────────────────────────────
  const [scoreDetailOpen,  setScoreDetailOpen]  = useState(false);
  const [scoreDetailType,  setScoreDetailType]  = useState<'environment' | 'social' | 'governance' | 'composite'>('environment');
  const [envNADialogOpen,  setEnvNADialogOpen]  = useState(false);

  // ── Derived / computed state ──────────────────────────────
  const [progressCards,      setProgressCards]      = useState<ProgressCard[]>([]);
  const [esgCards,           setEsgCards]           = useState<EsgCard[]>([]);
  const [recommendationsRaw, setRecommendationsRaw] = useState<any[]>([]);

  // ── Data hooks ────────────────────────────────────────────
  const { getPublishedPeriod, loading: settingsLoading } = useAdminSettings();
  const published        = getPublishedPeriod();
  const publishedYear    = published.year;
  const publishedQuarter = published.quarter;

  const isLockedToPublished =
    selectedYear !== publishedYear || selectedQuarter !== publishedQuarter;

  const allQuartersProgress = useAllQuartersProgress(companyId, selectedYear, 0, true);
  const peerComparison      = usePeerComparison(companyId, publishedQuarter, publishedYear);
  const analyticsData       = useAnalyticsDashboardData({
    period:  publishedQuarter === 'FY' ? 'annual' : 'quarterly',
    quarter: publishedQuarter,
    year:    publishedYear,
    companyId,
  });
  const allCompaniesData = useAnalyticsDashboardData({
    period: 'annual',
    year:   publishedYear,
  });
  const { rankings, isLoading: isRankingsLoading } = usePortfolioRankings(publishedYear, publishedQuarter);
  const quarterlyStatus = useQuarterlyDataStatus(companyId, selectedYear);

  const { quarters, overallPercentage, totalFilled, totalAssigned, isLoading } = allQuartersProgress;
  const { completenessPercentile, consistencyPercentile, timelinessPercentile, isLoading: isPeerLoading } = peerComparison;

  const hasAnyQuarterData =
    quarterlyStatus.Q1.hasData ||
    quarterlyStatus.Q2.hasData ||
    quarterlyStatus.Q3.hasData ||
    quarterlyStatus.Q4.hasData;

  // ── Debug: auth values ────────────────────────────────────
  useEffect(() => {
    console.log('Auth context values in CompanyDashboard:', { user, effectiveCompanyId, companyId });
  }, [effectiveCompanyId, user]);

  // ── Effect: Progress Report cards ────────────────────────
  useEffect(() => {
    if (isPeerLoading || rankings.length === 0) return;

    const myRanking = rankings.find(r => r.companyId === companyId);
    if (!myRanking) {
      console.warn('[ProgressCards] companyId not found in rankings:', companyId, rankings.map(r => r.companyId));
      return;
    }

    const myAvgScore   = Math.round((myRanking.completionPct + myRanking.consistencyPct + myRanking.timelinessScore) / 3 * 10) / 10;
    const allAvgScores = rankings.map(r =>
      Math.round((r.completionPct + r.consistencyPct + r.timelinessScore) / 3 * 10) / 10
    );
    const sortedAvg  = [...allAvgScores].sort((a, b) => a - b);
    let overallIdx   = sortedAvg.findIndex(v => v >= myAvgScore);
    if (overallIdx === -1) overallIdx = sortedAvg.length - 1;
    const overallPct = sortedAvg.length <= 1
      ? 99
      : Math.max(1, Math.min(99, Math.round(((overallIdx + 1) / sortedAvg.length) * 99)));
    const n = rankings.length;

    setProgressCards([
      {
        label: 'Overall Rank',
        value: overallPct,
        icon:  <Trophy className="w-4 h-4 text-amber-600" />,
        color: 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10',
        n,
      },
      {
        label: 'Completeness',
        value: completenessPercentile,
        icon:  <ClipboardList className="w-4 h-4 text-emerald-600" />,
        color: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20',
        n,
      },
      {
        label: 'Consistency',
        value: consistencyPercentile,
        icon:  <BarChart3 className="w-4 h-4 text-blue-600" />,
        color: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10',
        n,
      },
      {
        label: 'Timeliness',
        value: timelinessPercentile,
        icon:  <Calendar className="w-4 h-4 text-purple-600" />,
        color: 'border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10',
        n,
      },
    ]);
  }, [isPeerLoading, rankings, companyId, completenessPercentile, consistencyPercentile, timelinessPercentile]);

  // ── Effect: ESG Score cards + Recommendations ─────────────
  useEffect(() => {
    if (allCompaniesData.isLoading || !allCompaniesData.data) return;

    const allAd      = allCompaniesData.data;
    const allRawData = allAd?.quarterlyCombinedRawData || allAd?.companyRawData || [];

    if (allRawData.length === 0) return;

    const companyData = allRawData.find((c: any) => c.companyId === companyId);

    // debug — remove once confirmed working
    console.log('[ESGCards] companyId:', companyId);
    console.log('[ESGCards] matched companyData:', companyData);
    console.log('[ESGCards] allRawData ids:', allRawData.map((c: any) => c.companyId));

    if (!companyData) return;

    setRecommendationsRaw(allRawData);

    const submitting  = allRawData.filter((c: any) => Object.keys(c.kpis).length > 0);
    const envEligible = submitting.filter((c: any) => c.hasEnvironmentFeature);
    const companyHasEnvFeature = companyData?.hasEnvironmentFeature !== false;

    const companyBrand = companyData.brand || companyName || '';

    // debug — remove once confirmed working
    console.log('[ESGCards] companyBrand:', companyBrand);
    console.log('[ESGCards] esgPctileMap keys:', [...assignPercentiles(submitting, 'esgCompositeScore').keys()]);

    const esgPctile = assignPercentiles(submitting,  'esgCompositeScore').get(companyBrand)    ?? 1;
    const envPctile = assignPercentiles(envEligible, 'circularEconomyIndex').get(companyBrand) ?? 1;
    const socPctile = assignPercentiles(submitting,  'socialScore').get(companyBrand)          ?? 1;
    const govPctile = assignPercentiles(submitting,  'governanceScore').get(companyBrand)      ?? 1;

    // debug — remove once confirmed working
    console.log('[ESGCards] percentiles:', { esgPctile, envPctile, socPctile, govPctile });

    setEsgCards([
      {
        label:     'ESG Composite Score',
        value:     companyData.insights?.esgCompositeScore    ?? 0,
        percentile: esgPctile,
        icon:      <BarChart3 className="w-4 h-4 text-emerald-600" />,
        color:     'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20',
        clickType: 'composite',
        n:         submitting.length,
      },
      {
        label:     'Environment Score',
        value:     companyData.insights?.circularEconomyIndex ?? 0,
        percentile: envPctile,
        icon:      <Leaf className="w-4 h-4 text-amber-600" />,
        color:     'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10',
        clickType: 'environment',
        n:         envEligible.length,
        isEnvNA:   !companyHasEnvFeature,
      },
      {
        label:     'Social Score',
        value:     companyData.insights?.socialScore          ?? 0,
        percentile: socPctile,
        icon:      <UsersRound className="w-4 h-4 text-blue-600" />,
        color:     'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10',
        clickType: 'social',
        n:         submitting.length,
      },
      {
        label:     'Governance Score',
        value:     companyData.insights?.governanceScore      ?? 0,
        percentile: govPctile,
        icon:      <Shield className="w-4 h-4 text-purple-600" />,
        color:     'border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10',
        clickType: 'governance',
        n:         submitting.length,
      },
    ]);
  }, [allCompaniesData.data, allCompaniesData.isLoading, companyId, companyName]);

  // ── Handlers ──────────────────────────────────────────────
  const handleQuarterAction = (quarterKey: string, action: 'view' | 'edit' | 'add') => {
    navigate(`/mis/kpi-entry?tab=quarterly&feature=businessInformation&quarter=${quarterKey}&year=${selectedYear}`);
  };

  const handleDownloadMIS = () => {
    const allCosRaw  = allCompaniesData.data?.quarterlyCombinedRawData || allCompaniesData.data?.companyRawData || [];
    const companyRaw = allCosRaw.find((c: any) => c.companyId === companyId);
    if (!companyRaw) return;

    const ranking              = rankings.find(r => r.companyId === companyId);
    const effectiveIndustry    = companyRaw.industry || ranking?.industry || 'N/A';
    const effectiveRevenueStage = companyRaw.revenueStage || '';

    const effectiveRanking = ranking || {
      companyId,
      companyName:            companyName || companyRaw.companyName || '',
      brand:                  companyName || companyRaw.brand || '',
      industry:               effectiveIndustry,
      completionPct:          overallPercentage,
      consistencyPct:         0,
      timelinessScore:        0,
      completenessPercentile,
      consistencyPercentile,
      timelinessPercentile,
      esgCompleteness:        { E: 0, S: 0, G: 0, overall: overallPercentage },
    };

    generateCompanyMISPdf({
      companyName:     companyName || companyRaw.brand || companyRaw.companyName || 'Company',
      industry:        effectiveIndustry,
      revenueStage:    effectiveRevenueStage,
      companyId,
      companyRaw,
      allCompaniesRaw: allCosRaw,
      ranking:         effectiveRanking,
      overallProgress: { filled: totalFilled, total: totalAssigned, percentage: overallPercentage },
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <UnifiedSidebarLayout>
      <div className="text-left mt-2">
        <PageHeader
          title={`Welcome, ${user?.misCompanyId || 'User'}`}
          subtitle={`${companyName} • ${selectedQuarter} ${selectedYear} ESG Data Collection`}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadMIS}
                disabled={analyticsData.isLoading || !analyticsData.data || allCompaniesData.isLoading}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download MIS PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const storageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/founder-guide/Fireside_ESG_Platform_Founders_Guide.pdf`;
                  const link = document.createElement('a');
                  link.href = storageUrl;
                  link.download = 'Fireside_ESG_Platform_Founders_Guide.pdf';
                  link.target = '_blank';
                  link.click();
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Founder's Guide
              </Button>
              <Button onClick={() => window.open('https://firesidekpi.lovable.app/demo', '_blank')}>
                <Play className="w-4 h-4 mr-2" />
                View Demo
              </Button>
              <Button onClick={() => navigate(`/mis/data-entry?quarter=${selectedQuarter}&year=${selectedYear}`)}>
                <ClipboardList className="w-4 h-4 mr-2" />
                Continue Data Entry
              </Button>
            </div>
          }
        />
      </div>

      {/* Locked-period alert */}
      {isLockedToPublished && !settingsLoading && (
        <Alert className="mb-4 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <Lock className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-left text-amber-800 dark:text-amber-300/90">
            <b>Scores locked to {publishedQuarter} {publishedYear}</b> Your ESG grades, percentile cards, rankings and recommendations are
            locked to {publishedQuarter} {publishedYear} results.

            {selectedQuarter} {selectedYear} scores
            will be published after the reporting window closes and Fireside completes
            recalibration.

            You can still enter data for
            {selectedQuarter} {selectedYear}
            in the table below.
          </AlertDescription>
        </Alert>
      )}

      {/* ── Progress Report ─────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h2 className="text-base font-semibold">Progress Report - Category (AA–C)</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {isPeerLoading || progressCards.length === 0
          ? [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)
          : progressCards.map(card => {
              const { grade, color: gradeColor } = getGrade(card.value);
              return (
                <Card key={card.label} className={`${card.color} transition-all hover:shadow-md`}>
                  <CardContent className="pt-3 pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] font-medium text-muted-foreground">{card.label}</p>
                      {card.icon}
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`text-2xl font-bold ${gradeColor}`}>{grade}</span>
                      <span className="text-xs text-muted-foreground mb-1">grade</span>
                    </div>
                    <Badge variant="secondary" className="text-[9px] mt-1">n={card.n}</Badge>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* ── ESG Score Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {allCompaniesData.isLoading || esgCards.length === 0
          ? [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)
          : esgCards.map(card => {
              const { grade, color: gradeColor } = getGrade(card.percentile);
              return (
                <Card
                  key={card.label}
                  className={`${card.color} transition-all hover:shadow-md cursor-pointer hover:ring-2 hover:ring-primary/30`}
                  onClick={() => {
                    if (card.isEnvNA) {
                      setEnvNADialogOpen(true);
                    } else {
                      setScoreDetailType(card.clickType);
                      setScoreDetailOpen(true);
                    }
                  }}
                >
                  <CardContent className="pt-3 pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] font-medium text-muted-foreground">{card.label}</p>
                      {card.icon}
                    </div>
                    {card.isEnvNA ? (
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-muted-foreground">NA</span>
                        <span className="text-xs text-muted-foreground mb-1">not applicable</span>
                      </div>
                    ) : (
                      <div className="flex items-end gap-2">
                        <span className={`text-2xl font-bold ${gradeColor}`}>{grade}</span>
                        <span className="text-xs text-muted-foreground mb-1">grade</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-[9px] mt-1">n={card.n}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* ESG Score Stat Cards */}
            {(() => {
              // Use all-companies annual data for ESG scores to ensure proper percentile normalization
              // (single-company quarterly data normalizes against a pool of 1, giving incorrect percentiles)
              const allAd = allCompaniesData.data;
              const allRawData = allAd?.quarterlyCombinedRawData || allAd?.companyRawData || [];
              const companyData = allRawData.find(c => c.companyId === companyId);
              const companyHasEnvFeature = companyData?.hasEnvironmentFeature !== false;

              // Compute cohort percentiles matching ESGCategoryBreakdown.assignPercentiles
              // Use rank-based approach: sort ascending, assign percentile = round(((idx+1)/n)*99)
              // Then look up this company by brand to get its exact percentile
              const submitting = allRawData.filter(c => Object.keys(c.kpis).length > 0);
              const envEligible = submitting.filter(c => (c as any).hasEnvironmentFeature);

              const assignPercentilesForKey = (pool: typeof allRawData, key: string): Map<string, number> => {
                const entries = pool
                  .filter(c => { const v = (c.insights as any)?.[key]; return v !== undefined && v !== null && !isNaN(v); })
                  .map(c => ({ brand: c.brand, score: (c.insights as any)[key] as number }));
                if (entries.length === 0) return new Map();
                if (entries.length === 1) return new Map([[entries[0].brand, 99]]);
                const sorted = [...entries].sort((a, b) => {
                  const diff = a.score - b.score;
                  return diff !== 0 ? diff : a.brand.localeCompare(b.brand);
                });
                const result = new Map<string, number>();
                sorted.forEach((c, idx) => {
                  result.set(c.brand, Math.max(1, Math.min(99, Math.round(((idx + 1) / sorted.length) * 99))));
                });
                return result;
              };

              const companyBrand = companyData?.brand || companyName || '';
              const esgPctileMap = assignPercentilesForKey(submitting, 'esgCompositeScore');
              const envPctileMap = assignPercentilesForKey(envEligible, 'circularEconomyIndex');
              const socPctileMap = assignPercentilesForKey(submitting, 'socialScore');
              const govPctileMap = assignPercentilesForKey(submitting, 'governanceScore');

              const esgPctile = esgPctileMap.get(companyBrand) ?? 1;
              const envPctile = envPctileMap.get(companyBrand) ?? 1;
              const socPctile = socPctileMap.get(companyBrand) ?? 1;
              const govPctile = govPctileMap.get(companyBrand) ?? 1;

              const esgCards = [
                { label: 'ESG Composite Score', value: companyData?.insights?.esgCompositeScore ?? 0, percentile: esgPctile, icon: <BarChart3 className="w-4 h-4 text-emerald-600" />, color: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20', clickType: 'composite' as const, n: submitting.length },
                { label: 'Environment Score', value: companyData?.insights?.circularEconomyIndex ?? 0, percentile: envPctile, icon: <Leaf className="w-4 h-4 text-amber-600" />, color: 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10', clickType: 'environment' as const, n: envEligible.length },
                { label: 'Social Score', value: companyData?.insights?.socialScore ?? 0, percentile: socPctile, icon: <UsersRound className="w-4 h-4 text-blue-600" />, color: 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10', clickType: 'social' as const, n: submitting.length },
                { label: 'Governance Score', value: companyData?.insights?.governanceScore ?? 0, percentile: govPctile, icon: <Shield className="w-4 h-4 text-purple-600" />, color: 'border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10', clickType: 'governance' as const, n: submitting.length },
              ];
              console.log('ESG score cards data:', { companyData, esgCards, esgPctileMap, envPctileMap, socPctileMap, govPctileMap });
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {allAd ? esgCards.map(card => {
                    const isEnvNA = card.clickType === 'environment' && !companyHasEnvFeature;
                    const { grade, color: gradeColor } = getScoreGrade(card.percentile);
                    return (
                      <Card
                        key={card.label}
                        className={`${card.color} transition-all hover:shadow-md cursor-pointer hover:ring-2 hover:ring-primary/30`}
                        onClick={() => {
                          if (isEnvNA) {
                            alert('Environment KPIs were not activated for your company. Please contact the Fireside team if you believe this is an error.');
                            setEnvNADialogOpen(true);
                          } else {
                            alert(`You clicked on ${card.label} details. This will open a dialog with a detailed breakdown of the underlying KPIs contributing to this score, along with insights and recommendations for improvement.`);
                            setScoreDetailType(card.clickType);
                            setScoreDetailOpen(true);
                          }
                        }}
                      >
                        <CardContent className="pt-3 pb-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[11px] font-medium text-muted-foreground">{card.label}</p>
                            {card.icon}
                          </div>
                          {isEnvNA ? (
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-muted-foreground">NA</span>
                              <span className="text-xs text-muted-foreground mb-1">not applicable</span>
                            </div>
                          ) : (
                            <div className="flex items-end gap-2">
                              <span className={`text-2xl font-bold ${gradeColor}`}>{grade}</span>
                              <span className="text-xs text-muted-foreground mb-1">grade</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="secondary" className="text-[9px]">n={card.n}</Badge>
                            <p className="text-[9px] text-muted-foreground">
                              {isEnvNA ? 'Click for details →' : 'Click to view breakdown →'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }) : [1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))}
                </div>
              );
            })}
      </div>

      {/* ── ESG Recommendations ──────────────────────────────── */}
      {recommendationsRaw.length > 0 && !allCompaniesData.isLoading && (
        <ESGRecommendationsPanel
          companyId={companyId}
          allCompaniesRaw={recommendationsRaw}
          rankings={rankings}
          year={publishedYear}
        />
      )}

      {/* ── Quarter Selection ────────────────────────────────── */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5 text-primary" />
                {hasAnyQuarterData ? 'Select Quarter to View/Edit' : 'Select Quarter'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedYear === 2026
                  ? 'Q1 2026 (JFM) is open for data entry. Future quarters unlock as the year progresses.'
                  : 'Showing historical 2025 data — view only. Click the right arrow to return to 2026.'}
              </p>
            </div>
            <Badge variant={selectedYear === 2026 ? 'default' : 'secondary'} className="text-xs">
              {selectedYear}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {quarterlyStatus.isLoading ? (
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Left arrow */}
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-10 w-10"
                disabled={selectedYear === 2025}
                onClick={() => { setSelectedYear(2025); setSelectedQuarter('Q4'); }}
                title="View 2025 quarters"
                aria-label="Previous year"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-4 gap-3 flex-1 min-w-0">
                {QUARTERS_INFO.map(q => {
                  const quarterStatus = quarterlyStatus[q.key as keyof typeof quarterlyStatus] as { hasData: boolean; entryCount: number };
                  const hasData       = quarterStatus?.hasData || false;
                  const quarterProgress = quarters[q.key];
                  const progressPct   = quarterProgress?.percentage || 0;
                  const isEditable    = isPeriodEditable(q.key, selectedYear);
                  const isFuture2026  = selectedYear === 2026 && !isEditable;
                  const isDisabled    = isFuture2026;
                  const isSelected    = selectedQuarter === q.key;

                  return (
                    <div
                      key={q.key}
                      className={`relative rounded-lg border-2 transition-all ${
                        isDisabled
                          ? 'border-dashed border-border bg-muted/30 cursor-not-allowed opacity-60'
                          : isSelected
                            ? 'border-primary bg-primary/5 cursor-pointer'
                            : 'border-border hover:border-primary/50 cursor-pointer'
                      }`}
                      onClick={() => { if (!isDisabled) setSelectedQuarter(q.key); }}
                      aria-disabled={isDisabled}
                      title={isDisabled ? `${q.label} ${selectedYear} is not yet open` : undefined}
                    >
                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-lg font-bold">{q.label}</span>
                          <Badge variant="outline" className="text-[10px] h-4">{q.months}</Badge>
                          {isFuture2026 && <Lock className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{q.description} {selectedYear}</p>

                        {!isFuture2026 ? (
                          <div className="mt-2">
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{progressPct}%</span>
                            </div>
                            {quarterProgress && (
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {quarterProgress.filled}/{quarterProgress.total} KPIs
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted-foreground mt-2 italic">Not yet open</p>
                        )}

                        {isSelected && !isDisabled && (
                          <div className="mt-3 flex gap-2 justify-center">
                            {isEditable ? (
                              hasData ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs px-2"
                                    onClick={e => { e.stopPropagation(); handleQuarterAction(q.key, 'view'); }}
                                  >
                                    <Eye className="w-3 h-3 mr-1" /> View
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs px-2"
                                    onClick={e => { e.stopPropagation(); handleQuarterAction(q.key, 'edit'); }}
                                  >
                                    <Edit className="w-3 h-3 mr-1" /> Edit
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs px-3"
                                  onClick={e => { e.stopPropagation(); handleQuarterAction(q.key, 'add'); }}
                                >
                                  <Plus className="w-3 h-3 mr-1" /> Add details
                                </Button>
                              )
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2"
                                onClick={e => { e.stopPropagation(); handleQuarterAction(q.key, 'view'); }}
                              >
                                <Eye className="w-3 h-3 mr-1" /> View
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right arrow */}
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-10 w-10"
                disabled={selectedYear === 2026}
                onClick={() => { setSelectedYear(2026); setSelectedQuarter('Q1'); }}
                title="View 2026 quarters"
                aria-label="Next year"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Overall KPI Progress ──────────────────────────────── */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-5 flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="w-20 h-20 rounded-full" />
          ) : (
            <CompletionRing percentage={overallPercentage} size="lg" />
          )}
          <div className="flex-1 text-left">
            <h3 className="text-lg font-semibold mb-0.5">Overall KPI Progress</h3>
            <p className="text-sm text-muted-foreground">
              {totalFilled} of {totalAssigned} KPIs completed across all periods
            </p>
            {overallPercentage < 100 && (
              <p className="text-xs text-status-warning mt-1">
                {totalAssigned - totalFilled} KPIs remaining
              </p>
            )}
            {overallPercentage === 100 && (
              <p className="text-xs text-status-success mt-1">✓ All KPIs completed</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weightage Note */}
      <CardContent className="pt-4 pb-4 space-y-3">
        {/* ✅ Added text-left */}
        <p className="text-xs text-muted-foreground italic text-left">
          <strong>Note:</strong> Each KPI score has a different weightage, determined internally by Fireside, and is not equally distributed.
        </p>
        <div className="border-t border-border pt-2">
          {/* ✅ Added text-left */}
          <p className="text-xs font-semibold text-muted-foreground mb-1 text-left">Glossary</p>
          {/* ✅ Changed list-inside to list-outside, added pl-4 and text-left */}
          <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-outside pl-4 text-left">
            <li><strong>EPR</strong> — Extended Producer Responsibility: A regulatory framework where producers are responsible for the end-of-life management of their products and packaging.</li>
            <li><strong>VPN</strong> — Voluntary Plastic Neutrality: A voluntary commitment to offset plastic usage by recovering and recycling an equivalent amount of plastic waste.</li>
            <li><strong>P&S Recycled/Pkg</strong> — Primary & Secondary Recycled Packaging: The percentage of primary and secondary packaging materials (plastic, paper, glass, metal, plant-based) that are sourced from recycled content.</li>
            <li><strong>ESG</strong> — Environmental, Social & Governance: A framework for evaluating a company's performance across sustainability and ethical dimensions.</li>
            <li><strong>CEI</strong> — Circular Economy Index: A composite score measuring a company's progress toward circular material flows, used as the Environment score.</li>
            <li><strong>GHG</strong> — Greenhouse Gas: Gases that trap heat in the atmosphere, commonly tracked under Scope 1, 2, and 3 emissions.</li>
            <li><strong>DEI</strong> — Diversity, Equity & Inclusion: Policies and metrics related to workforce diversity and equitable practices.</li>
            <li><strong>SRI</strong> — Socially Responsible Investment: Investment strategies that consider social and environmental impact alongside financial returns.</li>
          </ul>
        </div>
      </CardContent>

      {/* ── Environment NA Dialog ────────────────────────────── */}
      <Dialog open={envNADialogOpen} onOpenChange={setEnvNADialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-amber-600" />
              Environment Score — Not Applicable
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Environment KPIs were not activated for your company. If you believe this is an error, please contact the Fireside team.
          </p>
        </DialogContent>
      </Dialog>

      {/* ── ESG Score Detail Dialog ──────────────────────────── */}
      <ESGScoreDetailDialog
        open={scoreDetailOpen}
        onOpenChange={setScoreDetailOpen}
        scoreType={scoreDetailType}
        companyId={companyId}
        year={publishedYear}
        dashboardViewMode={'category'}
      />
    </UnifiedSidebarLayout>
  );
};

// export default CompanyDashboard;

export default CompanyDashboard;
