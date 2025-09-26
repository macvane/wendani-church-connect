import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { dummyContacts } from '@/data/adminData';
import { Search, Eye, MessageSquare, Archive, Star } from 'lucide-react';
import { format } from 'date-fns';

const ContactsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContacts = dummyContacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">New</Badge>;
      case 'replied':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Replied</Badge>;
      case 'archived':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Contact Messages</h1>
        <p className="text-muted-foreground">
          View and respond to messages from website visitors and church members.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Messages Management</CardTitle>
          <CardDescription>
            Manage all contact form submissions and inquiries from the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, subject, or message..."
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
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{contact.email}</div>
                        <div className="text-muted-foreground">{contact.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{contact.subject}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={contact.message}>
                        {contact.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm">
                          <Archive className="w-4 h-4 mr-1" />
                          Archive
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No contact messages found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsPage;