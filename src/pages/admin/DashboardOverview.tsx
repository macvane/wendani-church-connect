import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats } from '@/data/adminData';
import {
  Heart,
  Droplets,
  Baby,
  UserPlus,
  HandHeart,
  MessageSquare,
  BookOpen,
  Calendar,
  Users,
  TrendingUp,
} from 'lucide-react';

const DashboardOverview = () => {
  const statCards = [
    {
      title: 'Prayer Requests',
      total: dashboardStats.totalPrayers,
      pending: dashboardStats.pendingPrayers,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Baptism Requests',
      total: dashboardStats.totalBaptisms,
      pending: dashboardStats.pendingBaptisms,
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Child Dedications',
      total: dashboardStats.totalDedications,
      pending: dashboardStats.pendingDedications,
      icon: Baby,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Membership Transfers',
      total: dashboardStats.totalMemberships,
      pending: dashboardStats.pendingMemberships,
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Benevolence Requests',
      total: dashboardStats.totalBenevolence,
      pending: dashboardStats.pendingBenevolence,
      icon: HandHeart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Contact Messages',
      total: dashboardStats.totalContacts,
      pending: dashboardStats.newContacts,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Blog Posts',
      total: dashboardStats.totalBlogs,
      pending: dashboardStats.pendingBlogs,
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Events',
      total: dashboardStats.totalEvents,
      pending: dashboardStats.publishedEvents,
      icon: Calendar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to the church administration dashboard. Here's a summary of all activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`h-8 w-8 rounded-md ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.total}</div>
              <p className="text-xs text-muted-foreground">
                {stat.pending} pending/new
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest submissions and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New prayer request from John Doe</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Baptism request approved for Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New blog post pending review</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Contact message from Peter Kamau</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors">
              <div className="font-medium">Create New Announcement</div>
              <div className="text-sm text-muted-foreground">Publish a new church announcement</div>
            </button>
            <button className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors">
              <div className="font-medium">Add New Event</div>
              <div className="text-sm text-muted-foreground">Schedule an upcoming church event</div>
            </button>
            <button className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors">
              <div className="font-medium">Review Pending Blogs</div>
              <div className="text-sm text-muted-foreground">Approve or edit pending blog posts</div>
            </button>
            <button className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors">
              <div className="font-medium">View Prayer Requests</div>
              <div className="text-sm text-muted-foreground">Review and respond to prayer requests</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;