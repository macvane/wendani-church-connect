import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { baptismAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface BaptismRequest {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  is_baptised: boolean;
  is_study: boolean;
  status: string;
  additional_information: string;
  created_at: string;
}

const BaptismRequestsPage = () => {
  const [requests, setRequests] = useState<BaptismRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await baptismAPI.list();
      if (response.ok) {
        const data = await response.json();
        setRequests(data.results);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch baptism requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const response = await baptismAPI.updateStatus(id, status);
      if (response.ok) {
        setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
        toast({
          title: "Success",
          description: `Request ${status}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await baptismAPI.delete(id);
      if (response.ok) {
        setRequests(requests.filter(r => r.id !== id));
        toast({
          title: "Success",
          description: "Request deleted",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Baptism Requests</h1>
        <p className="text-muted-foreground">
          Review and manage baptism requests from church members.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Baptism Requests Management</CardTitle>
          <CardDescription>
            Review requests, view testimonies, and approve or reject baptism applications.
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Previous Baptism</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
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
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No baptism requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.full_name}</TableCell>
                      <TableCell>{request.email || 'N/A'}</TableCell>
                      <TableCell>{request.phone_number || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(request.date_of_birth), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{request.is_baptised ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{format(new Date(request.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => handleUpdateStatus(request.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => handleUpdateStatus(request.id, 'rejected')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(request.id)}
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

export default BaptismRequestsPage;
