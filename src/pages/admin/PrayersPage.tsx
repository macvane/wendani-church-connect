import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, CheckCircle, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Prayer {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  prayer_type?: string;
  prayer_request: string;
  status: 'read' | 'unread';
  created_at: string;
}

const PrayersPage = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const { toast } = useToast();

  const PAGE_SIZE = 10;

  const fetchPrayers = async (url?: string) => {
    setLoading(true);
    try {
      const endpoint = url || `http://127.0.0.1:8000/form/prayers/list/?page=${currentPage}`;
      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to fetch prayers.');

      const data = await res.json();

      // Handle pagination fields
      setPrayers(data.results || data); // fallback if pagination is off
      setNextPage(data.next);
      setPrevPage(data.previous);
      setTotalCount(data.count || data.length);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [currentPage]);

  const updatePrayerStatus = async (prayerId: number, newStatus: 'unread' | 'read') => {
    setUpdating(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/form/prayers/${prayerId}/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      const updatedPrayer = await res.json();

      setPrayers(prev => prev.map(p => (p.id === updatedPrayer.id ? updatedPrayer : p)));
      setSelectedPrayer(prev => (prev && prev.id === updatedPrayer.id ? updatedPrayer : prev));

      toast({
        title: 'Updated',
        description: `Prayer marked as ${newStatus === 'read' ? 'Read' : 'Unread'}`,
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Unread
          </Badge>
        );
      case 'read':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Read
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleNext = () => {
    if (nextPage) {
      setCurrentPage(prev => prev + 1);
      fetchPrayers(nextPage);
    }
  };

  const handlePrev = () => {
    if (prevPage && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      fetchPrayers(prevPage);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Prayer Requests</h1>
        <p className="text-muted-foreground">
          Manage and respond to prayer requests submitted through the website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prayer Requests Management</CardTitle>
          <CardDescription>
            View, filter, and manage all prayer requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
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

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
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
                    {prayers.map(prayer => (
                      <TableRow key={prayer.id}>
                        <TableCell>{prayer.full_name || 'Anonymous'}</TableCell>
                        <TableCell>{prayer.email || '—'}</TableCell>
                        <TableCell className="truncate max-w-xs">{prayer.prayer_request}</TableCell>
                        <TableCell>{format(new Date(prayer.created_at), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(prayer.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedPrayer(prayer)}>
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                            {prayer.status === 'unread' && (
                              <Button
                                size="sm"
                                onClick={() => updatePrayerStatus(prayer.id, 'read')}
                                disabled={updating}
                              >
                                {updating ? 'Updating...' : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Read
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* ✅ Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing page {currentPage} of {Math.ceil(totalCount / PAGE_SIZE)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={!prevPage}
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={!nextPage}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrayersPage;
