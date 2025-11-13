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
  LayoutDashboard,
  Users,
  Heart,
  Droplets,
  Baby,
  UserPlus,
  HandHeart,
  MessageSquare,
  Megaphone,
  Calendar,
  BookOpen,
  UserCheck,
  CreditCard,
} from 'lucide-react';

const adminMenuItems = [
  {
    title: 'Overview',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Prayer Requests',
    url: '/admin/dashboard/prayers',
    icon: Heart,
  },
  {
    title: 'Baptism Requests',
    url: '/admin/dashboard/baptisms',
    icon: Droplets,
  },
  {
    title: 'Child Dedications',
    url: '/admin/dashboard/dedications',
    icon: Baby,
  },
  {
    title: 'Membership Transfers',
    url: '/admin/dashboard/memberships',
    icon: UserPlus,
  },
  {
    title: 'Benevolence Requests',
    url: '/admin/dashboard/benevolence',
    icon: HandHeart,
  },
  {
    title: 'Contact Messages',
    url: '/admin/dashboard/contacts',
    icon: MessageSquare,
  },
  {
    title: 'Announcements',
    url: '/admin/dashboard/announcements',
    icon: Megaphone,
  },
  {
    title: 'Events',
    url: '/admin/dashboard/events',
    icon: Calendar,
  },
  {
    title: 'Transactions',
    url: '/admin/dashboard/transactions',
    icon: CreditCard,
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={state === 'collapsed' ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            {state !== 'collapsed' && (
              <div>
                <h2 className="text-lg font-serif font-bold">Church Admin</h2>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive(item.url)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== 'collapsed' && <span>{item.title}</span>}
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