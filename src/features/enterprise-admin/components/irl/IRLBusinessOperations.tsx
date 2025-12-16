import React from 'react';
import IRLComplianceTable from './IRLComplianceTable';
import { useDocumentVerification } from '@/hooks/useDocumentVerification';

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
  console.log('🏠 [IRLITSecurity] Component rendering');

  const { 
    VerificationModal, 
    handleVerifyClick 
  } = useDocumentVerification(
    () => {
      console.log('Document verified - refresh if needed');
      // You could add a refresh function here
    }
  );

    // Test function
    const testVerification = () => {
      console.log('🧪 Testing verification hook');
      handleVerifyClick({
        file: {
          file_path: 'https://example.com/test.pdf',
          name: 'Test Document',
          expiryDate: '31/12/2025'
        },
        questionId: 'test-id',
        key: 'test-key',
        question: 'Test Question'
      });
    };
  
  return (
    <>
    <button 
        onClick={testVerification}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Test Verification Hook
      </button>
      <IRLComplianceTable
        title="Business Operations"
        description="Upload required business operation documents and provide status updates"
        items={IRLBusinessOperationsItems}
        buttonEnabled={buttonEnabled}
        onVerifyClick={handleVerifyClick}
      />
      {VerificationModal}
    </>
  );
};

export default IRLITSecurity;