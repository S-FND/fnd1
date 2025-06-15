
import React from 'react';
import { BarChart3, CheckCircle2, Globe, LineChart, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: "ESG Management",
    description: "Track KPIs, set goals, and monitor progress across all ESG parameters"
  },
  {
    icon: LineChart,
    title: "GHG Accounting",
    description: "Calculate, monitor, and reduce carbon emissions across your organization"
  },
  {
    icon: Shield,
    title: "EHS Compliance",
    description: "Ensure adherence to safety standards and environmental regulations"
  },
  {
    icon: CheckCircle2,
    title: "Automated Reporting",
    description: "Generate BRSR, GRI, TCFD, and other compliance reports"
  },
  {
    icon: Globe,
    title: "SDG Alignment",
    description: "Map your initiatives to UN Sustainable Development Goals"
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Role-based access control and team performance tracking"
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Sustainability Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All-in-one platform to manage your enterprise sustainability initiatives
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="border rounded-lg p-6 hover:border-primary transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
