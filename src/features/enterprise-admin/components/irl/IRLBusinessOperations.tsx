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

const IRLBOSecurity = ({ buttonEnabled }: { buttonEnabled: boolean }) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Business Operations</h1>
      
      <IRLComplianceTable
        title="Business Operations"
        description="Upload and verify your business operation documents"
        items={IRLBusinessOperationsItems}
        buttonEnabled={true}
      />
    </div>
  );
};

export default IRLBOSecurity;