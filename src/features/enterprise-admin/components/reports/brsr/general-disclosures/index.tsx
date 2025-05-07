
import React from 'react';
import CompanyDetails from './CompanyDetails';
import ProductsServices from './ProductsServices';
import Operations from './Operations';
import Employees from './Employees';
import CSRDetails from './CSRDetails';
import TransparencyDisclosures from './TransparencyDisclosures';

const GeneralDisclosures: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section A: General Disclosures</h2>
      
      <div className="space-y-6">
        <CompanyDetails />
        <ProductsServices />
        <Operations />
        <Employees />
        <CSRDetails />
        <TransparencyDisclosures />
      </div>
    </section>
  );
};

export default GeneralDisclosures;
