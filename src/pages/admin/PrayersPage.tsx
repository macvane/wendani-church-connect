import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, Clock, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { prayerAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface Prayer {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  prayer_type: string;
  prayer_request: string;
  wants_visitation: boolean;
  prayer_cell: string;
  general_area: string;
  visitation_method: string;
  status: string;
  created_at: string;
}

const PrayersPage = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const response = await prayerAPI.list();
      if (response.ok) {
        const data = await response.json();
        setPrayers(data.results);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch prayer requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await prayerAPI.update(id, { status: 'read' });
      if (response.ok) {
        setPrayers(prayers.map(p => p.id === id ? { ...p, status: 'read' } : p));
        toast({ title: "Success", description: "Prayer request marked as read" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update prayer request", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;
    try {
      const response = await prayerAPI.delete(id);
      if (response.ok) {
        setPrayers(prayers.filter(p => p.id !== id));
        toast({ title: "Deleted", description: "Prayer request deleted successfully" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete prayer request", variant: "destructive" });
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await prayerAPI.detail(id);
      if (response.ok) {
        const data = await response.json();
        setSelectedPrayer(data);
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch prayer request details", variant: "destructive" });
    }
  };

  const filteredPrayers = prayers.filter(p => {
    const matchesSearch =
      p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prayer_request.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Unread</Badge>;
      case 'read': return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Read</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Prayer Requests</h1>
        <p className="text-muted-foreground">
          Manage prayer requests and visitation requests submitted through the website.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or prayer request..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Prayer Request Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-24">
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className="absolute w-24 h-24 border-4 border-[#007780] border-t-light rounded-full animate-spin"></div>
              <img src="/logo.png" alt="Loading..." className="w-12 h-12 object-contain" />
            </div>
          </div>
        ) : filteredPrayers.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-12">No prayer requests found.</p>
        ) : filteredPrayers.map(p => (
          <Card key={p.id} className="border shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{p.full_name || 'Anonymous'}</CardTitle>
              <CardDescription className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">{p.email || 'N/A'} | {p.phone_number || 'N/A'}</span>
                <span className="text-sm truncate">{p.prayer_request}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(p.created_at), 'MMM d, yyyy')}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {getStatusBadge(p.status)}
                <div className="flex gap-2">
                  {p.status === 'unread' && (
                    <Button size="sm" onClick={() => handleMarkAsRead(p.id)}>Mark Read</Button>
                  )}
                  <Button size="sm" onClick={() => handleViewDetails(p.id)}><Eye className="w-4 h-4 mr-1" />Details</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Prayer Modal */}
      {selectedPrayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
            <h2 className="text-xl font-bold mb-2">{selectedPrayer.full_name || 'Anonymous'}</h2>
            <p className="text-sm text-muted-foreground mb-4">{selectedPrayer.email || 'N/A'} | {selectedPrayer.phone_number || 'N/A'}</p>
            <p className="mb-4"><strong>Request Type:</strong> {selectedPrayer.prayer_type}</p>
            <p className="mb-4"><strong>Prayer Request:</strong> {selectedPrayer.prayer_request}</p>

            {selectedPrayer.wants_visitation && (
              <>
                <h3 className="font-semibold mt-4 mb-2">Visitation Details</h3>
                <p><strong>Prayer Cell:</strong> {selectedPrayer.prayer_cell || 'N/A'}</p>
                <p><strong>General Area:</strong> {selectedPrayer.general_area || 'N/A'}</p>
                <p><strong>Method:</strong> {selectedPrayer.visitation_method === 'call' ? 'Call with Pastor' : 'Visit at Home'}</p>
              </>
            )}

            <p className="mt-4"><strong>Status:</strong> {selectedPrayer.status}</p>
            <p className="mt-1 text-xs text-muted-foreground">Submitted on {format(new Date(selectedPrayer.created_at), 'MMM d, yyyy HH:mm')}</p>

            <Button
              className="absolute top-2 right-2"
              variant="ghost"
              onClick={() => setSelectedPrayer(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PrayersPage;
