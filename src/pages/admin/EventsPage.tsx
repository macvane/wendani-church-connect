import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Calendar, Eye, Edit, Trash2, Plus, ImagePlus } from 'lucide-react';
import { format } from 'date-fns';
import { eventAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  department: string;
  image: string;
  created_at: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    department: 'Sabbath School',
    image: null as File | null,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.list();
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.venue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.description || !formData.venue || !formData.date || !formData.time || !formData.department || !formData.image) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('venue', formData.venue);
    data.append('date', formData.date);
    data.append('time', formData.time);
    data.append('department', formData.department);
    data.append('image', formData.image);

    try {
      const response = await eventAPI.create(data);
      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        fetchEvents();
        setIsCreateOpen(false);
        setFormData({ title: '', description: '', venue: '', date: '', time: '', department: 'Sabbath School', image: null });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent || !formData.title || !formData.description || !formData.venue || !formData.date || !formData.time || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('venue', formData.venue);
    data.append('date', formData.date);
    data.append('time', formData.time);
    data.append('department', formData.department);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await eventAPI.update(selectedEvent.id, data);
      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        fetchEvents();
        setIsEditOpen(false);
        setFormData({ title: '', description: '', venue: '', date: '', time: '', department: 'Sabbath School', image: null });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await eventAPI.delete(id);
      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      venue: event.venue,
      date: event.date,
      time: event.time,
      department: event.department || 'Sabbath School',
      image: null,
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Events Management</h1>
        <p className="text-muted-foreground">
          Create, manage, and track church events and registrations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Management</CardTitle>
          <CardDescription>
            Organize church events, track registrations, and manage event details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Add event details including image, venue, date, and time.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter event title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Enter venue location"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <select
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="Sabbath School">Sabbath School</option>
                      <option value="Youth Ministries">Youth Ministries (AYS)</option>
                      <option value="Children's Ministries">Children's Ministries (CM)</option>
                      <option value="Family Life">Family Life (FL)</option>
                      <option value="Adventist Women's Ministries">Adventist Women's Ministries (AWM)</option>
                      <option value="Adventist Men's Ministries">Adventist Men's Ministries (AMM)</option>
                      <option value="Health Ministries">Health Ministries (HM)</option>
                      <option value="Education">Education (ED)</option>
                      <option value="Stewardship">Stewardship (STW)</option>
                      <option value="Public Affairs & Religious Liberty">Public Affairs & Religious Liberty (PARL)</option>
                      <option value="Publishing">Publishing (PUB)</option>
                      <option value="Communication">Communication (COM)</option>
                      <option value="Public Campus Ministries">Public Campus Ministries (PCM)</option>
                      <option value="Adventurers">Adventurers (ADV)</option>
                      <option value="Music">Music (MUS)</option>
                      <option value="Deacons">Deacons (DEA)</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Event Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent}>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
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
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No events found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(event.date), 'MMM d, yyyy')}</div>
                          <div className="text-muted-foreground">{event.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`https://macvane.pythonanywhere.com${event.image}`, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event details including image, venue, date, and time.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Event Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-venue">Venue</Label>
              <Input
                id="edit-venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Enter venue location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-department">Department</Label>
              <select
                id="edit-department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="Sabbath School">Sabbath School</option>
                <option value="Youth Ministries">Youth Ministries (AYS)</option>
                <option value="Children's Ministries">Children's Ministries (CM)</option>
                <option value="Family Life">Family Life (FL)</option>
                <option value="Adventist Women's Ministries">Adventist Women's Ministries (AWM)</option>
                <option value="Adventist Men's Ministries">Adventist Men's Ministries (AMM)</option>
                <option value="Health Ministries">Health Ministries (HM)</option>
                <option value="Education">Education (ED)</option>
                <option value="Stewardship">Stewardship (STW)</option>
                <option value="Public Affairs & Religious Liberty">Public Affairs & Religious Liberty (PARL)</option>
                <option value="Publishing">Publishing (PUB)</option>
                <option value="Communication">Communication (COM)</option>
                <option value="Public Campus Ministries">Public Campus Ministries (PCM)</option>
                <option value="Adventurers">Adventurers (ADV)</option>
                <option value="Music">Music (MUS)</option>
                <option value="Deacons">Deacons (DEA)</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Event Image - Optional</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              />
              <p className="text-sm text-muted-foreground">Leave empty to keep current image</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditEvent}>
              <Edit className="w-4 h-4 mr-2" />
              Update Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;