
import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';
import { logger } from '@/hooks/logger';

const governanceItems = [
  {
    key: "corporate_governance_code",
    name: "Corporate Governance Code (if any)"
  },
  {
    key: "code_of_conduct_board",
    name: "Code of Conduct for the Board"
  },
  {
    key: "strategic_risk_management_policy",
    name: "Strategic risk management policy"
  },
  {
    key: "anti_bribery_corruption_policy",
    name: "Anti-bribery and corruption policy, training details record and frequency"
  },
  {
    key: "whistleblower_policy",
    name: "Whistleblower policy"
  },
  {
    key: "gifts_entertainment_policy",
    name: "A policy of gifts, entertainment and other potential sources of conflict of interest"
  },
  {
    key: "small_bribes_policy",
    name: "Small bribes policy"
  },
  {
    key: "risk_assessment_governance",
    name: "Risk Assessment on governance aspects of business operations (Procedure for risk assessment and risk assessment results) (if any)"
  },
  {
    key: "sop_risk_management",
    name: "Documented SOP for risk management, highlighting identified risks and mitigation strategies."
  },
  {
    key: "accounting_framework",
    name: "Accounting framework for financial statements"
  },
  {
    key: "accounting_systems",
    name: "Accounting /auditing systems / tools/ SOPs established"
  },
  {
    key: "articles_of_association",
    name: "Articles of Association"
  },
  {
    key: "memorandum_of_association",
    name: "Memorandum of Association"
  },
  {
    key: "shareholders_agreement",
    name: "Shareholders Agreement"
  },
  {
    key: "shareholding_pattern",
    name: "Shareholding pattern and the date of the shareholding pattern"
  },
  {
    key: "tag_drag_along_rights",
    name: "Details on tag-along and drag-along rights, if these are mentioned in shareholder agreements."
  },
  {
    key: "dispute_resolution_mechanisms",
    name: "Information on the mechanisms in place for dispute resolution, documented in the Shareholder Agreement"
  },
  {
    key: "corporate_events_calendar",
    name: "Annual calendar of corporate events (Board meetings, Shareholders' meetings)"
  },
  {
    key: "bod_meetings_dates",
    name: "BOD meetings (Dates of last 2 years)"
  },
  {
    key: "board_meeting_minutes",
    name: "Minutes of Board meetings (last 3 board meetings)"
  },
  {
    key: "minutes_preparation_responsibility",
    name: "Confirmation of who is responsible for preparing the minutes of board meetings."
  },
  {
    key: "board_meeting_agenda",
    name: "Agenda shared of board meetings and how was this shared (Email screenshot)"
  },
  {
    key: "board_member_agreements",
    name: "Offer Letter/ Employment Agreement for Board Members"
  },
  {
    key: "management_terms_of_reference",
    name: "Terms of reference for key management positions"
  },
  {
    key: "bod_training_materials",
    name: "Induction/Training deck for BOD"
  },
  {
    key: "unanimous_board_agreements",
    name: "Evidence for unanimous agreement of board meetings from the directors"
  },
  {
    key: "strategic_discussion_evidence",
    name: "Evidence of strategic discussion, long-term strategies and material risks happening in the board meetings and frequency"
  },
  {
    key: "risk_management_discussion",
    name: "BoD minutes where the company's risk management and compliance policies and procedures were discussed."
  },
  {
    key: "related_party_disclosure",
    name: "Does the Company discuss disclosure of related parties in meetings? If yes, attach the MoM"
  },
  {
    key: "strategic_plans",
    name: "Documented Strategic plans/ budgets"
  },
  {
    key: "agm_details",
    name: "Details of Annual General Meetings (AGM), including their frequency, agenda preparation, and minutes of meetings, snapshot of the email sharing the material with the shareholder"
  },
  {
    key: "egm_minutes",
    name: "Minutes of any Emergency General Body Meetings (EGM) (if any)"
  },
  {
    key: "approved_accounts",
    name: "Board of Director's approved and AGM approved finalized accounts statement"
  },
  {
    key: "agm_documentation",
    name: "Agenda, MoM and proof of circulation (email) of AGM/ EGM/ Shareholder meeting"
  },
  {
    key: "board_meetings_count",
    name: "How many board meeting were conducted in FY2024-25?"
  },
  {
    key: "financial_statements_shared",
    name: "Evidence of financial statements shared with the shareholders"
  },
  {
    key: "shareholder_communication",
    name: "Email trail of documents or any information shared with shareholders"
  },
  {
    key: "shareholding_communication",
    name: "Email trail of share capital details or shareholding pattern shared with shareholders along with the frequency at which it is shared."
  },
  {
    key: "related_party_disclosure_effectiveness",
    name: "Brief description/ instance of the effectiveness of related party disclosures or conflict of interest."
  },
  {
    key: "investor_mis",
    name: "Latest monthly MIS and MIS templates shared with investors."
  },
  {
    key: "audit_reports",
    name: "Audit report to Board/Shareholders / Statutory audit report"
  },
  {
    key: "auditor_management_letter",
    name: "Annual Management letter by external auditors with observations and suggestions regarding areas for improvements in the company's accounting and controls"
  },
  {
    key: "auditor_selection",
    name: "Documented Audit firm selection criteria or Board minutes of meeting where the auditor was selected."
  },
  {
    key: "financial_statements",
    name: "Semi annual / annual financial statements"
  },
  {
    key: "promoter_holding",
    name: "Evidence for the most recent promoter holding percentage"
  },
  {
    key: "gift_register",
    name: "Gift register"
  },
  {
    key: "small_bribes_procedures",
    name: "Procedures to identify small bribes"
  },
  {
    key: "abac_policy_communication",
    name: "Communication of ABAC policy"
  },
  {
    key: "third_party_screening",
    name: "Screening procedures on third party of them being associated with illegal or corrupt payments"
  },
  {
    key: "accounting_controls_bribes",
    name: "Internal accounting controls to mitigate small bribes risk"
  },
  {
    key: "aml_controls",
    name: "Anti-money laundering - controls established. Please provide details"
  },
  {
    key: "annual_report",
    name: "Latest annual report."
  },
  {
    key: "company_secretary_details",
    name: "Details of the company secretary, including their name."
  },
  {
    key: "core_function_sops",
    name: "Documented SOP for core functions such as sales, HR, accounts, and legal, if available."
  },
  {
    key: "tax_filings_status",
    name: "Confirmation on recent income tax filings and any notices, if any."
  },
  {
    key: "investor_observer_profile",
    name: "Profile of the investor observer, including the roles, responsibilities, and experience"
  },
  {
    key: "internal_controls_review",
    name: "Are the internal controls and auditing system periodically reviewed by the independent external auditors?"
  },
  {
    key: "statutory_auditor_details",
    name: "Details of the statutory auditor, including their name, appointment details, and tenure."
  },
  {
    key: "additional_auditor_info",
    name: "Confirmation of whether any other firm is the internal or external auditor, along with their tenure."
  },
  {
    key: "esg_policy",
    name: "ESG Policy"
  }
];

const IRLGovernance = ({ buttonEnabled }: { buttonEnabled: boolean }) => {
  logger.debug("Rendering IRLGovernance component :: buttonEnabled =", buttonEnabled);
  return (
    <IRLComplianceTable
      title="Governance"
      description="Upload required governance documents and policies"
      items={governanceItems}
    />
  );
};

export default IRLGovernance;
