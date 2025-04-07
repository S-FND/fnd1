
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, Globe, LineChart, Shield, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
              <span className="text-white">F</span>
            </div>
            <span>Fandoro</span>
          </Link>
          
          <div className="ml-auto flex items-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button variant="ghost">
                {isAuthenticated ? "Dashboard" : "Login"}
              </Button>
            </Link>
            {!isAuthenticated && (
              <Button>
                <Link to="/login">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Enterprise Sustainability <span className="text-primary">Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered platform for managing ESG goals, GHG accounting, compliance, and sustainability reporting.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/login" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Request Demo
            </Button>
          </div>
          
          <div className="pt-8">
            <div className="bg-background border rounded-xl shadow-lg overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Fandoro Dashboard" 
                className="w-full h-auto"
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </div>
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
                <div className="h-12 w-12 rounded-lg eco-gradient flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to accelerate your sustainability journey?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join leading organizations across India in transforming their ESG management
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/login">Try Now</Link>
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
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
                <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
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
