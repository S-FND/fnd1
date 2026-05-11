import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { CompanySidebar } from './CompanySidebar';
import { FandoroSidebar } from './FandoroSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { AsOfSelector } from '@/components/AsOfSelector';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  /** When true, the layout uses fixed viewport height with internal scrolling */
  fixedHeight?: boolean;
}

export const MISDashboardLayout = ({ children, fixedHeight = false }: DashboardLayoutProps) => {
  const { isAdmin, isFandoro } = useAuth();
  // The "As of" snapshot only makes sense for admin oversight views.
  const showAsOfSelector = isAdmin || isFandoro;

  return (
    <div className={cn("bg-background", fixedHeight ? "h-screen overflow-hidden" : "min-h-screen")}>
      {isAdmin ? <Sidebar /> : isFandoro ? <FandoroSidebar /> : <CompanySidebar />}
      <main className={cn(
        "ml-64 transition-all duration-300 min-w-0",
        fixedHeight ? "h-screen flex flex-col overflow-hidden" : "min-h-screen"
      )}>
        {showAsOfSelector && (
          <div className="sticky top-0 z-30 flex items-center justify-end gap-2 px-4 py-2 bg-background/90 backdrop-blur border-b border-border">
            <AsOfSelector />
          </div>
        )}
        <div className={cn(
          "p-4 w-full max-w-[calc(100vw-16rem)] min-w-0",
          fixedHeight ? "flex-1 overflow-y-auto overflow-x-hidden" : "overflow-x-auto"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};
