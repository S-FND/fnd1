import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface BackToHomeButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ 
  className = "", 
  variant = "outline", 
  size = "sm" 
}) => {
  return (
    <Button 
      asChild 
      variant={variant} 
      size={size} 
      className={`gap-2 ${className}`}
    >
      <Link to="/dashboard">
        <Home className="h-4 w-4" />
        Back to Home
      </Link>
    </Button>
  );
};