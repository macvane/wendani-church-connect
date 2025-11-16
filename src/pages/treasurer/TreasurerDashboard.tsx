import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TreasurerSidebar } from '@/components/treasurer/TreasurerSidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { clearTokens } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

const TreasurerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      navigate('/admin/login');
      return;
    }

    if (userRole !== 'treasurer') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
      navigate('/admin/login');
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem('user_role');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/admin/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full treasurer-theme">
        <TreasurerSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Treasurer Portal
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TreasurerDashboard;