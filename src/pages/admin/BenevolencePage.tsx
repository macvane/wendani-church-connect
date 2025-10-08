import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { dummyBenevolence } from '@/data/adminData';
import { Search, Eye, CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const BenevolencePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  const filteredRequests = dummyBenevolence.filter((request) => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'under_review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          High
        </Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'Low':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{urgency}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Benevolence Requests</h1>
        <p className="text-muted-foreground">
          Review and manage financial assistance requests from church members and community.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benevolence Request Management</CardTitle>
          <CardDescription>
            Review assistance requests, assess needs, and provide support to those in need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or request type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Status</option>
              <option value="under_review">Under Review</option>
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
                  <TableHead>Request Type</TableHead>
                  <TableHead>Family Size</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{request.requestType}</TableCell>
                    <TableCell>{request.familySize}</TableCell>
                    <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                    <TableCell>{format(new Date(request.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No benevolence requests found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BenevolencePage;
