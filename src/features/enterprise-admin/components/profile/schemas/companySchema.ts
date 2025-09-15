
import * as z from 'zod';

export const companySchema = z.object({
  entityId: z.string().optional().nullable(),
  user_id: z.string().optional(),
  name: z.string().min(1, 'Company name is required'),
  legalName: z.string().min(1, 'Legal name is required'),
  cin: z.string().min(1, 'CIN is required'),
  founded: z.string().min(1, 'Founded year is required'),
  incorporationDate: z.string().min(1, 'Incorporation date is required'),
  registeredOffice: z.string().min(1, 'Registered office address is required'),
  corporateOffice: z.string().min(1, 'Corporate office address is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().url('Invalid website URL'),
  financialYear: z.string().min(1, 'Financial year is required'),
  listedOn: z.string().min(1, 'Listed exchanges are required'),
  revenue: z.string().min(1, 'Revenue is required'),
  fundingStage: z.string().min(1, 'Funding stage is required'),
  employeeStrength: z.string().min(1, 'Employee strength is required'),
  industry: z.string().min(1, 'Industry is required'),
});

export type CompanyFormData = z.infer<typeof companySchema>;
