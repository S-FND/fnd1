
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarHeader } from '@/components/ui/sidebar';

interface User {
  role?: string;
  unitId?: string;
  units?: Array<{ id: string; name: string }>;
}

interface SidebarHeaderComponentProps {
  user: User | null;
}

export const SidebarHeaderComponent: React.FC<SidebarHeaderComponentProps> = ({ user }) => {
  return (
    <SidebarHeader className="border-b pb-2">
      {/* <Link to="/" className="flex items-center gap-2 font-bold text-xl px-2">
        <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
          <span className="text-white">F</span>
        </div>
        <span>Fandoro</span>
      </Link> */}
      <Link to="/" className="flex items-center justify-center gap-2 font-bold text-xl w-full px-2">
        {/* Logo icon (instead of F) */}
        <div className="w-8 h-8 flex items-center justify-center">
          <img src="/logo/Only_logo.webp" alt="F Logo" className="w-full h-full object-contain" />
        </div>

        {/* Brand name (instead of Fandoro) */}
        <img src="/logo/Fireside_Logo-01_3.webp" alt="Fandoro Logo" className="h-4" />
      </Link>
      {/* {user?.role === 'unit_admin' && user?.unitId && (
        <div className="mt-1 px-2 text-xs text-muted-foreground">
          {user.units ? user.units.find(unit => unit.id === user.unitId)?.name : 'Unit Admin'}
        </div>
      )}
      {user?.role === 'fandoro_admin' && (
        <div className="mt-1 px-2 text-xs font-semibold text-primary">
          Fandoro Admin
        </div>
      )}
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <div className="mt-1 px-2 text-xs font-semibold text-primary">
          Company Admin
        </div>
      )}
      {user?.role === 'employee' && (
        <div className="mt-1 px-2 text-xs font-semibold text-muted-foreground">
          Employee
        </div>
      )} */}
    </SidebarHeader>
  );
};
