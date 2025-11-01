import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { dedicationAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface DedicationRequest {
  id: number;
  child_full_name: string;
  date_birth: string;
  gender: string;
  father_full_name: string;
  father_email: string;
  father_phone_number: string;
  mother_full_name: string;
  mother_email: string;
  mother_phone_number: string;
  additional_information: string;
  status: string;
  created_at: string;
}

const DedicationsPage = () => {
  const [requests, setRequests] = useState<DedicationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await dedicationAPI.list();
      if (response.ok) {
        const data = await response.json();
        setRequests(data.results);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dedication requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const response = await dedicationAPI.updateStatus(id, status);
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
      const response = await dedicationAPI.delete(id);
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
    const matchesSearch = request.child_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.father_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.mother_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.father_email?.toLowerCase().includes(searchTerm.toLowerCase());
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
        <h1 className="text-3xl font-serif font-bold mb-2">Child Dedication Requests</h1>
        <p className="text-muted-foreground">
          Review and manage child dedication requests from families.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Child Dedication Management</CardTitle>
          <CardDescription>
            Review dedication requests, schedule ceremonies, and manage family preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by child or parent name..."
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
                  <TableHead>Child Name</TableHead>
                  <TableHead>Parents</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Child DOB</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No dedication requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.child_full_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{request.father_full_name}</div>
                          <div>{request.mother_full_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.father_email || request.mother_email || 'N/A'}</TableCell>
                      <TableCell>{request.father_phone_number || request.mother_phone_number || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(request.date_birth), 'MMM d, yyyy')}</TableCell>
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

export default DedicationsPage;
