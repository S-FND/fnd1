import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Target, Users, Briefcase, Factory, Leaf, 
  MapPin, GraduationCap, ShieldCheck, Heart, 
  Star, TrendingUp 
} from 'lucide-react';
import { CellNumberBadge } from './CellNumberBadge';

interface SRITableProps {
  formData: Record<string, string | number | boolean>;
  onInputChange: (kpiId: string, value: string | number | boolean) => void;
  currentFY?: number;
}

// Impact metric categories
const IMPACT_CATEGORIES = [
  { key: 'beneficiaries', label: 'Beneficiaries', icon: Users },
  { key: 'jobs', label: 'Jobs Created', icon: Briefcase },
  { key: 'enterprise', label: 'Enterprise & Emissions', icon: Factory },
  { key: 'development', label: 'Development Indicators', icon: MapPin },
  { key: 'training', label: 'Training & Safety', icon: GraduationCap },
  { key: 'social', label: 'Social Security', icon: ShieldCheck },
  { key: 'testimonials', label: 'Testimonials & Other', icon: Star },
  { key: 'progress', label: 'Progress & Milestones', icon: TrendingUp },
];

// Define metrics for each category
const METRICS_CONFIG: Record<string, Array<{ id: string; label: string; definition: string; type?: 'text' | 'number' | 'textarea' | 'yesno' }>> = {
  beneficiaries: [
    { id: 'total_beneficiaries', label: 'Total Beneficiaries/Customer Base', definition: 'No. of individuals supported with the core product/service', type: 'number' },
    { id: 'women_beneficiaries', label: 'Women/Girls Supported', definition: 'No. of women/girls supported with the core product/service', type: 'number' },
    { id: 'msme_status', label: 'MSME (Yes/No)', definition: 'As per registration certificate or criteria defined under MSME Act, 2006', type: 'yesno' },
    { id: 'sector', label: 'Sector', definition: 'An area of the economy in which businesses share the same or related business activity (provide description)', type: 'textarea' },
  ],
  jobs: [
    { id: 'total_jobs_created', label: 'Total Jobs Created', definition: 'Total no. of jobs created (comprising of persons on roles, construction/installation activities, vendors/service providers)', type: 'number' },
    { id: 'jobs_male', label: 'Jobs for Male', definition: 'No. of jobs created for male', type: 'number' },
    { id: 'jobs_female', label: 'Jobs for Female', definition: 'No. of jobs created for female', type: 'number' },
    { id: 'formal_jobs', label: 'Formal Jobs', definition: 'No. of formal jobs created', type: 'number' },
    { id: 'informal_jobs', label: 'Informal Jobs', definition: 'No. of informal jobs created', type: 'number' },
    { id: 'skilled_jobs', label: 'Skilled Jobs', definition: 'No. of skilled jobs created', type: 'number' },
    { id: 'unskilled_jobs', label: 'Unskilled Jobs', definition: 'No. of unskilled jobs created', type: 'number' },
    { id: 'construction_jobs', label: 'Construction Jobs', definition: 'No. of construction jobs created', type: 'number' },
    { id: 'short_term_jobs', label: 'Short-term Jobs', definition: 'No. of short-term jobs created', type: 'number' },
    { id: 'contractual_jobs', label: 'Contractual Jobs', definition: 'No. of contractual jobs created', type: 'number' },
  ],
  enterprise: [
    { id: 'women_led', label: 'Women-led Enterprise', definition: 'Organization led or co-led by a woman (Yes/No)', type: 'yesno' },
    { id: 'co2_scope1', label: 'CO2 Emissions - Scope 1', definition: 'Direct emissions from owned or controlled sources', type: 'number' },
    { id: 'co2_scope2', label: 'CO2 Emissions - Scope 2', definition: 'Indirect emissions from purchased electricity, steam, heating and cooling', type: 'number' },
    { id: 'emissions_initiatives', label: 'Emissions Reduction Initiatives', definition: 'Description of activities and initiatives that help reduce emissions, pollution, promote circularity', type: 'textarea' },
    { id: 'product_programs', label: 'Product/Programs Offered', definition: 'Description of core programs/product offered, and the environmental impact (if any)', type: 'textarea' },
  ],
  development: [
    { id: 'states_impacted', label: 'States Impacted', definition: 'No. of states impacted', type: 'number' },
    { id: 'cities_impacted', label: 'Cities Impacted', definition: 'No. of cities impacted', type: 'number' },
    { id: 'villages_impacted', label: 'Villages Impacted', definition: 'No. of villages impacted', type: 'number' },
    { id: 'northeast_cities', label: 'North-East India Cities', definition: 'No. of cities in North-East India impacted', type: 'number' },
    { id: 'aspirational_districts', label: 'Aspirational Districts Impacted', definition: 'No. of Aspirational Districts Impacted (as per NITI Aayog list)', type: 'number' },
    { id: 'sc_st_obc_impacted', label: 'SC/ST/OBCs/Minorities Impacted', definition: 'No. of SC/ST/OBCs/Minorities Impacted', type: 'number' },
    { id: 'farmers_impacted', label: 'Farmers Impacted', definition: 'Number of farmers impacted (if applicable)', type: 'number' },
    { id: 'women_farmers', label: 'Women Farmers Impacted', definition: 'Number of women farmers impacted (if applicable)', type: 'number' },
    { id: 'women_entrepreneurs', label: 'Women Entrepreneurs Impacted', definition: 'Number of women entrepreneurs impacted (if applicable)', type: 'number' },
    { id: 'health_camps', label: 'Health Camps & Beneficiaries', definition: 'No. of health camps organized; no. of people benefitted through such camps', type: 'text' },
    { id: 'students_trained', label: 'Students/Workers Trained', definition: 'No. of students/workers trained/skilled', type: 'number' },
    { id: 'rd_investment', label: 'R&D Investment', definition: 'Amounts invested in creation of indigenous Technology or R&D', type: 'number' },
    { id: 'other_output', label: 'Any Other Output', definition: 'Any other output, as may be specified', type: 'textarea' },
  ],
  training: [
    { id: 'vocational_training', label: 'Vocational/Technical Training', definition: 'No. of employees/beneficiaries receiving vocational or technical training', type: 'number' },
    { id: 'safety_sessions', label: 'Safety Training Sessions', definition: 'Number of safety training sessions conducted for employees and workers', type: 'number' },
    { id: 'ohs_coverage', label: 'OHS Coverage (%)', definition: 'Percentage of employees and workers covered under occupational health & safety programs', type: 'number' },
    { id: 'ppe_compliance', label: 'PPE Compliance Rate (%)', definition: 'Adoption of PPE (Personal Protective Equipment) compliance in operations', type: 'number' },
    { id: 'ergonomics_compliance', label: 'Safety & Ergonomics Standards (%)', definition: 'Percentage of facilities/locations meeting safety and ergonomics standards', type: 'number' },
    { id: 'health_checkups', label: 'Health Check-ups Coverage', definition: 'Number of employees receiving regular health check-ups and medical support', type: 'number' },
  ],
  social: [
    { id: 'grievances_resolved', label: 'Grievances Logged & Resolved', definition: 'Number of employee grievances and resolved', type: 'text' },
    { id: 'social_security_coverage', label: 'Social Security Coverage (%)', definition: 'Percentage of employees covered under social security schemes (PF, ESI, Pensions)', type: 'number' },
    { id: 'wage_increase', label: 'Wage Increase (%)', definition: 'Wage increase for employees and workers compared to previous year (% increase in INR)', type: 'number' },
    { id: 'upskilling_programs', label: 'Skills Development Programs', definition: 'Number of employees receiving skills development or upskilling programs', type: 'number' },
  ],
  testimonials: [
    { id: 'testimonials', label: 'Testimonials', definition: 'Share link, images, videos as applicable (customers/clients/partners)', type: 'textarea' },
    { id: 'other_impact', label: 'Other Impact Metrics', definition: 'Any other impact metrics to be captured (not mentioned here) - Provide details, data YoY', type: 'textarea' },
  ],
  progress: [
    { id: 'stores_locations', label: 'Stores/Branches/Locations', definition: 'Number of stores/branches/locations', type: 'number' },
    { id: 'distribution_network', label: 'Distribution Network', definition: "Company's distribution network description", type: 'textarea' },
    { id: 'product_lines', label: 'Product Lines/SKUs', definition: 'Number of product lines/SKUs', type: 'number' },
    { id: 'total_capacity', label: 'Total Capacity', definition: 'Total capacity details', type: 'text' },
    { id: 'total_occupancy', label: 'Total Occupancy', definition: 'Total occupancy details', type: 'text' },
    { id: 'customers_pedigree', label: 'Customers Quantity & Pedigree', definition: 'Customers quantity and pedigree information', type: 'textarea' },
    { id: 'business_model', label: 'Business Model', definition: 'Business model description', type: 'textarea' },
    { id: 'revenue_mix', label: 'Revenue Mix', definition: 'Revenue mix breakdown', type: 'textarea' },
    { id: 'monthly_revenue', label: 'Monthly Revenue Run-rate', definition: 'Monthly revenue run-rate', type: 'text' },
    { id: 'cost_savings', label: 'Cost Savings', definition: 'Cost savings achieved', type: 'text' },
    { id: 'profitability_ratios', label: 'Profitability Ratios', definition: 'Key profitability ratios', type: 'text' },
    { id: 'liquidity_ratios', label: 'Liquidity Ratios', definition: 'Key liquidity ratios', type: 'text' },
    { id: 'working_capital_ratios', label: 'Working Capital Ratios', definition: 'Working capital ratios', type: 'text' },
    { id: 'policies_sops', label: 'Policies/SOPs Implemented', definition: 'Policies/SOPs implemented during the period', type: 'textarea' },
  ],
};

export const SRITable = ({ formData, onInputChange, currentFY }: SRITableProps) => {
  const [activeCategory, setActiveCategory] = useState('beneficiaries');
  
  // Get current financial year if not provided
  const fyYear = currentFY || (() => {
    const now = new Date();
    const month = now.getMonth();
    return month >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  })();

  // Get year labels for Jan-Dec (calendar year)
  const previousFY = `Jan-Dec ${fyYear - 1}`;
  const currentFYLabel = `Jan-Dec ${fyYear}`;

  const renderInput = (metric: typeof METRICS_CONFIG['beneficiaries'][0], fyKey: string) => {
    const fieldId = `sri_${metric.id}_${fyKey}`;
    const value = formData[fieldId] || '';

    if (metric.type === 'textarea') {
      return (
        <Textarea
          id={fieldId}
          placeholder="Enter details..."
          value={value as string}
          onChange={(e) => onInputChange(fieldId, e.target.value)}
          className="min-h-[80px] text-sm"
        />
      );
    }

    if (metric.type === 'yesno') {
      return (
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={fieldId}
              checked={value === 'Yes'}
              onChange={() => onInputChange(fieldId, 'Yes')}
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={fieldId}
              checked={value === 'No'}
              onChange={() => onInputChange(fieldId, 'No')}
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm">No</span>
          </label>
        </div>
      );
    }

    return (
      <Input
        id={fieldId}
        type={metric.type === 'number' ? 'number' : 'text'}
        placeholder={metric.type === 'number' ? '0' : 'Enter value...'}
        value={value as string}
        onChange={(e) => onInputChange(fieldId, e.target.value)}
        className="text-sm"
      />
    );
  };

  const renderDetailsInput = (metric: typeof METRICS_CONFIG['beneficiaries'][0]) => {
    const fieldId = `sri_${metric.id}_details`;
    const value = formData[fieldId] || '';

    return (
      <Textarea
        id={fieldId}
        placeholder="Additional details..."
        value={value as string}
        onChange={(e) => onInputChange(fieldId, e.target.value)}
        className="min-h-[60px] text-sm"
      />
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Socially Responsible Investment (SRI)</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Impact metrics and sustainable investment indicators
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg mb-6">
            {IMPACT_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.key}
                  value={category.key}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {IMPACT_CATEGORIES.map((category) => {
            const metrics = METRICS_CONFIG[category.key] || [];
            const Icon = category.icon;
            const categoryNumber = IMPACT_CATEGORIES.findIndex(c => c.key === category.key) + 1;

            // Helper to get field letter (a, b, c, etc.)
            const getFieldLetter = (index: number) => String.fromCharCode(97 + index);

            return (
              <TabsContent key={category.key} value={category.key} className="mt-0">
                <div className="flex items-center gap-2 mb-4">
                  <CellNumberBadge kpiNumber={categoryNumber} />
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">{category.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {metrics.length} metrics
                  </Badge>
                </div>

                {/* Table Header */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="grid grid-cols-12 bg-muted/50 text-xs font-medium text-muted-foreground">
                    <div className="col-span-4 p-3 border-r border-border">Metric</div>
                    <div className="col-span-2 p-3 border-r border-border text-center">{previousFY}</div>
                    <div className="col-span-2 p-3 border-r border-border text-center">{currentFYLabel}</div>
                    <div className="col-span-4 p-3">Details</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-border">
                    {metrics.map((metric, metricIndex) => (
                      <div key={metric.id} className="grid grid-cols-12 hover:bg-muted/20 transition-colors">
                        <div className="col-span-4 p-3 border-r border-border">
                          <div className="flex items-start gap-2">
                            <CellNumberBadge kpiNumber={categoryNumber} fieldLetter={getFieldLetter(metricIndex)} />
                            <div>
                              <div className="font-medium text-sm">{metric.label}</div>
                              <div className="text-xs text-muted-foreground mt-1">{metric.definition}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 p-3 border-r border-border">
                          {renderInput(metric, 'prev')}
                        </div>
                        <div className="col-span-2 p-3 border-r border-border">
                          {renderInput(metric, 'curr')}
                        </div>
                        <div className="col-span-4 p-3">
                          {renderDetailsInput(metric)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Jobs computation note */}
                {category.key === 'jobs' && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                    <strong>Formula for Jobs Computation:</strong> Number of Jobs = (Headcount of personnel worked on a project × Number of weeks of employment during construction/concession period) / Number of weeks in a year
                  </div>
                )}

                {/* Aspirational Districts note */}
                {category.key === 'development' && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                    <strong>Reference:</strong> Aspirational Districts list - {' '}
                    <a 
                      href="https://www.niti.gov.in/sites/default/files/2023-07/List-of-112-Aspirational-Districts%20%281%29.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      NITI Aayog List (PDF)
                    </a>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
