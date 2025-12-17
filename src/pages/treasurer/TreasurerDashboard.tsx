import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TreasurerSidebar } from '@/components/treasurer/TreasurerSidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { clearTokens } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
      <div className="flex min-h-screen w-full treasurer-theme bg-background">
        <TreasurerSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-sm px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="rounded-lg hover:bg-muted" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold">Treasury Dashboard</h1>
                <p className="text-xs text-muted-foreground">Financial Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Treasurer Portal
              </span>

              {/* Logout Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out of the Treasurer dashboard?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TreasurerDashboard;
