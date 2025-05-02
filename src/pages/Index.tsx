
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, Globe, LineChart, Shield, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#F0FDFA] to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block bg-primary/10 text-primary font-medium px-4 py-2 rounded-full text-sm">
                Sustainability Made Simple
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Enterprise ESG <span className="text-primary">Simplified</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                Our AI-powered platform makes ESG management, carbon accounting, and compliance reporting effortless for enterprises of all sizes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to={isAuthenticated ? "/dashboard" : "/login"} className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Book a Demo
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-muted-foreground">Companies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-muted-foreground">Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Fandoro Dashboard Preview" 
                  className="w-full h-auto"
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-medium mb-10">Trusted by leading companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 w-32 bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground font-medium">Company {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Sustainability Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All-in-one platform to manage your enterprise sustainability initiatives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
            ].map((feature, i) => (
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
      
      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple process to transform your sustainability management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Connect Data Sources",
                description: "Easily integrate with your existing business systems to import data"
              },
              {
                step: 2,
                title: "Analyze & Monitor",
                description: "Track progress and receive AI-powered recommendations for improvement"
              },
              {
                step: 3,
                title: "Report & Comply",
                description: "Generate ready-to-submit reports that align with global frameworks"
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stories from companies transforming their sustainability journey with Fandoro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-muted"></div>
                  <div>
                    <div className="font-medium">Customer Name</div>
                    <div className="text-sm text-muted-foreground">Position, Company</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Fandoro has transformed how we manage our sustainability initiatives. 
                  The platform is intuitive, comprehensive, and has saved us countless hours in reporting."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to accelerate your sustainability journey?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join leading organizations in transforming their ESG management
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2 font-bold text-xl">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white">F</span>
                </div>
                <span>Fandoro</span>
              </div>
              <p className="text-muted-foreground">
                Empowering enterprises to monitor, manage and improve their sustainability metrics
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Product</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>ESG Management</li>
                  <li>GHG Accounting</li>
                  <li>Compliance</li>
                  <li>Reporting</li>
                  <li>LMS</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>About</li>
                  <li>Careers</li>
                  <li>Blog</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Documentation</li>
                  <li>Help Center</li>
                  <li>Webinars</li>
                  <li>Case Studies</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
            <div>© {new Date().getFullYear()} Fandoro. All rights reserved.</div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
