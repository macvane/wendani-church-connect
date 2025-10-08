import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { dummyDedications } from '@/data/adminData';
import { Search, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const DedicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRequests = dummyDedications.filter((request) => {
    const matchesSearch = request.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.parentNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase());
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
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.childName}</TableCell>
                    <TableCell>{request.parentNames}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>{format(new Date(request.childDateOfBirth), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(request.preferredDate), 'MMM d, yyyy')}</TableCell>
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
              No dedication requests found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DedicationsPage;
