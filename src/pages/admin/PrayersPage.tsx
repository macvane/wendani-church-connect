import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { dummyPrayers } from '@/data/adminData';
import { Search, Eye, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const PrayersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPrayers = dummyPrayers.filter((prayer) => {
    const matchesSearch = prayer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.prayerRequest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prayer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'reviewed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Reviewed</Badge>;
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
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
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
                {filteredPrayers.map((prayer) => (
                  <TableRow key={prayer.id}>
                    <TableCell className="font-medium">{prayer.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{prayer.email}</div>
                        <div className="text-muted-foreground">{prayer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={prayer.prayerRequest}>
                        {prayer.prayerRequest}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(prayer.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(prayer.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {prayer.status === 'pending' && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Reviewed
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPrayers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No prayer requests found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrayersPage;