import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Heart,
  Droplets,
  Baby,
  UserPlus,
  HandHeart,
  MessageSquare,
  Megaphone,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuGroups = [
  {
    label: "Core",
    items: [
      { title: 'Overview', url: '/admin/dashboard', icon: LayoutDashboard },
      { title: 'Announcements', url: '/admin/dashboard/announcements', icon: Megaphone },
      { title: 'Events', url: '/admin/dashboard/events', icon: Calendar },
    ]
  },
  {
    label: "Ministry Requests",
    items: [
      { title: 'Prayer Requests', url: '/admin/dashboard/prayers', icon: Heart },
      { title: 'Baptism Requests', url: '/admin/dashboard/baptisms', icon: Droplets },
      { title: 'Child Dedications', url: '/admin/dashboard/dedications', icon: Baby },
    ]
  },
  {
    label: "Administration",
    items: [
      { title: 'Membership', url: '/admin/dashboard/memberships', icon: UserPlus },
      { title: 'Benevolence', url: '/admin/dashboard/benevolence', icon: HandHeart },
      { title: 'Contacts', url: '/admin/dashboard/contacts', icon: MessageSquare },
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50 px-4">
        <div className="flex items-center gap-3 w-full">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-church-600 text-white shadow-lg shadow-church-600/20">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          {state !== 'collapsed' && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-serif font-bold text-foreground uppercase tracking-wider">
                Church Admin
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase">
                Management
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Applied the custom scrollbar here */}
      <SidebarContent className="py-4 scrollbar-church overflow-y-auto overflow-x-hidden">
        {menuGroups.map((group, idx) => (
          <SidebarGroup key={idx} className="px-2">
            {state !== 'collapsed' && (
              <SidebarGroupLabel className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={state === 'collapsed' ? item.title : undefined}
                        className={cn(
                          "relative group h-10 transition-all duration-200 mb-1",
                          active 
                            ? "bg-church-50 text-church-600 font-semibold" 
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <NavLink to={item.url} className="flex items-center w-full gap-3 px-3">
                          <item.icon className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            active ? "text-church-600" : "group-hover:text-foreground"
                          )} />
                          {state !== 'collapsed' && <span className="flex-1 truncate">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}