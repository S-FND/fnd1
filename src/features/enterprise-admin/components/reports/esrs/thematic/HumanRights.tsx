
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const HumanRights: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ESRS S1: Human Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Human Rights Policy & Due Diligence</h3>
            <p>
              Translog India Ltd. is committed to respecting human rights as set out in the 
              UN Guiding Principles on Business and Human Rights. Our Human Rights Policy 
              applies to all operations and extends to our business relationships, including 
              suppliers, contractors, and other partners.
            </p>
            
            <div className="mt-4 space-y-3">
              <h4 className="font-medium">Human Rights Due Diligence Progress</h4>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Policy Development & Governance</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Risk & Impact Assessment</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Integration & Action</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Tracking & Monitoring</span>
                  <span className="text-sm font-medium">80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Grievance Mechanism</span>
                  <span className="text-sm font-medium">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Salient Human Rights Issues</h3>
            <p className="mb-4">
              We have identified the following salient human rights issues based on severity 
              and likelihood of adverse impacts:
            </p>
            
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium">Working Conditions in Logistics Operations</h4>
                <p className="text-sm mt-1 mb-2">
                  Issues include working hours, health & safety, and fair compensation for 
                  drivers, warehouse workers, and other logistics personnel.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className="font-medium">Medium</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Control Level</p>
                    <p className="font-medium">High</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Key Actions</p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    <li>Working hours monitoring system</li>
                    <li>Comprehensive occupational health & safety program</li>
                    <li>Living wage commitment for all employees</li>
                  </ul>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium">Labor Rights in the Supply Chain</h4>
                <p className="text-sm mt-1 mb-2">
                  Potential for forced labor, child labor, and freedom of association issues 
                  in certain high-risk geographic areas of our supply chain.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className="font-medium">High</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Control Level</p>
                    <p className="font-medium">Medium</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Key Actions</p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    <li>Supply chain mapping and risk assessment</li>
                    <li>Supplier Code of Conduct with human rights provisions</li>
                    <li>Audit program covering 78% of high-risk suppliers</li>
                    <li>Remediation program for identified issues</li>
                  </ul>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium">Community Rights & Land Use</h4>
                <p className="text-sm mt-1 mb-2">
                  Impacts on local communities and indigenous peoples related to land 
                  acquisition and use for logistics infrastructure.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className="font-medium">Medium</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Control Level</p>
                    <p className="font-medium">High</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Key Actions</p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    <li>Community engagement protocol for new developments</li>
                    <li>Free, Prior and Informed Consent (FPIC) process</li>
                    <li>Land rights assessment for all major projects</li>
                    <li>Community development programs in operating areas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Grievance Mechanisms & Remediation</h3>
            <p className="mb-4">
              We have established accessible grievance mechanisms for employees, suppliers, 
              community members, and other stakeholders to report human rights concerns. 
              Our approach to remediation follows international best practices.
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Grievances</p>
                  <p className="text-xl font-bold">83</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-xl font-bold">75</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-xl font-bold">8</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  <p className="text-xl font-bold">90.4%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HumanRights;
