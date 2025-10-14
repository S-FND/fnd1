import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePortfolioAuth } from './usePortfolioAuth';
import {
  ESGMetricVersion,
  GHGAccountingVersion,
  ESGCAPVersion,
  ESGDDVersion,
  BRSRReportVersion,
  MakerCheckerModule
} from '@/types/maker-checker';

type VersionType = 
  | ESGMetricVersion 
  | GHGAccountingVersion 
  | ESGCAPVersion 
  | ESGDDVersion 
  | BRSRReportVersion;

interface UseVersionControlOptions {
  module: MakerCheckerModule;
  recordId: string;
}

const TABLE_MAP: Record<MakerCheckerModule, string> = {
  esg_metrics: 'esg_metrics_versions',
  ghg_accounting: 'ghg_accounting_versions',
  esg_cap: 'esg_cap_versions',
  esg_dd: 'esg_dd_versions',
  brsr_report: 'brsr_report_versions'
};

const RECORD_ID_FIELD_MAP: Record<MakerCheckerModule, string> = {
  esg_metrics: 'metric_id',
  ghg_accounting: 'record_id',
  esg_cap: 'cap_id',
  esg_dd: 'dd_record_id',
  brsr_report: 'report_section_id'
};

export const useVersionControl = ({ module, recordId }: UseVersionControlOptions) => {
  const { profile } = usePortfolioAuth();
  const [versions, setVersions] = useState<VersionType[]>([]);
  const [currentVersion, setCurrentVersion] = useState<VersionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tableName = TABLE_MAP[module];
  const recordIdField = RECORD_ID_FIELD_MAP[module];
  const companyId = profile?.portfolio_company_id;

  // Fetch all versions for the record
  const fetchVersions = async () => {
    if (!companyId || !recordId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from(tableName as any)
        .select('*')
        .eq(recordIdField, recordId)
        .eq('portfolio_company_id', companyId)
        .order('version_number', { ascending: false });

      if (fetchError) throw fetchError;

      setVersions((data as any) || []);
      setCurrentVersion((data as any)?.find((v: any) => v.is_current) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch versions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [companyId, recordId, module]);

  // Get version by version number
  const getVersionByNumber = (versionNumber: number): VersionType | undefined => {
    return versions.find(v => v.version_number === versionNumber);
  };

  // Compare two versions
  const compareVersions = (v1Number: number, v2Number: number) => {
    const v1 = getVersionByNumber(v1Number);
    const v2 = getVersionByNumber(v2Number);

    if (!v1 || !v2) return null;

    const v1Keys = Object.keys(v1);
    const differences: Record<string, { old: any; new: any }> = {};

    v1Keys.forEach(key => {
      if (key === 'id' || key === 'version_number' || key === 'created_at' || key === 'updated_at') {
        return; // Skip metadata fields
      }

      if (JSON.stringify(v1[key as keyof typeof v1]) !== JSON.stringify(v2[key as keyof typeof v2])) {
        differences[key] = {
          old: v1[key as keyof typeof v1],
          new: v2[key as keyof typeof v2]
        };
      }
    });

    return differences;
  };

  // Get version history with change summaries
  const getVersionHistory = () => {
    return versions.map((version, index) => {
      const previousVersion = versions[index + 1];
      let changes: Record<string, { old: any; new: any }> | null = null;

      if (previousVersion) {
        changes = compareVersions(version.version_number, previousVersion.version_number);
      }

      return {
        version,
        changes,
        isFirst: index === versions.length - 1,
        isCurrent: version.is_current
      };
    });
  };

  // Restore a specific version (creates new version as current)
  const restoreVersion = async (versionNumber: number) => {
    const versionToRestore = getVersionByNumber(versionNumber);
    if (!versionToRestore) {
      throw new Error('Version not found');
    }

    // This would create a new approval request for restoring the version
    // Implementation depends on module-specific requirements
    throw new Error('Restore version requires approval workflow - use createApprovalRequest');
  };

  return {
    versions,
    currentVersion,
    loading,
    error,
    getVersionByNumber,
    compareVersions,
    getVersionHistory,
    restoreVersion,
    refetch: fetchVersions
  };
};
