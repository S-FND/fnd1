import React, { useState, useEffect } from 'react';
import { Info } from "lucide-react";

// Types
export type ViewMode = 'yearly' | 'quarterly' | 'monthly';

export type Quarter = 
  | 'Q1 (Apr-Jun)'
  | 'Q2 (Jul-Sep)'
  | 'Q3 (Oct-Dec)'
  | 'Q4 (Jan-Mar)';

interface DataCollection {
  _id: string;
  reportingMonth: string;
  reportingYear: string;
  totalEmission: number;
  activityDataValue: number;
  collectedDate: string;
}

interface GHGSourceData {
  _id: string;
  facilityName: string;
  sourceDescription: string;
  sourceType: string;
  activityDataUnit: string;
  measurementFrequency: string;
  dataCollections: DataCollection[];
  totalEmission: number;
  scope: string;
}

interface GHGSummaryResponse {
  allData: GHGSourceData[];
  emmissonData: {
    totalEmission: number;
    avoidedEmission: number;
    emissionByScope: {
      "Scope 1": number;
      "Scope 2": number;
      "Scope 3": number;
      "Scope 4": number;
    };
  };
}

interface DataSourceInfoProps {
  viewMode: ViewMode;
  selectedMonth?: string;
  selectedQuarter?: Quarter;
  selectedYear: string;
  rawSummaryData: GHGSummaryResponse | null;
}

// Helper function to get months in a quarter
const getMonthsInQuarter = (quarter: Quarter): string[] => {
  const quarterMap: Record<Quarter, string[]> = {
    'Q1 (Apr-Jun)': ['Apr', 'May', 'Jun'],
    'Q2 (Jul-Sep)': ['Jul', 'Aug', 'Sep'],
    'Q3 (Oct-Dec)': ['Oct', 'Nov', 'Dec'],
    'Q4 (Jan-Mar)': ['Jan', 'Feb', 'Mar']
  };
  return quarterMap[quarter] || [];
};

const DataSourceInfo: React.FC<DataSourceInfoProps> = ({ 
  viewMode, 
  selectedMonth, 
  selectedQuarter, 
  selectedYear,
  rawSummaryData 
}) => {
  const [estimatedMonths, setEstimatedMonths] = useState<string[]>([]);
  const [estimatedQuarters, setEstimatedQuarters] = useState<Quarter[]>([]);

  useEffect(() => {
    if (!rawSummaryData) {
      setEstimatedMonths([]);
      setEstimatedQuarters([]);
      return;
    }

    if (viewMode === 'monthly' && selectedMonth) {
      const estimated: string[] = [];
      
      rawSummaryData.allData
        .filter(item => item.scope === 'Scope 1')
        .forEach(item => {
          const hasMonthlyData = item.dataCollections?.some(
            col => col.reportingMonth === selectedMonth && col.reportingYear === selectedYear
          );
          
          if (!hasMonthlyData) {
            // Check which quarter this month belongs to
            let monthQuarter: Quarter | null = null;
            if (['Apr', 'May', 'Jun'].includes(selectedMonth)) {
              monthQuarter = 'Q1 (Apr-Jun)';
            } else if (['Jul', 'Aug', 'Sep'].includes(selectedMonth)) {
              monthQuarter = 'Q2 (Jul-Sep)';
            } else if (['Oct', 'Nov', 'Dec'].includes(selectedMonth)) {
              monthQuarter = 'Q3 (Oct-Dec)';
            } else if (['Jan', 'Feb', 'Mar'].includes(selectedMonth)) {
              monthQuarter = 'Q4 (Jan-Mar)';
            }
            
            if (monthQuarter) {
              // Check if there's any data in this quarter
              const hasQuarterData = item.dataCollections?.some(
                col => getMonthsInQuarter(monthQuarter!).includes(col.reportingMonth) && 
                       col.reportingYear === selectedYear
              );
              
              if (hasQuarterData && !estimated.includes(selectedMonth)) {
                estimated.push(selectedMonth);
              }
            }
          }
        });
      
      setEstimatedMonths(estimated);
      setEstimatedQuarters([]);
      
    } else if (viewMode === 'quarterly' && selectedQuarter) {
      const estimated: Quarter[] = [];
      const monthsInQuarter = getMonthsInQuarter(selectedQuarter);
      
      // Check if all months in the quarter have data
      const hasAllMonthlyData = monthsInQuarter.every(month => {
        return rawSummaryData.allData
          .filter(item => item.scope === 'Scope 1')
          .some(item => 
            item.dataCollections?.some(
              col => col.reportingMonth === month && col.reportingYear === selectedYear
            )
          );
      });
      
      if (!hasAllMonthlyData) {
        // Check if any data exists in this quarter
        const hasAnyDataInQuarter = rawSummaryData.allData
          .filter(item => item.scope === 'Scope 1')
          .some(item => 
            item.dataCollections?.some(col => 
              monthsInQuarter.includes(col.reportingMonth) && 
              col.reportingYear === selectedYear
            )
          );
        
        if (hasAnyDataInQuarter && !estimated.includes(selectedQuarter)) {
          estimated.push(selectedQuarter);
        }
      }
      
      setEstimatedQuarters(estimated);
      setEstimatedMonths([]);
    } else {
      setEstimatedMonths([]);
      setEstimatedQuarters([]);
    }
  }, [viewMode, selectedMonth, selectedQuarter, selectedYear, rawSummaryData]);

  // Get quarter name from month
  const getQuarterFromMonth = (month: string): Quarter | null => {
    if (['Apr', 'May', 'Jun'].includes(month)) {
      return 'Q1 (Apr-Jun)';
    } else if (['Jul', 'Aug', 'Sep'].includes(month)) {
      return 'Q2 (Jul-Sep)';
    } else if (['Oct', 'Nov', 'Dec'].includes(month)) {
      return 'Q3 (Oct-Dec)';
    } else if (['Jan', 'Feb', 'Mar'].includes(month)) {
      return 'Q4 (Jan-Mar)';
    }
    return null;
  };

  if (!rawSummaryData) {
    return null;
  }

  if (viewMode === 'monthly' && estimatedMonths.length > 0) {
    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800 mb-1">
              Estimated Data
            </p>
            <p className="text-xs text-blue-700">
              Data for {estimatedMonths.join(', ')} {estimatedMonths.length === 1 ? 'is' : 'are'} 
              calculated by dividing quarterly totals equally among months in {
                getQuarterFromMonth(estimatedMonths[0]) || 'the quarter'
              }.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'quarterly' && estimatedQuarters.length > 0) {
    return (
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 mb-1">
              Partial Data Available
            </p>
            <p className="text-xs text-amber-700">
              Data for {estimatedQuarters.join(', ')} {estimatedQuarters.length === 1 ? 'is' : 'are'} 
              calculated from available monthly data within the quarter. Some months may be missing data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Information about data sources when all data is actual
  if (viewMode === 'monthly' && selectedMonth) {
    const hasMonthlyData = rawSummaryData.allData
      .filter(item => item.scope === 'Scope 1')
      .some(item => 
        item.dataCollections?.some(
          col => col.reportingMonth === selectedMonth && col.reportingYear === selectedYear
        )
      );
    
    if (hasMonthlyData) {
      return (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Actual Monthly Data
              </p>
              <p className="text-xs text-green-700">
                Showing actual collected data for {selectedMonth} {selectedYear}.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  if (viewMode === 'quarterly' && selectedQuarter) {
    const monthsInQuarter = getMonthsInQuarter(selectedQuarter);
    const hasAllMonthlyData = monthsInQuarter.every(month => {
      return rawSummaryData.allData
        .filter(item => item.scope === 'Scope 1')
        .some(item => 
          item.dataCollections?.some(
            col => col.reportingMonth === month && col.reportingYear === selectedYear
          )
        );
    });
    
    if (hasAllMonthlyData) {
      return (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Complete Quarterly Data
              </p>
              <p className="text-xs text-green-700">
                Showing sum of actual monthly data for {selectedQuarter} {selectedYear}.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // No special information to display
  return null;
};

export default DataSourceInfo;