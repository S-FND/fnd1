
import React from 'react';
import { SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
  name?: string;
  email?: string;
  role?: string;
  unitId?: string;
  units?: Array<{ id: string; name: string }>;
}

interface SidebarUserProfileProps {
  user: UserProfile | null;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ user }) => {
  const { logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <SidebarFooter className="border-t">
      <div className="p-2 space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-medium">{user.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </SidebarFooter>
  );
};
