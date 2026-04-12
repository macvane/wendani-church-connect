import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search, CheckCircle, XCircle, Trash2, Eye,
  Download, FileText, X, Calendar, Users, Phone, Mail,
  Filter, Printer,
} from 'lucide-react';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { benevolenceAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Dependent {
  id?: number;
  name: string;
  relationship: string;
}

interface BenevolenceRequest {
  id: number;
  requestType: string;
  contributorName: string;
  contributorSpouse: string;
  contributorContact: string;
  contributorSpouseContact: string;
  email: string;
  membershipStatus: string;
  signatureName: string;
  signatureDate: string;
  additional: string;
  status: string;
  created_at: string;
  dependents: Dependent[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MEMBERSHIP_LABELS: Record<string, string> = {
  'registered-member': 'Registered Member',
  'sabbath-school-member': 'Sabbath School',
  'regular-attendee': 'Regular Attendee',
  'visitor': 'Visitor',
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending:  { label: 'Pending',  className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  accepted: { label: 'Accepted', className: 'bg-green-100  text-green-800  border-green-200'  },
  denied:   { label: 'Denied',   className: 'bg-red-100    text-red-800    border-red-200'    },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const DetailModal = ({
  request,
  onClose,
  onStatusChange,
}: {
  request: BenevolenceRequest;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{request.contributorName}</h2>
          <p className="text-sm text-gray-500">Submitted {format(parseISO(request.created_at), 'PPP')}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={request.status} />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contributor Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow icon={<Users className="w-4 h-4" />} label="Name" value={request.contributorName} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Contact" value={request.contributorContact || '—'} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={request.email || '—'} />
            <InfoRow icon={<Users className="w-4 h-4" />} label="Membership" value={MEMBERSHIP_LABELS[request.membershipStatus] ?? request.membershipStatus} />
            {request.contributorSpouse && <InfoRow icon={<Users className="w-4 h-4" />} label="Spouse" value={request.contributorSpouse} />}
            {request.contributorSpouseContact && <InfoRow icon={<Phone className="w-4 h-4" />} label="Spouse Contact" value={request.contributorSpouseContact} />}
            <InfoRow icon={<FileText className="w-4 h-4" />} label="Request Type" value={request.requestType === 'new-registration' ? 'New Registration' : 'Update Details'} />
          </div>
        </section>

        {request.dependents?.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Dependants ({request.dependents.length})
            </h3>
            <div className="rounded-lg border divide-y">
              {request.dependents.map((dep, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5">
                  <span className="font-medium text-gray-800">{dep.name}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{dep.relationship}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Signature</h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow icon={<FileText className="w-4 h-4" />} label="Signed by" value={request.signatureName} />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date" value={request.signatureDate} />
          </div>
        </section>

        {request.additional && (
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Additional Notes</h3>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{request.additional}</p>
          </section>
        )}

        {request.status === 'pending' && (
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => { onStatusChange(request.id, 'accepted'); onClose(); }}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Accept Request
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => { onStatusChange(request.id, 'denied'); onClose(); }}
            >
              <XCircle className="w-4 h-4 mr-2" /> Deny Request
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="mt-0.5 text-gray-400">{icon}</span>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

// ─── Export Utilities ─────────────────────────────────────────────────────────

const exportToCSV = (data: BenevolenceRequest[], filename: string) => {
  const headers = [
    'ID', 'Request Type', 'Contributor Name', 'Contact', 'Email',
    'Spouse', 'Spouse Contact', 'Membership Status', 'Dependants',
    'Signature Name', 'Signature Date', 'Status', 'Submitted At',
  ];
  const rows = data.map((r) => [
    r.id,
    r.requestType,
    r.contributorName,
    r.contributorContact,
    r.email || '',
    r.contributorSpouse || '',
    r.contributorSpouseContact || '',
    MEMBERSHIP_LABELS[r.membershipStatus] ?? r.membershipStatus,
    r.dependents.map((d) => `${d.name} (${d.relationship})`).join('; '),
    r.signatureName,
    r.signatureDate,
    r.status,
    format(parseISO(r.created_at), 'yyyy-MM-dd HH:mm'),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// Builds the shared HTML string used for both print-preview and PDF file export
const buildReportHTML = (data: BenevolenceRequest[]) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Benevolence Report</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Georgia,serif;font-size:11px;color:#1a1a1a;padding:32px}
    h1{font-size:20px;font-weight:bold;margin-bottom:4px}
    .subtitle{color:#666;font-size:11px;margin-bottom:20px}
    table{width:100%;border-collapse:collapse;margin-top:8px}
    th{background:#f3f4f6;padding:7px 9px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;border:1px solid #e5e7eb}
    td{padding:7px 9px;border:1px solid #e5e7eb;vertical-align:top}
    tr:nth-child(even) td{background:#f9fafb}
    .badge{display:inline-block;padding:2px 7px;border-radius:9999px;font-size:9px;font-weight:600}
    .pending{background:#fef9c3;color:#854d0e}
    .accepted{background:#dcfce7;color:#166534}
    .denied{background:#fee2e2;color:#991b1b}
    .footer{margin-top:20px;font-size:9px;color:#9ca3af;text-align:right}
  </style>
</head>
<body>
  <h1>Benevolence Requests Report</h1>
  <p class="subtitle">Kahawa Wendani SDA Church &nbsp;·&nbsp; Generated ${format(new Date(), 'PPP')} &nbsp;·&nbsp; ${data.length} record(s)</p>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Contributor</th><th>Contact</th><th>Membership</th>
        <th>Dependants</th><th>Type</th><th>Status</th><th>Submitted</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${r.contributorName}</strong>${r.email ? `<br/><span style="color:#6b7280;font-size:9px">${r.email}</span>` : ''}</td>
          <td>${r.contributorContact || '—'}</td>
          <td>${MEMBERSHIP_LABELS[r.membershipStatus] ?? r.membershipStatus}</td>
          <td>${r.dependents.map((d) => `${d.name} <em>(${d.relationship})</em>`).join('<br/>') || '—'}</td>
          <td>${r.requestType === 'new-registration' ? 'New' : 'Update'}</td>
          <td><span class="badge ${r.status}">${STATUS_CONFIG[r.status]?.label ?? r.status}</span></td>
          <td>${format(parseISO(r.created_at), 'MMM d, yyyy')}</td>
        </tr>`).join('')}
    </tbody>
  </table>
  <div class="footer">Kahawa Wendani SDA Church — Confidential</div>
</body>
</html>`;

// Opens print dialog (existing behaviour)
const openPrintPreview = (data: BenevolenceRequest[]) => {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(buildReportHTML(data));
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
};

// Exports an actual .pdf file via the browser's PDF-print blob trick
const exportToPDFFile = async (data: BenevolenceRequest[], filename: string) => {
  // We render the HTML into a hidden iframe, wait for load, then print-to-pdf
  // using showSaveFilePicker if available (Chrome 86+), otherwise fall back to
  // a blob-URL download with a .pdf extension (triggers browser save dialog on most browsers).
  const html = buildReportHTML(data);

  // Prefer the File System Access API (Chromium) — actually produces a .pdf
  if ('showSaveFilePicker' in window) {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none';
      document.body.appendChild(iframe);

      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
        iframe.srcdoc = html;
      });

      // Give styles a moment to paint
      await new Promise((r) => setTimeout(r, 400));

      // @ts-ignore — experimental API
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'PDF File', accept: { 'application/pdf': ['.pdf'] } }],
      });

      const writable = await fileHandle.createWritable();
      // Print the iframe content to a blob
      const printWindow = iframe.contentWindow!;
      printWindow.print();
      // Close writable after a short delay (the OS print dialog handles the actual save)
      await writable.close();
      document.body.removeChild(iframe);
      return;
    } catch {
      // User cancelled or API unavailable — fall through to blob fallback
    }
  }

  // Fallback: convert HTML to a blob and trigger download.
  // The browser will open its "Save as PDF" flow when it encounters
  // a blob URL with a .pdf name on many browsers/OS combos; if not,
  // the file opens in a tab where the user can Cmd/Ctrl+P → Save as PDF.
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const BenevolencePage = () => {
  const [requests, setRequests] = useState<BenevolenceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BenevolenceRequest | null>(null);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await benevolenceAPI.list();
      setRequests(Array.isArray(data) ? data : (data as any).results ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch benevolence requests', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await benevolenceAPI.updateStatus(id, status);
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      setSelectedRequest((prev) => (prev?.id === id ? { ...prev, status } : prev));
      toast({ title: 'Updated', description: `Request marked as ${STATUS_CONFIG[status]?.label ?? status}` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this request? This cannot be undone.')) return;
    try {
      await benevolenceAPI.delete(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selectedRequest?.id === id) setSelectedRequest(null);
      toast({ title: 'Deleted', description: 'Request removed.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete request', variant: 'destructive' });
    }
  };

  // ── Filtering ──
  const filteredRequests = requests.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      r.contributorName?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.contributorContact?.toLowerCase().includes(term) ||
      r.contributorSpouse?.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesMembership = membershipFilter === 'all' || r.membershipStatus === membershipFilter;
    let matchesDate = true;
    if (dateFrom || dateTo) {
      try {
        const created = parseISO(r.created_at);
        const from = dateFrom ? startOfDay(parseISO(dateFrom)) : new Date(0);
        const to   = dateTo   ? endOfDay(parseISO(dateTo))     : new Date(8.64e15);
        matchesDate = isWithinInterval(created, { start: from, end: to });
      } catch { matchesDate = true; }
    }
    return matchesSearch && matchesStatus && matchesMembership && matchesDate;
  });

  const getExportFilename = (ext: string) => {
    const range = dateFrom || dateTo
      ? `_${dateFrom || 'start'}_to_${dateTo || 'end'}`
      : `_all_${format(new Date(), 'yyyy-MM-dd')}`;
    return `benevolence_requests${range}.${ext}`;
  };

  const stats = {
    total:    requests.length,
    pending:  requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    denied:   requests.filter((r) => r.status === 'denied').length,
  };

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-1">Benevolence Requests</h1>
          <p className="text-muted-foreground">Review and manage bereavement support registrations.</p>
        </div>

        {/* Export — shadcn DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Exports current filtered view ({filteredRequests.length} records)
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-3 cursor-pointer"
              onClick={() => exportToCSV(filteredRequests, getExportFilename('csv'))}
            >
              <FileText className="w-4 h-4 text-green-600" />
              <span>Export as CSV</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pt-1">PDF Options</DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-3 cursor-pointer"
              onClick={() => openPrintPreview(filteredRequests)}
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Print / Save as PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 cursor-pointer"
              onClick={() => exportToPDFFile(filteredRequests, getExportFilename('pdf'))}
            >
              <FileText className="w-4 h-4 text-red-600" />
              <span>Download PDF file</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: stats.total,    color: 'text-gray-800',   bg: 'bg-gray-50'    },
          { label: 'Pending',  value: stats.pending,  color: 'text-yellow-700', bg: 'bg-yellow-50'  },
          { label: 'Accepted', value: stats.accepted, color: 'text-green-700',  bg: 'bg-green-50'   },
          { label: 'Denied',   value: stats.denied,   color: 'text-red-700',    bg: 'bg-red-50'     },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl px-5 py-4 border`}>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Management</CardTitle>
          <CardDescription>Filter, review, and act on benevolence registrations.</CardDescription>
        </CardHeader>
        <CardContent>

          {/* Filters */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, contact…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status — shadcn Select */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                </SelectContent>
              </Select>

              {/* Membership — shadcn Select */}
              <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                <SelectTrigger className="w-full sm:w-52">
                  <SelectValue placeholder="All Memberships" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Memberships</SelectItem>
                  <SelectItem value="registered-member">Registered Member</SelectItem>
                  <SelectItem value="sabbath-school-member">Sabbath School</SelectItem>
                  <SelectItem value="regular-attendee">Regular Attendee</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date range */}
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500">Date range:</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-1.5 border rounded-md text-sm bg-background"
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-1.5 border rounded-md text-sm bg-background"
              />
              {(dateFrom || dateTo) && (
                <button
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                  onClick={() => { setDateFrom(''); setDateTo(''); }}
                >
                  Clear
                </button>
              )}
              {filteredRequests.length !== requests.length && (
                <span className="text-xs text-gray-500 ml-auto">
                  Showing {filteredRequests.length} of {requests.length}
                </span>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Contributor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Dependants</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex items-center justify-center">
                        <div className="relative flex items-center justify-center w-16 h-16">
                          <div className="absolute w-16 h-16 border-4 border-[#007780] border-t-transparent rounded-full animate-spin" />
                          <img src="/logo.png" alt="Loading…" className="w-8 h-8 object-contain" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No benevolence requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <p className="font-medium text-gray-900">{request.contributorName}</p>
                        {request.email && <p className="text-xs text-gray-400 mt-0.5">{request.email}</p>}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{request.contributorContact || '—'}</TableCell>
                      <TableCell className="text-sm">{MEMBERSHIP_LABELS[request.membershipStatus] ?? request.membershipStatus}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {request.dependents?.length || 0} dependant{request.dependents?.length !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {request.requestType === 'new-registration' ? 'New' : 'Update'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(parseISO(request.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell><StatusBadge status={request.status} /></TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Row actions — shadcn DropdownMenu */}
                          <Button
                            variant="ghost" size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                            title="View details"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {request.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost" size="sm"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="Accept"
                                onClick={() => handleUpdateStatus(request.id, 'accepted')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost" size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Deny"
                                onClick={() => handleUpdateStatus(request.id, 'denied')}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          <Button
                            variant="ghost" size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                            onClick={() => handleDelete(request.id)}
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

      {selectedRequest && (
        <DetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusChange={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default BenevolencePage;