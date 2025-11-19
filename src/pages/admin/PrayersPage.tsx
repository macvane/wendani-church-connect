import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, Clock, Eye, Trash2, X, Mail, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { prayerAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

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
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className="absolute w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <img src="/logo.png" alt="Loading..." className="w-12 h-12 object-contain" />
            </div>
          </div>
        ) : filteredPrayers.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No prayer requests found.</p>
        ) : filteredPrayers.map(p => (
          <Card key={p.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-1">{p.full_name || 'Anonymous'}</CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {p.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {p.email}
                      </span>
                    )}
                    {p.phone_number && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {p.phone_number}
                      </span>
                    )}
                  </div>
                </div>
                {getStatusBadge(p.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Prayer Type: {p.prayer_type}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.prayer_request}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(p.created_at), 'MMM d, yyyy • h:mm a')}
                </span>
                <div className="flex gap-2">
                  {p.status === 'unread' && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(p.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" />Mark Read
                    </Button>
                  )}
                  <Button size="sm" onClick={() => handleViewDetails(p.id)}>
                    <Eye className="w-4 h-4 mr-1" />View
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prayer Details Dialog */}
      <Dialog open={!!selectedPrayer} onOpenChange={() => setSelectedPrayer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedPrayer?.full_name || 'Anonymous Prayer Request'}</span>
              {selectedPrayer && getStatusBadge(selectedPrayer.status)}
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedPrayer && format(new Date(selectedPrayer.created_at), 'MMMM d, yyyy • h:mm a')}
            </DialogDescription>
          </DialogHeader>

          {selectedPrayer && (
            <div className="space-y-6 pt-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Contact Information</h3>
                <div className="grid gap-3">
                  {selectedPrayer.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedPrayer.email}</span>
                    </div>
                  )}
                  {selectedPrayer.phone_number && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedPrayer.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Prayer Request */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Prayer Request</h3>
                <Badge variant="secondary" className="w-fit">{selectedPrayer.prayer_type}</Badge>
                <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
                  {selectedPrayer.prayer_request}
                </p>
              </div>

              {/* Visitation Details */}
              {selectedPrayer.wants_visitation && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Visitation Requested</h3>
                    <div className="grid gap-3 bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Prayer Cell</p>
                          <p className="text-sm text-muted-foreground">{selectedPrayer.prayer_cell || 'Not specified'}</p>
                        </div>
                      </div>
                      {selectedPrayer.general_area && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">General Area</p>
                            <p className="text-sm text-muted-foreground">{selectedPrayer.general_area}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Visitation Method</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedPrayer.visitation_method === 'call' ? 'Call with Pastor' : 'Visit at Home'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default PrayersPage;
