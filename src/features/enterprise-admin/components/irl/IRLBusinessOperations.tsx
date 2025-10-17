import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';

const IRLBusinessOperationsItems = [
  {
    key: "corporate_deck",
    name: "Corporate Deck",
  },
  {
    key: "product_deck",
    name: "Product related deck",
  }
];

const IRLITSecurity = ({ buttonEnabled }: { buttonEnabled: boolean }) => {
  return (
    <IRLComplianceTable
      title="Business Operations"
      description="Upload required business operation documents and provide status updates"
      items={IRLBusinessOperationsItems}
      buttonEnabled={buttonEnabled}
    />
  );
};

export default IRLITSecurity;