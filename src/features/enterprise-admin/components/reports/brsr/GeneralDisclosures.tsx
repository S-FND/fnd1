
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const GeneralDisclosures: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Section A: General Disclosures</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">I. Company Details</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/3">Corporate Identity Number (CIN)</TableCell>
                <TableCell>L12345MH2000PLC123456</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Company Name</TableCell>
                <TableCell>Fandoro Enterprises Ltd.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Year of Incorporation</TableCell>
                <TableCell>2000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Registered Office Address</TableCell>
                <TableCell>123 Sustainability Street, Mumbai - 400001</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Corporate Address</TableCell>
                <TableCell>Tower A, Business Park, Bandra Kurla Complex, Mumbai - 400051</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell>sustainability@fandoro.com</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Telephone</TableCell>
                <TableCell>+91-22-12345678</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Website</TableCell>
                <TableCell>www.fandoroenterprises.com</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Financial Year Reported</TableCell>
                <TableCell>2023-24</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">II. Products/Services</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Activity Description</TableHead>
                <TableHead>NIC Code</TableHead>
                <TableHead>% of Turnover</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Sustainable Manufacturing</TableCell>
                <TableCell>29102</TableCell>
                <TableCell>65%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Environmental Consulting</TableCell>
                <TableCell>74909</TableCell>
                <TableCell>35%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">III. Operations</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Number of Plants</TableHead>
                <TableHead>Number of Offices</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>National (India)</TableCell>
                <TableCell>4</TableCell>
                <TableCell>12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>International</TableCell>
                <TableCell>2</TableCell>
                <TableCell>5</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">IV. Employees</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Permanent</TableHead>
                <TableHead>Temporary/Contractual</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Male</TableCell>
                <TableCell>1,250</TableCell>
                <TableCell>420</TableCell>
                <TableCell>1,670</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Female</TableCell>
                <TableCell>980</TableCell>
                <TableCell>300</TableCell>
                <TableCell>1,280</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Others</TableCell>
                <TableCell>25</TableCell>
                <TableCell>10</TableCell>
                <TableCell>35</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="font-medium">2,255</TableCell>
                <TableCell className="font-medium">730</TableCell>
                <TableCell className="font-medium">2,985</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default GeneralDisclosures;
