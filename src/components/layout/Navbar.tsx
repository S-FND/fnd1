import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, HelpCircle, Search, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Get environment name & API URL from Vite env variables
const envName = import.meta.env.VITE_ENV_NAME || (import.meta.env.MODE === 'production' ? 'Production' : import.meta.env.MODE === 'development' ? 'Development' : import.meta.env.MODE);
const apiUrl = import.meta.env.VITE_API_URL;
export const Navbar: React.FC = () => {
  const {
    user,
    logout
  } = useAuth();
  return;
};