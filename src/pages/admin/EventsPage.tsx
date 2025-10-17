import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Calendar, Eye, Edit, Trash2, Plus, Upload, Users } from 'lucide-react';
import { format } from 'date-fns';

const BASE_URL = 'http://127.0.0.1:8000/form'; // adjust to your Django API base URL

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    department: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/events/list/`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle create
  const handleCreateEvent = async () => {
    const token = localStorage.getItem('access');
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value as any);
    });

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/events/`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsCreateOpen(false);
      fetchEvents();
      setFormData({ title: '', description: '', venue: '', date: '', time: '', department: '', image: null });
    } catch (err) {
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEditEvent = async () => {
    const token = localStorage.getItem('access');
    const form = new FormData();
    form.append('id', selectedEvent.id);
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value as any);
    });

    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/events/`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsEditOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const token = localStorage.getItem('access');
    try {
      await axios.delete(`${BASE_URL}/events/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  // Open Edit Dialog
  const openEditDialog = (event: any) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      venue: event.venue,
      date: event.date,
      time: event.time,
      department: event.department,
      image: null,
    });
    setIsEditOpen(true);
  };

  // Filter events
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Events Management</h1>
        <p className="text-muted-foreground">Create, manage, and update church events.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Events</CardTitle>
          <CardDescription>Upload and organize upcoming church events.</CardDescription>
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
                  <Plus className="w-4 h-4 mr-2" /> Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {['title', 'description', 'venue', 'date', 'time', 'department'].map((field) => (
                    <div key={field} className="grid gap-2">
                      <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      {field === 'description' ? (
                        <Textarea
                          id={field}
                          value={(formData as any)[field]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        />
                      ) : field === 'department' ? (
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="border rounded-md px-3 py-2"
                        >
                          <option value="">Select Department</option>
                          <option value="AYS">Youth Ministries</option>
                          <option value="FL">Family Life</option>
                          <option value="MUS">Music</option>
                        </select>
                      ) : (
                        <Input
                          id={field}
                          type={field === 'date' ? 'date' : field === 'time' ? 'time' : 'text'}
                          value={(formData as any)[field]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                  <div className="grid gap-2">
                    <Label htmlFor="image">Event Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files?.[0] || null })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateEvent} disabled={loading}>
                    <Upload className="w-4 h-4 mr-2" /> {loading ? 'Creating...' : 'Create Event'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event, index) => (
                  <TableRow key={event.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{format(new Date(event.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{event.venue}</TableCell>
                    <TableCell>{event.department}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => alert(`Event ID: ${event.id}`)}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
