import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, CheckCircle, Clock, Trash2 } from 'lucide-react';
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
  status: string;
  created_at: string;
}

const PrayersPage = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
        toast({
          title: "Success",
          description: "Prayer request marked as read",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prayer request",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;
    
    try {
      const response = await prayerAPI.delete(id);
      if (response.ok) {
        setPrayers(prayers.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Prayer request deleted",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete prayer request",
        variant: "destructive",
      });
    }
  };

  const filteredPrayers = prayers.filter((prayer) => {
    const matchesSearch = prayer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.prayer_request.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prayer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Unread</Badge>;
      case 'read':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Read</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Prayer Requests</h1>
        <p className="text-muted-foreground">
          Manage and respond to prayer requests from church members and visitors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prayer Requests Management</CardTitle>
          <CardDescription>
            View, filter, and manage all prayer requests submitted through the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or prayer request..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Prayer Request</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center py-24">
                    <div className="relative flex items-center justify-center w-24 h-24">
                      {/* Spinner circle */}
                      <div className="absolute w-24 h-24 border-4 border-[#007780] border-t-light rounded-full animate-spin"></div>

                      {/* Center logo */}
                      <img 
                        src="/logo.png" 
                        alt="Loading..." 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPrayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No prayer requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrayers.map((prayer) => (
                    <TableRow key={prayer.id}>
                      <TableCell className="font-medium">{prayer.full_name || 'Anonymous'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{prayer.email || 'N/A'}</div>
                          <div className="text-muted-foreground">{prayer.phone_number || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={prayer.prayer_request}>
                          {prayer.prayer_request}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(prayer.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{getStatusBadge(prayer.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {prayer.status === 'unread' && (
                            <Button size="sm" onClick={() => handleMarkAsRead(prayer.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(prayer.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default PrayersPage;