
import { UserRole, Permissions } from '@/types/auth';

export const defaultPermissions: Record<UserRole, Permissions> = {
  fandoro_admin: {
    dashboard: { read: true, write: true },
    esg: { read: true, write: true },
    ghg: { read: true, write: true },
    compliance: { read: true, write: true },
    lms: { read: true, write: true },
    units: { read: true, write: true },
    'ehs-trainings': { read: true, write: true },
    audit: { read: true, write: true },
    team: { read: true, write: true },
    settings: { read: true, write: true },
    'enterprise-management': { read: true, write: true },
    'esg-cap': { read: true, write: true },
    'non-compliances': { read: true, write: true },
    'esg-risks': { read: true, write: true }
  },
  admin: {
    dashboard: { read: true, write: true },
    esg: { read: true, write: true },
    ghg: { read: true, write: true },
    compliance: { read: true, write: true },
    lms: { read: true, write: true },
    units: { read: true, write: true },
    'ehs-trainings': { read: true, write: true },
    audit: { read: true, write: true },
    team: { read: true, write: true },
    settings: { read: true, write: true }
  },
  manager: {
    dashboard: { read: true, write: true },
    esg: { read: true, write: true },
    ghg: { read: true, write: true },
    compliance: { read: true, write: true },
    lms: { read: true, write: true },
    'ehs-trainings': { read: true, write: false },
    audit: { read: true, write: true },
    team: { read: true, write: true },
    settings: { read: true, write: false }
  },
  unit_admin: {
    dashboard: { read: true, write: false },
    esg: { read: true, write: false },
    ghg: { read: true, write: true },
    compliance: { read: true, write: false },
    lms: { read: true, write: false },
    'ehs-trainings': { read: true, write: false },
    team: { read: true, write: true },
    settings: { read: true, write: false }
  },
  employee: {
    dashboard: { read: true, write: false },
    'personal-ghg': { read: true, write: true },
    lms: { read: true, write: false },
    'ehs-trainings': { read: true, write: false },
    settings: { read: true, write: false }
  },
  supplier: {
    dashboard: { read: true, write: false },
    'supplier-audit': { read: true, write: true },
    settings: { read: true, write: false }
  },
  vendor: {
    dashboard: { read: true, write: false },
    trainings: { read: true, write: false },
    bids: { read: true, write: true },
    profile: { read: true, write: true },
    settings: { read: true, write: false }
  }
};
