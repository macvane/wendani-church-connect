import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Heart,
  Droplets,
  Baby,
  UserPlus,
  HandHeart,
  MessageSquare,
  Calendar,
  Users,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  prayerAPI,
  baptismAPI,
  dedicationAPI,
  membershipAPI,
  benevolenceAPI,
  contactAPI,
  eventAPI,
} from '@/utils/api';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPrayers: 0,
    totalBaptisms: 0,
    totalDedications: 0,
    totalMemberships: 0,
    totalBenevolence: 0,
    totalContacts: 0,
    totalEvents: 0,
  });

  const navigate = useNavigate();

  const goToAnnouncements = () => navigate('/admin/dashboard/announcements');
  const goToEvents = () => navigate('/admin/dashboard/events');

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);
        const [
          prayersRes,
          baptismsRes,
          dedicationsRes,
          membershipsRes,
          benevolenceRes,
          contactsRes,
          eventsRes,
        ] = await Promise.all([
          prayerAPI.list(),
          baptismAPI.list(),
          dedicationAPI.list(),
          membershipAPI.list(),
          benevolenceAPI.list(),
          contactAPI.list(),
          eventAPI.list(),
        ]);

        const [
          prayers,
          baptisms,
          dedications,
          memberships,
          benevolence,
          contacts,
          events,
        ] = await Promise.all([
          prayersRes.json(),
          baptismsRes.json(),
          dedicationsRes.json(),
          membershipsRes.json(),
          benevolenceRes.json(),
          contactsRes.json(),
          eventsRes.json(),
        ]);

        setStats({
          totalPrayers: Array.isArray(prayers) ? prayers.length : prayers.results?.length || 0,
          totalBaptisms: Array.isArray(baptisms) ? baptisms.length : baptisms.results?.length || 0,
          totalDedications: Array.isArray(dedications) ? dedications.length : dedications.results?.length || 0,
          totalMemberships: Array.isArray(memberships) ? memberships.length : memberships.results?.length || 0,
          totalBenevolence: Array.isArray(benevolence) ? benevolence.length : benevolence.results?.length || 0,
          totalContacts: Array.isArray(contacts) ? contacts.length : contacts.results?.length || 0,
          totalEvents: Array.isArray(events) ? events.length : events.results?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  const statCards = [
    { title: 'Prayer Requests', total: stats.totalPrayers, icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50' },
    { title: 'Baptism Requests', total: stats.totalBaptisms, icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Child Dedications', total: stats.totalDedications, icon: Baby, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { title: 'Membership Transfers', total: stats.totalMemberships, icon: UserPlus, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Benevolence Requests', total: stats.totalBenevolence, icon: HandHeart, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Contact Messages', total: stats.totalContacts, icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Events', total: stats.totalEvents, icon: Calendar, color: 'text-teal-600', bgColor: 'bg-teal-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          A quick snapshot of church activities and administrative insights.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="p-4 hover:shadow-lg transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.total}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{stat.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-gray-700" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={goToAnnouncements}
            className="p-4 text-left rounded-xl border hover:bg-accent transition-all hover:shadow-sm"
          >
            <div className="font-medium text-gray-900">Create New Announcement</div>
            <div className="text-sm text-muted-foreground">
              Publish a new church announcement
            </div>
          </button>
          <button
            onClick={goToEvents}
            className="p-4 text-left rounded-xl border hover:bg-accent transition-all hover:shadow-sm"
          >
            <div className="font-medium text-gray-900">Add New Event</div>
            <div className="text-sm text-muted-foreground">
              Schedule an upcoming church event
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
