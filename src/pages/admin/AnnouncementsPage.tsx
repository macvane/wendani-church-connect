import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { dummyAnnouncements } from '@/data/adminData';
import { Search, Upload, Eye, Edit, Trash2, Plus, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  const filteredAnnouncements = dummyAnnouncements.filter((announcement) => {
    return announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateAnnouncement = () => {
    console.log('Creating announcement:', formData);
    setIsCreateOpen(false);
    setFormData({ title: '', description: '', file: null });
  };

  const handleEditAnnouncement = () => {
    console.log('Updating announcement:', selectedAnnouncement.id, formData);
    setIsEditOpen(false);
    setFormData({ title: '', description: '', file: null });
  };

  const openEditDialog = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.content,
      file: null,
    });
    setIsEditOpen(true);
  };

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
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Upload a document and add details for the announcement.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter announcement description"
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file">Document (PDF)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAnnouncement}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Announcement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                        <Button variant="outline" size="sm" onClick={() => window.open(announcement.fileUrl, '_blank')}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(announcement.fileUrl, '_blank')}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(announcement)}>
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details and document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter announcement description"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-file">Document (PDF) - Optional</Label>
              <Input
                id="edit-file"
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              />
              <p className="text-sm text-muted-foreground">Leave empty to keep current document</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAnnouncement}>
              <Edit className="w-4 h-4 mr-2" />
              Update Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsPage;