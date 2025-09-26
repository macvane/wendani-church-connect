import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { dummyAnnouncements } from '@/data/adminData';
import { Search, Upload, Eye, Edit, Trash2, Plus, Download } from 'lucide-react';
import { format } from 'date-fns';

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnnouncements = dummyAnnouncements.filter((announcement) => {
    return announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Announcements</h1>
        <p className="text-muted-foreground">
          Manage church announcements and weekly bulletins.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcements Management</CardTitle>
          <CardDescription>
            Upload, edit, and manage all church announcements and weekly bulletins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">{announcement.title}</TableCell>
                    <TableCell>
                      {format(new Date(announcement.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{announcement.author}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {announcement.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
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

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No announcements found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementsPage;