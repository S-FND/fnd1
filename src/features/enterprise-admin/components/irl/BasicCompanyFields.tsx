
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CompanyFormData } from './types';

interface BasicCompanyFieldsProps {
  formData: CompanyFormData;
  setFormData: (data: CompanyFormData) => void;
}

const BasicCompanyFields: React.FC<BasicCompanyFieldsProps> = ({ formData, setFormData }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="legalEntityName">1. Name of legal entity</Label>
          <Input
            id="legalEntityName"
            value={formData.legalEntityName}
            onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emailId">2. Email ID</Label>
          <Input
            id="emailId"
            type="email"
            value={formData.emailId}
            onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="incorporationDate">3. Month & Year of Incorporation</Label>
          <Input
            id="incorporationDate"
            type="month"
            value={formData.incorporationDate}
            onChange={(e) => setFormData({ ...formData, incorporationDate: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyName">4. Name of company/brand</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactNumber">5. Contact Number</Label>
          <Input
            id="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paidUpCapital">6. Paid Up Capital (Rs)</Label>
          <Input
            id="paidUpCapital"
            value={formData.paidUpCapital}
            onChange={(e) => setFormData({ ...formData, paidUpCapital: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentTurnover">7. Turnover - Current Year (Rs)</Label>
          <Input
            id="currentTurnover"
            value={formData.currentTurnover}
            onChange={(e) => setFormData({ ...formData, currentTurnover: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="previousTurnover">7. Turnover - Previous Year (Rs)</Label>
          <Input
            id="previousTurnover"
            value={formData.previousTurnover}
            onChange={(e) => setFormData({ ...formData, previousTurnover: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentCompany">8. Name of parent company/subsidiaries (if any)</Label>
        <Textarea
          id="parentCompany"
          value={formData.parentCompany}
          onChange={(e) => setFormData({ ...formData, parentCompany: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productsServices">9. List of products/services</Label>
        <Textarea
          id="productsServices"
          value={formData.productsServices}
          onChange={(e) => setFormData({ ...formData, productsServices: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="foundingTeam">10. About the founding team (Name, educational details, previous work experience)</Label>
        <Textarea
          id="foundingTeam"
          value={formData.foundingTeam}
          onChange={(e) => setFormData({ ...formData, foundingTeam: e.target.value })}
        />
      </div>
    </>
  );
};

export default BasicCompanyFields;
