import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-[#F8FAFC]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <AdminHeader />
          
          {/* Custom Scrollbar applied to the main content area */}
          <main className="flex-1 overflow-y-auto scrollbar-church p-4 md:p-8">
            <div className="max-w-7xl mx-auto pb-10">
              <Outlet />
            </div>
          </main>

          <footer className="h-10 border-t bg-white/80 backdrop-blur flex items-center justify-between text-[10px] text-muted-foreground px-8 shrink-0">
            <span>&copy; {new Date().getFullYear()} Church Management System</span>
            <div className="flex gap-4">
              <span className="hover:text-church-600 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-church-600 cursor-pointer transition-colors">Support</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;