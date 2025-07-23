
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const { isAuthenticated, user,isAuthenticatedStatus } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (!isAuthenticatedStatus()) {
      navigate('/');
    } else {
      // Redirect based on user role
      switch(user?.role) {
        case "admin":
        case "manager":
          navigate("/settings");
          break;
        case "unit_admin":
          navigate("/unit-admin/dashboard");
          break;
        case "employee":
          navigate("/employee/dashboard");
          break;
        case "supplier":
          navigate("/supplier/dashboard");
          break;
        case "vendor":
          navigate("/vendor/dashboard");
          break;
        default:
          navigate("/settings");
      }
    }
  };
  
  return (
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
              <Button size="lg" onClick={handleGetStarted} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Book a Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold">150+</div>
                <div className="text-muted-foreground">Companies Helped</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$800Mn+</div>
                <div className="text-muted-foreground">Sustainable Investments</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
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
  );
};

export default HeroSection;
