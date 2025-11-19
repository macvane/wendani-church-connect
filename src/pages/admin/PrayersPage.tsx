import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Download,
  MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { prayerAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// ---------------------------
// CONFIG: replace with real elder/pastor phone (intl format)
// ---------------------------
const ELDER_PHONE = '254700000000'; // <-- replace with elder/pastor phone (e.g. 254712345678 or +254712345678)
// Also set a sender name that appears in the WhatsApp message
const SENDER_NAME = 'Pastor (Kahawa Wendani)';

interface Prayer {
  id: number;
  full_name: string | null;
  email: string | null;
  phone_number: string | number | null;
  prayer_type: string;
  prayer_request: string;
  wants_visitation: boolean;
  prayer_cell: string | null;
  general_area: string | null;
  visitation_method: string | null;
  status: string;
  created_at: string;
  // allow extra fields if backend extends model
  [key: string]: any;
}

const PrayersPage = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'visitation'>('all');
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [waMessageTemplate, setWaMessageTemplate] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPrayers();
  }, []);

  // initialize template when selectedPrayer changes
  useEffect(() => {
    if (selectedPrayer) {
      const excerpt = selectedPrayer.prayer_request?.slice(0, 140).replace(/\n/g, ' ');
      const defaultMsg = `Hello ${selectedPrayer.full_name || ''},\n\nThis is ${SENDER_NAME}. We received your prayer request (${selectedPrayer.prayer_type}).\n\n"${excerpt}${excerpt && excerpt.length >= 140 ? '...' : ''}"\n\nWe will be in touch shortly.`;
      setWaMessageTemplate(defaultMsg);
    } else {
      setWaMessageTemplate('');
    }
  }, [selectedPrayer]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const response = await prayerAPI.list();
      if (response.ok) {
        const data = await response.json();
        setPrayers(data.results || []);
      } else {
        toast({ title: 'Error', description: 'Failed to fetch prayer requests', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to fetch prayer requests', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await prayerAPI.update(id, { status: 'read' });
      if (response.ok) {
        setPrayers(prev => prev.map(p => (p.id === id ? { ...p, status: 'read' } : p)));
        toast({ title: 'Success', description: 'Prayer request marked as read' });
      } else {
        toast({ title: 'Error', description: 'Failed to update prayer request', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update prayer request', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;
    try {
      const response = await prayerAPI.delete(id);
      if (response.ok) {
        setPrayers(prev => prev.filter(p => p.id !== id));
        toast({ title: 'Deleted', description: 'Prayer request deleted successfully' });
      } else {
        toast({ title: 'Error', description: 'Failed to delete prayer request', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to delete prayer request', variant: 'destructive' });
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await prayerAPI.detail(id);
      if (response.ok) {
        const data = await response.json();
        setSelectedPrayer(data);
      } else {
        toast({ title: 'Error', description: 'Failed to fetch prayer request details', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to fetch prayer request details', variant: 'destructive' });
    }
  };

  // ---------- Filtering ----------
  const filteredPrayers = prayers.filter(p => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (p.full_name && String(p.full_name).toLowerCase().includes(q)) ||
      (p.email && String(p.email).toLowerCase().includes(q)) ||
      (p.prayer_request && String(p.prayer_request).toLowerCase().includes(q));
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'visitation' && p.wants_visitation) ||
      (statusFilter === 'unread' && p.status === 'unread') ||
      (statusFilter === 'read' && p.status === 'read');
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="w-3 h-3" />Unread</Badge>;
      case 'read':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Read</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // ------------------------------
  // WhatsApp helpers
  // ------------------------------
  function normalizePhoneForWhatsApp(raw: string | number | null | undefined) {
    if (!raw) return null;
    let s = String(raw).trim();
    // remove spaces, dashes, parentheses
    s = s.replace(/[\s\-()]/g, '');
    // if begins with +, drop plus
    if (s.startsWith('+')) s = s.slice(1);
    // if starts with '0' and length 10 (eg 07XXXXXXXX) -> assume Kenya, replace 0 with 254
    if (/^0\d{8,9}$/.test(s)) {
      return '254' + s.slice(1);
    }
    // if local 9 digits (e.g. 7XXXXXXXX) -> assume Kenya
    if (/^\d{9}$/.test(s)) {
      return '254' + s;
    }
    // if it already starts with country code (e.g., 254...) return as-is
    if (/^\d{11,}$/.test(s)) {
      return s;
    }
    // fallback: return as-is
    return s;
  }

  function openWhatsApp(toPhoneRaw: string | number | null | undefined, message: string) {
    const normalized = normalizePhoneForWhatsApp(toPhoneRaw);
    if (!normalized) {
      toast({ title: 'No phone', description: 'No valid phone number available', variant: 'destructive' });
      return;
    }
    // encode message
    const encoded = encodeURIComponent(message);
    // use web.whatsapp.com link (works on mobile too, browser will redirect)
    const waUrl = `https://wa.me/${normalized}?text=${encoded}`;
    window.open(waUrl, '_blank');
  }

  // Click handlers for WhatsApp
  const handleWhatsAppMember = () => {
    if (!selectedPrayer) return;
    const phone = selectedPrayer.phone_number;
    if (!phone) {
      toast({ title: 'Missing phone', description: 'This prayer request has no phone number', variant: 'destructive' });
      return;
    }
    openWhatsApp(phone, waMessageTemplate);
  };

  const handleWhatsAppElder = () => {
    if (!selectedPrayer) return;
    // elder phone from config
    if (!ELDER_PHONE) {
      toast({ title: 'Elder phone not configured', description: 'Please set ELDER_PHONE in code', variant: 'destructive' });
      return;
    }
    const msgToElder = `Visitation request (ID: ${selectedPrayer.id})\nName: ${selectedPrayer.full_name || 'N/A'}\nType: ${selectedPrayer.prayer_type}\nVisitation: ${selectedPrayer.wants_visitation ? 'Yes' : 'No'}\nArea: ${selectedPrayer.general_area || 'N/A'}\nPrayer excerpt: "${(selectedPrayer.prayer_request || '').slice(0, 140)}"`;
    openWhatsApp(ELDER_PHONE, msgToElder);
  };

  // ------------------------------
  // CSV export helpers
  // ------------------------------
  function convertToCSV(rows: Prayer[]) {
    if (!rows || rows.length === 0) return '';
    const headers = [
      'id',
      'full_name',
      'email',
      'phone_number',
      'prayer_type',
      'prayer_request',
      'wants_visitation',
      'prayer_cell',
      'general_area',
      'visitation_method',
      'status',
      'created_at',
    ];
    const escapeCell = (val: any) => {
      if (val === null || val === undefined) return '';
      const s = String(val).replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/"/g, '""');
      // wrap in quotes if comma/newline/quote present
      return `"${s}"`;
    };
    const csvRows = [headers.join(',')];
    rows.forEach(r => {
      const row = headers.map(h => escapeCell(r[h])).join(',');
      csvRows.push(row);
    });
    return csvRows.join('\n');
  }

  function downloadCSV(rows: Prayer[], filenamePrefix = 'prayer-requests') {
    const csv = convertToCSV(rows);
    if (!csv) {
      toast({ title: 'No data', description: 'No rows to export', variant: 'destructive' });
      return;
    }
    const date = format(new Date(), 'yyyy-MM-dd');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filenamePrefix}-${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'CSV download started' });
  }

  // convenience exports
  const exportAll = () => downloadCSV(prayers, 'prayer-requests-all');
  const exportVisitation = () => downloadCSV(prayers.filter(p => p.wants_visitation), 'prayer-requests-visitation');
  const exportUnread = () => downloadCSV(prayers.filter(p => p.status === 'unread'), 'prayer-requests-unread');

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-2">Prayer Requests</h1>
      <p className="text-muted-foreground mb-6">Manage and respond to prayer requests submitted through the website.</p>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or prayer request..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="visitation">Visitation</option>
          </select>

          <Button onClick={fetchPrayers} variant="ghost">Refresh</Button>

          {/* CSV export group */}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={exportAll} title="Export all">
              <Download className="w-4 h-4 mr-1" />Export All
            </Button>
            <Button size="sm" onClick={exportVisitation} title="Export visitation only">
              <Download className="w-4 h-4 mr-1" />Export Visitation
            </Button>
            <Button size="sm" onClick={exportUnread} title="Export unread only">
              <Download className="w-4 h-4 mr-1" />Export Unread
            </Button>
          </div>
        </div>
      </div>

      {/* Cards grid (single-column list for readability) */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className="absolute w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <img src="/logo.png" alt="Loading..." className="w-12 h-12 object-contain" />
            </div>
          </div>
        ) : filteredPrayers.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No prayer requests found.</p>
        ) : (
          filteredPrayers.map(p => (
            <Card key={p.id} className={`hover:shadow-md transition-shadow ${p.wants_visitation ? 'border-l-4 border-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold mb-1 flex items-center gap-3">
                      <span className="truncate">{p.full_name || 'Anonymous'}</span>
                      {p.wants_visitation && <Badge className="bg-blue-100 text-blue-800">Visitation</Badge>}
                    </CardTitle>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {p.email && (<span className="flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</span>)}
                      {p.phone_number && (<span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone_number}</span>)}
                      {p.prayer_cell && (<span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.prayer_cell}</span>)}
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    {getStatusBadge(p.status)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Type: {p.prayer_type}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.prayer_request}</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{format(new Date(p.created_at), 'MMM d, yyyy • h:mm a')}</span>

                  <div className="flex gap-2">
                    {p.status === 'unread' && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(p.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" />Mark Read
                      </Button>
                    )}
                    <Button size="sm" onClick={() => handleViewDetails(p.id)}>
                      <Eye className="w-4 h-4 mr-1" />View
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      // quick-whatsapp member directly from card (if phone present)
                      if (!p.phone_number) {
                        toast({ title: 'No phone', description: 'No phone number on this request', variant: 'destructive' });
                        return;
                      }
                      const excerpt = (p.prayer_request || '').slice(0, 120).replace(/\n/g, ' ');
                      const msg = `Hello ${p.full_name || ''},\n\nThis is ${SENDER_NAME}. We received your prayer request (${p.prayer_type}).\n\n"${excerpt}${excerpt.length >= 120 ? '...' : ''}"\n\nWe'll be in touch.`;
                      openWhatsApp(p.phone_number, msg);
                    }}>
                      <MessageCircle className="w-4 h-4 mr-1" />WhatsApp
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedPrayer} onOpenChange={() => setSelectedPrayer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4">
              <span>{selectedPrayer?.full_name || 'Anonymous Prayer Request'}</span>
              {selectedPrayer && getStatusBadge(selectedPrayer.status)}
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedPrayer && format(new Date(selectedPrayer.created_at), 'MMMM d, yyyy • h:mm a')}
            </DialogDescription>
          </DialogHeader>

          {selectedPrayer && (
            <div className="space-y-6 pt-4">
              {/* Contact */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">Contact</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedPrayer.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedPrayer.phone_number || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Request */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">Prayer Request</h3>
                <Badge className="mb-3">{selectedPrayer.prayer_type}</Badge>
                <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-md whitespace-pre-wrap">{selectedPrayer.prayer_request}</p>
              </div>

              {/* Visitation */}
              {selectedPrayer.wants_visitation && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Visitation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="text-sm">
                        <div className="font-medium">Prayer Cell</div>
                        <div className="text-muted-foreground">{selectedPrayer.prayer_cell || 'Not specified'}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">General Area</div>
                        <div className="text-muted-foreground">{selectedPrayer.general_area || 'Not specified'}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Method</div>
                        <div className="text-muted-foreground">
                          {selectedPrayer.visitation_method === 'call' ? 'Call with Pastor' : 'Visit at Home'}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Submitted</div>
                        <div className="text-muted-foreground">{format(new Date(selectedPrayer.created_at), 'PPP p')}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* WhatsApp message editor + actions */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">WhatsApp Message</h3>
                <textarea
                  value={waMessageTemplate}
                  onChange={(e) => setWaMessageTemplate(e.target.value)}
                  rows={6}
                  className="w-full p-3 border rounded-md"
                />
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={handleWhatsAppMember}>
                    <MessageCircle className="w-4 h-4 mr-1" />WhatsApp Member
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleWhatsAppElder}>
                    <MessageCircle className="w-4 h-4 mr-1" />WhatsApp Elder
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => {
                    // copy message to clipboard
                    navigator.clipboard.writeText(waMessageTemplate || '').then(() => {
                      toast({ title: 'Copied', description: 'Message copied to clipboard' });
                    }).catch(() => {
                      toast({ title: 'Error', description: 'Unable to copy', variant: 'destructive' });
                    });
                  }}>
                    Copy Message
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrayersPage;
