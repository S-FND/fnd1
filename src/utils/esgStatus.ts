// utils/esgStatus.ts
import { ESGCapItem, CAPStatus } from '@/features/enterprise-admin/types/esgDD';

const normalize = (s?: string) => (s ?? '').trim().toLowerCase();

export const getEffectiveStatus = (item: ESGCapItem): CAPStatus => {
  const companyStatus = normalize(item.companyStatus);
  const investorStatus = normalize(item.investorStatus);

  // 1. Check investor status first (investor overrides)
  if (investorStatus === 'closed') {
    return 'closed' as CAPStatus;
  }

  // 2. Check if investor has marked as re-submit
  if (investorStatus === 're-submit-requested') {
    return 're-submit-requested' as CAPStatus;
  }

  // 3. Check company status
  if (companyStatus === 'closed') {
    return 'closed' as CAPStatus;
  }

  if (companyStatus === 'partly-submitted') {
    return 'partly-submitted' as CAPStatus;
  }

  if (companyStatus === 'submitted-pending-review') {
    return 'submitted-pending-review' as CAPStatus;
  }

  if (companyStatus === 'due-in-this-month') {
    return 'due-in-this-month' as CAPStatus;
  }

  if (companyStatus === 'overdue') {
    return 'overdue' as CAPStatus;
  }

  // 4. If no target date, return empty
  if (!item.targetDate) {
    return '' as CAPStatus;
  }

  // 5. Derive from targetDate
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(item.targetDate);
  target.setHours(0, 0, 0, 0);

  const isCurrentMonth = target.getFullYear() === today.getFullYear() &&
                         target.getMonth() === today.getMonth();
  
  if (isCurrentMonth) {
    return 'due-in-this-month' as CAPStatus;
  }

  if (target < today) {
    return 'overdue' as CAPStatus;
  }

  return 'upcoming' as CAPStatus;
};