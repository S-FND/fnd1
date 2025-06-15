
import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';

const governanceItems = [
  "Corporate Governance Code (if any)",
  "Code of Conduct for the Board",
  "Strategic risk management policy",
  "Anti-bribery and corruption policy, training details record and frequency",
  "Whistleblower policy",
  "A policy of gifts, entertainment and other potential sources of conflict of interest",
  "Small bribes policy",
  "Risk Assessment on governance aspects of business operations (Procedure for risk assessment and risk assessment results) (if any)",
  "Documented SOP for risk management, highlighting identified risks and mitigation strategies.",
  "Accounting framework for financial statements",
  "Accounting /auditing systems / tools/ SOPs established",
  "Articles of Association",
  "Memorandum of Association",
  "Shareholders Agreement",
  "Shareholding pattern and the date of the shareholding pattern",
  "Details on tag-along and drag-along rights, if these are mentioned in shareholder agreements.",
  "Information on the mechanisms in place for dispute resolution, documented in the Shareholder Agreement",
  "Annual calendar of corporate events (Board meetings, Shareholders' meetings)",
  "BOD meetings ( Dates of last 2 years)",
  "Minutes of Board meetings ( last 3 board meetings)",
  "Confirmation of who is responsible for preparing the minutes of board meetings.",
  "Agenda shared of board meetings and how was this shared (Email screenshot)",
  "Offer Letter/ Employment Agreement for Board Members",
  "Terms of reference for key mangement positions",
  "Induction/Training deck for BOD",
  "Evidence for unanimous agreement of board meetings from the directors",
  "Evidence of strategic discussion, long-term strategies and material risks happening in the board meetings and frequency",
  "BoD minutes where the company's risk management and compliance policies and procedures were discussed.",
  "Does the Company discuss disclosure of related parties in meetings? If yes, attach the MoM",
  "Documented Strategic plans/ budgets",
  "Details of Annual General Meetings (AGM), including their frequency, agenda preparation, and minutes of meetings, snapshot of the email sharing the material with the shareholder",
  "Minutes of any Emergency General Body Meetings (EGM) (if any)",
  "Board of Director's approved and AGM approved finalized accounts statement",
  "Agenda, MoM and proof of circulation (email) of AGM/ EGM/ Shareholder meeting",
  "How many board meeting were conducted in FY2024-25?",
  "Evidence of financial statements shared with the shareholders",
  "Email trail of documents or any information shared with shareholders",
  "Email trail of share capital details or shareholding pattern shared with shareholders along with the frequency at which it is shared.",
  "Brief description/ instance of the effectiveness of related party disclosures or conflict of interest.",
  "Latest monthly MIS and MIS templates shared with investors.",
  "Audit report to Board/Shareholders / Statutory audit report",
  "Annual Management letter by external auditors with observations and suggestions regarding areas for improvements in the company's accounting and controls",
  "Documented Audit firm selection criteria or Board minutes of meeting where the auditor was selected.",
  "Semi annual / annual financial statements",
  "Evidence for the most recent promoter holding percentage",
  "Evidence of financial statements shared with the shareholders",
  "Gift register",
  "Procedures to identify small bribes",
  "Communication of ABAC policy",
  "Screening procedures on third party of them being associated with illegal or corrupt payments",
  "Internal accounting controls to mitigate small bribes risk",
  "Anti-money laundering - controls established. Please provide details",
  "Latest annual report.",
  "Details of the company secretary, including their name.",
  "Documented SOP for core functions such as sales, HR, accounts, and legal, if available.",
  "Confirmation on recent income tax filings and any notices, if any.",
  "Profile of the investor observer, including the roles, responsibilities, and experience",
  "Are the internal controls and auditing system periodically reviewed by the independent external auditors?",
  "Details of the statutory auditor, including their name, appointment details, and tenure.",
  "Confirmation of whether any other firm is the internal or external auditor, along with their tenure.",
  "ESG Policy"
];

const IRLGovernance = () => {
  return (
    <IRLComplianceTable
      title="Governance"
      description="Upload required governance documents and policies"
      items={governanceItems}
    />
  );
};

export default IRLGovernance;
