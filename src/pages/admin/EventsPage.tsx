// Full redesigned EventsPage using Card layout
// Note: Replace placeholder image path if needed

import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Eye, Edit, Trash2, Plus, ImagePlus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { eventAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  venue: string;
  date: string | null;
  from_date: string | null;
  to_date: string | null;
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
  const [isCreating, setIsCreating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', venue: '', date: '', from_date: '', to_date: '',
    time: '', department: 'SSPM', image: null as File | null,
  });
  const { toast } = useToast();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.list();
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch events', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const filteredEvents = events.filter((event) =>
    [event.title, event.description, event.venue]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateEvent = async () => {
    const { title, description, venue, time, department, image } = formData;
    if (!title || !description || !venue || !time || !department) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => { if (v) data.append(k, v as any); });

    try {
      setIsCreating(true);
      const response = await eventAPI.create(data);
      if (response.ok) {
        toast({ title: 'Success', description: 'Event created successfully' });
        fetchEvents();
        setIsCreateOpen(false);
        resetForm();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to create event', variant: 'destructive' });
    } finally { setIsCreating(false); }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent) return;

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => { if (v !== null) data.append(k, v as any); });

    try {
      const response = await eventAPI.update(selectedEvent.slug, data);
      if (response.ok) {
        toast({ title: 'Success', description: 'Event updated successfully' });
        fetchEvents();
        setIsEditOpen(false);
        resetForm();
      } else {
        toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update event', variant: 'destructive' });
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await eventAPI.delete(slug);
      if (response.ok) {
        toast({ title: 'Success', description: 'Event deleted successfully' });
        fetchEvents();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
    }
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      venue: event.venue,
      date: event.date || '',
      from_date: event.from_date || '',
      to_date: event.to_date || '',
      time: event.time,
      department: event.department,
      image: null,
    });
    setImagePreview(event.image 
    ? `https://churchmedia.kahawawendanisda.org${event.image}` 
    : null
    );
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', venue: '', date: '', from_date: '', to_date: '', time: '', department: 'SSPM', image: null });
  };

  const departmentOptions = [
    ['SSPM', 'Sabbath School'], ['PM', 'Personal Ministries'], ['YM', 'Youth Ministries'],
    ['CM', 'Children’s Ministries'], ['FM', 'Family Ministries'], ['AWM', 'Women’s Ministries'],
    ['AMM', 'Men’s Ministries'], ['HM', 'Health Ministries'], ['EDU', 'Education Department'],
    ['STW', 'Stewardship Ministries'], ['PARL', 'Public Affairs & Religious Liberty'],
    ['PUB', 'Publishing Ministries'], ['COM', 'Communication Department'], ['MIN', 'Ministerial Association'],
    ['CHAP', 'Adventist Chaplaincy Ministries'], ['MIS', 'Adventist Mission'], ['PCM', 'Public Campus Ministries'],
    ['MUS', 'Music Ministry'], ['ADV', 'Adventurers Club'], ['PATH', 'Pathfinder Club'], ['DEA', 'Deacons / Deaconesses'],
    ['ADRA', 'ADRA'], ['POS', 'Possibility Ministries'],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Events Management</h1>
        <p className="text-muted-foreground">Create, manage, and track church events.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Management</CardTitle>
          <CardDescription>Organize and track church events easily.</CardDescription>
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

            {/* CREATE DIALOG */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Create Event
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>Add event details below.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <Label>Event Title</Label>
                  <Input value={formData.title} placeholder='Event Title' onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

                  <Label>Description</Label>
                  <Textarea rows={3} value={formData.description} placeholder='Details of the event' onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                  <Label>Venue</Label>
                  <Input value={formData.venue} placeholder='Location of the event' onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />

                  <Label>Date (Single-day)</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>From Date</Label>
                      <Input type="date" value={formData.from_date} onChange={(e) => setFormData({ ...formData, from_date: e.target.value })} />
                    </div>
                    <div>
                      <Label>To Date</Label>
                      <Input type="date" value={formData.to_date} onChange={(e) => setFormData({ ...formData, to_date: e.target.value })} />
                    </div>
                  </div>

                  <Label>Time</Label>
                  <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />

                  <Label>Department</Label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    {departmentOptions.map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>

                  <Label>Event Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, image: file });
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {imagePreview && (
                    <div className='aspect-video border border-dashed border-primary rounded-md p-2'>
                      <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-md border"
                    />
                    </div>
                  )}

                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateEvent} disabled={isCreating}>
                    {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><ImagePlus className="w-4 h-4 mr-2" /> Create Event</>}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* CARD GRID */}
          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : filteredEvents.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.slug} className="overflow-hidden border rounded-xl shadow-sm">
                  <div className="h-48 bg-muted overflow-hidden">
                    <img
                      src={`https://churchmedia.kahawawendanisda.org${event.image}`}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-xl font-semibold">{event.title}</h3>

                    <p className="text-sm text-muted-foreground">
                      {event.date
                        ? format(new Date(event.date), 'MMM d, yyyy')
                        : `${format(new Date(event.from_date || ''), 'MMM d')} - ${format(new Date(event.to_date || ''), 'MMM d, yyyy')}`}
                    </p>

                    <p className="text-sm font-medium text-muted-foreground">📍 {event.venue}</p>

                    <div className="flex justify-between pt-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(`https://kahawawendanisda.org/events/${event.slug}`, '_blank')}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>

                      <Button size="sm" variant="outline" onClick={() => openEditDialog(event)}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>

                      <Button size="sm" variant="destructive" onClick={() => handleDelete(event.slug)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Label>Title</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

            <Label>Description</Label>
            <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

            <Label>Venue</Label>
            <Input value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />

            <Label>Date (Single-day)</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From Date</Label>
                <Input type="date" value={formData.from_date} onChange={(e) => setFormData({ ...formData, from_date: e.target.value })} />
              </div>
              <div>
                <Label>To Date</Label>
                <Input type="date" value={formData.to_date} onChange={(e) => setFormData({ ...formData, to_date: e.target.value })} />
              </div>
            </div>

            <Label>Time</Label>
            <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />

            <Label>Department</Label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {departmentOptions.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>

            <Label>Event Image (optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData({ ...formData, image: file });
                setImagePreview(
                  file ? URL.createObjectURL(file) : imagePreview
                );
              }}
            />
            {imagePreview && (
                    <div className='aspect-video border border-dashed border-primary rounded-md p-2'>
                      <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-md border"
                    />
                    </div>
                  )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditEvent}>Update Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;
