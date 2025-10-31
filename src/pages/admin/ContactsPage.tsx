import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, MessageSquare, Archive, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { contactAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  created_at: string;
}

const ContactsPage = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactAPI.list();
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await contactAPI.delete(id);
      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== id));
        toast({
          title: "Success",
          description: "Message deleted",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    return contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No contact messages found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.full_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{contact.email}</div>
                          <div className="text-muted-foreground">{contact.phone_number || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{contact.subject}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={contact.message}>
                          {contact.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(contact.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `mailto:${contact.email}`}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(contact.id)}
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

export default ContactsPage;
