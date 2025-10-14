import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, CheckCircle, Clock, X, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BaptismRequest {
  id: number;
  full_name: string;
  email?: string;
  phone_number: string;
  date_of_birth: string;
  is_baptised: boolean;
  is_study: boolean;
  additional_information?: string;
  created_at: string;
  status: 'read' | 'unread';
}

const BaptismRequestsPage = () => {
  const [requests, setRequests] = useState<BaptismRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BaptismRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch Baptism Requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/form/baptisms/list/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch baptism requests');
      const data = await res.json();
      setRequests(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update Status
  const updateBaptismStatus = async (id: number, newStatus: 'read' | 'unread') => {
    setUpdating(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/form/baptisms/${id}/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setRequests(prev => prev.map(r => (r.id === updated.id ? updated : r)));
      toast({
        title: 'Updated',
        description: `Marked as ${newStatus}`,
      });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  // Filters
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === 'unread' ? (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" /> Unread
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" /> Read
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Baptism Requests</h1>
        <p className="text-muted-foreground">
          Review and manage baptism requests submitted through the website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Baptism Requests Management</CardTitle>
          <CardDescription>
            View details and update baptism request statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Study?</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((req, index) => (
                    <TableRow key={req.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{req.full_name}</TableCell>
                      <TableCell>{req.email || '—'}</TableCell>
                      <TableCell>{req.phone_number}</TableCell>
                      <TableCell>{format(new Date(req.date_of_birth), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{req.is_study ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                          {req.status === 'unread' && (
                            <Button
                              size="sm"
                              onClick={() => updateBaptismStatus(req.id, 'read')}
                              disabled={updating}
                            >
                              {updating ? 'Updating...' : 'Mark Read'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No baptism requests found matching your criteria.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedRequest(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">Baptism Request Details</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedRequest.full_name}</p>
              <p><strong>Email:</strong> {selectedRequest.email || '—'}</p>
              <p><strong>Phone:</strong> {selectedRequest.phone_number}</p>
              <p><strong>Date of Birth:</strong> {format(new Date(selectedRequest.date_of_birth), 'MMM d, yyyy')}</p>
              <p><strong>Is Baptised Before:</strong> {selectedRequest.is_baptised ? 'Yes' : 'No'}</p>
              <p><strong>Is in Bible Study:</strong> {selectedRequest.is_study ? 'Yes' : 'No'}</p>
              {selectedRequest.additional_information && (
                <p className="mt-3"><strong>Additional Info:</strong> {selectedRequest.additional_information}</p>
              )}
              <p><strong>Submitted:</strong> {format(new Date(selectedRequest.created_at), 'MMM d, yyyy')}</p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              {selectedRequest.status === 'unread' && (
                <Button
                  onClick={() => updateBaptismStatus(selectedRequest.id, 'read')}
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Mark as Read'}
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaptismRequestsPage;
