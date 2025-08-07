
// import React from 'react';
// import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
// import { Card, CardContent } from '@/components/ui/card';

// const CompanyDetails: React.FC = () => {
//   return (
//     <Card>
//       <CardContent className="pt-6">
//         <h3 className="text-lg font-semibold">I. Company Details</h3>
//         <Table>
//           <TableBody>
//             <TableRow>
//               <TableCell className="font-medium w-1/3">Corporate Identity Number (CIN)</TableCell>
//               <TableCell>L63030MH1995PLC089758</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Company Name</TableCell>
//               <TableCell>Translog India Ltd.</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Year of Incorporation</TableCell>
//               <TableCell>1995</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Registered Office Address</TableCell>
//               <TableCell>Translog House, Plot No. 84, Sector 44, Gurugram - 122003, Haryana, India</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Corporate Address</TableCell>
//               <TableCell>Translog Towers, 14th Floor, Bandra Kurla Complex, Mumbai - 400051, Maharashtra, India</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Email</TableCell>
//               <TableCell>investor.relations@translogindia.com</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Telephone</TableCell>
//               <TableCell>+91-22-66780800</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Website</TableCell>
//               <TableCell>www.translogindia.com</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Financial Year Reported</TableCell>
//               <TableCell>2023-24</TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell className="font-medium">Listed On</TableCell>
//               <TableCell>National Stock Exchange of India (NSE) and Bombay Stock Exchange (BSE)</TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default CompanyDetails;

import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyDetailsData } from './types/company';

interface CompanyDetailsProps {
  data?: CompanyDetailsData; // Make optional to maintain backward compatibility
}

const DEFAULT_DATA: CompanyDetailsData = {
  cin: 'L63030MH1995PLC089758',
  companyName: 'Translog India Ltd.',
  incorporationYear: '1995',
  registeredOffice: 'Translog House, Plot No. 84, Sector 44, Gurugram - 122003, Haryana, India',
  corporateAddress: 'Translog Towers, 14th Floor, Bandra Kurla Complex, Mumbai - 400051, Maharashtra, India',
  email: 'investor.relations@translogindia.com',
  telephone: '+91-22-66780800',
  website: 'www.translogindia.com',
  financialYear: '2023-24',
  listedOn: 'National Stock Exchange of India (NSE) and Bombay Stock Exchange (BSE'
};

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold">I. Company Details</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium w-1/3">Corporate Identity Number (CIN)</TableCell>
              <TableCell>{data.cin}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Company Name</TableCell>
              <TableCell>{data.companyName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Year of Incorporation</TableCell>
              <TableCell>{data.incorporationYear}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Registered Office Address</TableCell>
              <TableCell>{data.registeredOffice}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Corporate Address</TableCell>
              <TableCell>{data.corporateAddress}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Email</TableCell>
              <TableCell>{data.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Telephone</TableCell>
              <TableCell>{data.telephone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Website</TableCell>
              <TableCell>{data.website}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Financial Year Reported</TableCell>
              <TableCell>{data.financialYear}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Listed On</TableCell>
              <TableCell>{data.listedOn}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompanyDetails;
