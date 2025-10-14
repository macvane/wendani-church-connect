import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch admin name from localStorage
  const adminName = localStorage.getItem('full_name') || 'Admin User';

  const handleLogout = async () => {
  const refresh = localStorage.getItem('refresh');

  console.log("Attempting logout...");
  console.log("Refresh token:", refresh);

  try {
    if (refresh) {
      const response = await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      console.log("Logout response:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Logout failed:", errorData);
        throw new Error('Failed to logout');
      }
    } else {
      console.warn("No refresh token found in localStorage");
    }

    // ✅ Clear all local storage
    localStorage.clear();

    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });

    navigate('/admin/login');
  } catch (error) {
    console.error("Logout error:", error);
    toast({
      title: 'Error',
      description: 'Unable to log out. Please try again.',
      variant: 'destructive',
    });
  }
};


  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-serif font-semibold">Church Portal</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span>{adminName}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
