import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  CreditCard,
  FileText,
  LayoutDashboard,
} from 'lucide-react';

const treasurerMenuItems = [
  {
    title: 'Transactions',
    url: '/treasurer/dashboard',
    icon: CreditCard,
    description: 'View all transactions',
  },
  {
    title: 'Reports',
    url: '/treasurer/dashboard/reports',
    icon: FileText,
    description: 'Financial reports',
  }
];

export function TreasurerSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/treasurer/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar 
      className={`${state === 'collapsed' ? 'w-16' : 'w-72'} border-r border-sidebar-border bg-sidebar-background`} 
      collapsible="icon"
    >
      <SidebarContent className="py-6">
        {/* Logo Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            {state !== 'collapsed' && (
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Treasury</h2>
                <p className="text-xs text-muted-foreground">Financial Portal</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mb-2">
            {state !== 'collapsed' && 'Management'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {treasurerMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive(item.url)
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.url) ? '' : 'text-muted-foreground'}`} />
                      {state !== 'collapsed' && (
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          {!isActive(item.url) && (
                            <span className="text-[10px] text-muted-foreground/70 font-normal">
                              {item.description}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
