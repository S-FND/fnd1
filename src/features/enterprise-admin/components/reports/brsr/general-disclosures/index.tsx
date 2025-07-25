
import React from 'react';
import CompanyDetails from './CompanyDetails';
import ProductsServices from './ProductsServices';
import Operations from './Operations';
import Employees from './Employees';
import CSRDetails from './CSRDetails';
import TransparencyDisclosures from './TransparencyDisclosures';
import { useCompanyData } from './hooks/useCompanyData';

const GeneralDisclosures: React.FC = () => {
  const { companyData, loading, error } = useCompanyData();
  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading data</div>;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section A: General Disclosures</h2>
      
      <div className="space-y-6">
        <CompanyDetails data={companyData?.details} />
        <ProductsServices data={companyData?.productsServices} />
        <Operations data={companyData?.operations} />
        <Employees data={companyData?.employees} />
        <CSRDetails data={companyData?.csrDetails} />
        <TransparencyDisclosures data={companyData?.transparencyDisclosures} />
      </div>
    </section>
  );
};

export default GeneralDisclosures;
