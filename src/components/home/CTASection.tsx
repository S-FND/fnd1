
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const CTASection = () => {
  const { isAuthenticated, user,isAuthenticatedStatus } = useAuth();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (!isAuthenticatedStatus([])) {
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
    <section className="py-20 px-4 bg-primary/10">
      <div className="container mx-auto max-w-5xl text-center space-y-8">
        <h2 className="text-3xl font-bold">Ready to accelerate your sustainability journey?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join leading organizations in transforming their ESG management
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleGetStarted}>Get Started Today</Button>
          <Button size="lg" variant="outline">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
