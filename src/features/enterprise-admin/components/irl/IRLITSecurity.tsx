import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';
import { logger } from '@/hooks/logger';

const itSecurityItems = [
  {
    key: "data_security_certifications",
    name: "Data security and privacy certifications (if any)",
  },
  {
    key: "policy_data_privacy",
    name: "Policy and procedures on IT Security and data privacy of customers (if any)",
  },
  {
    key: "docs_its_security",
    name: "Document of IT security audit (if any)",
  },
  {
    key: "privacy_policy_link",
    name: "Privacy Policy (public link from the website)",
  },
  {
    key: "app_tnc",
    name: "Terms & Conditions of the app (if any)",
  },
  {
    key: "type_of_servers_used",
    name: "Type of servers used? (Physical/ cloud)",
  },
  {
    key: "cloud_servers_used",
    name: "Name of cloud servers used? (if any)",
  },
  {
    key: "scope_data_stored_servers",
    name: "Scope of data stored in servers",
  },
  {
    key: "customer_data_security_privacy",
    name: "How is data security and privacy of customers ensured?",
  }
];

const IRLITSecurity = ({ buttonEnabled }: { buttonEnabled: boolean }) => {
  logger.debug('Rendering IRLITSecurity component :: buttonEnabled =', buttonEnabled);
  return (
    <IRLComplianceTable
      title="IT Security & Data Privacy"
      description="Upload required documents and records on IT Security & Data Privacy Compliance"
      items={itSecurityItems}
      type="it-security"
    />
  );
};

export default IRLITSecurity;