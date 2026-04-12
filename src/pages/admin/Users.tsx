import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UserCog, Plus, Search, MoreHorizontal, Shield, ShieldOff,
  Trash2, Mail, RefreshCw, Edit2, CheckCircle, XCircle, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { userManagementAPI, SystemUser, InviteUserPayload } from '@/utils/api';

/* ── helpers ──────────────────────────────────────────────── */

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  elder: 'Elder',
  treasurer: 'Treasurer',
};

const ROLE_COLORS: Record<string, string> = {
  superadmin: 'bg-church-100 text-church-700 border-church-200',
  admin:      'bg-blue-50 text-blue-700 border-blue-200',
  elder:      'bg-amber-50 text-amber-700 border-amber-200',
  treasurer:  'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const initials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const avatarColor = (name = '') => {
  const colors = [
    'bg-church-500', 'bg-blue-500', 'bg-violet-500',
    'bg-amber-500', 'bg-emerald-500', 'bg-rose-500',
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

/* ── empty invite form ────────────────────────────────────── */

const emptyInvite = (): InviteUserPayload => ({
  email: '', full_name: '', phone_number: '', role: 'elder',
});

/* ── component ────────────────────────────────────────────── */

export default function Users() {
  const qc = useQueryClient();
  const { toast } = useToast();

  /* state */
  const [search, setSearch]               = useState('');
  const [roleFilter, setRoleFilter]       = useState<string>('all');
  const [statusFilter, setStatusFilter]   = useState<string>('all');
  const [inviteOpen, setInviteOpen]       = useState(false);
  const [editUser, setEditUser]           = useState<SystemUser | null>(null);
  const [deleteUser, setDeleteUser]       = useState<SystemUser | null>(null);
  const [inviteForm, setInviteForm]       = useState<InviteUserPayload>(emptyInvite());
  const [editForm, setEditForm]           = useState<Partial<SystemUser>>({});

  /* queries */
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userManagementAPI.list(),
  });

  /* mutations */
  const inviteMut = useMutation({
    mutationFn: (data: InviteUserPayload) => userManagementAPI.invite(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Invitation sent', description: res.message });
      setInviteOpen(false);
      setInviteForm(emptyInvite());
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const updateMut = useMutation({
    mutationFn: ({ pk, data }: { pk: number; data: Partial<SystemUser> }) =>
      userManagementAPI.patch(pk, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User updated', description: res.message });
      setEditUser(null);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMut = useMutation({
    mutationFn: (pk: number) => userManagementAPI.delete(pk),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'User deleted', description: res.message });
      setDeleteUser(null);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const resendMut = useMutation({
    mutationFn: (pk: number) => userManagementAPI.resendInvitation(pk),
    onSuccess: (res) => toast({ title: 'Invitation resent', description: res.message }),
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const toggleActiveMut = useMutation({
    mutationFn: ({ pk, active }: { pk: number; active: boolean }) =>
      active ? userManagementAPI.activate(pk) : userManagementAPI.deactivate(pk),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Status updated', description: res.message });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  /* derived */
  const filtered = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'all'   || u.role === roleFilter;
    const matchStatus =
      statusFilter === 'all'      ? true :
      statusFilter === 'active'   ? u.is_active :
      statusFilter === 'inactive' ? !u.is_active :
      statusFilter === 'pending'  ? !u.is_email_verified : true;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total:    users.length,
    active:   users.filter((u) => u.is_active).length,
    inactive: users.filter((u) => !u.is_active).length,
    pending:  users.filter((u) => !u.is_email_verified).length,
  };

  /* open edit modal */
  const openEdit = (u: SystemUser) => {
    setEditUser(u);
    setEditForm({
      full_name: u.full_name,
      phone_number: u.phone_number,
      role: u.role,
      is_active: u.is_active,
      is_email_verified: u.is_email_verified,
    });
  };

  return (
    <div className="space-y-6 p-6">

      {/* ── page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage system access, roles, and invitations
          </p>
        </div>
        <Button
          onClick={() => setInviteOpen(true)}
          className="bg-church-600 hover:bg-church-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" /> Invite User
        </Button>
      </div>

      {/* ── stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',   value: stats.total,    color: 'text-foreground',       bg: 'bg-muted/50' },
          { label: 'Active',        value: stats.active,   color: 'text-emerald-600',      bg: 'bg-emerald-50' },
          { label: 'Inactive',      value: stats.inactive, color: 'text-destructive',      bg: 'bg-destructive/5' },
          { label: 'Pending Setup', value: stats.pending,  color: 'text-amber-600',        bg: 'bg-amber-50' },
        ].map((s) => (
          <Card key={s.label} className={`border-border/50 ${s.bg}`}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {Object.entries(ROLE_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending setup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── table ── */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Loading users...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
              <UserCog className="h-8 w-8 opacity-30" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pl-6">
                    User
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Role
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                    Joined
                  </TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id} className="border-border/50 hover:bg-muted/30">
                    {/* user cell */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(u.full_name)}`}>
                          {initials(u.full_name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-none">
                            {u.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                          {u.phone_number && (
                            <p className="text-xs text-muted-foreground">{u.phone_number}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    {/* role */}
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[u.role] || 'bg-muted text-muted-foreground border-border'}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </TableCell>
                    {/* status */}
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        {!u.is_email_verified ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                            <Clock className="h-3 w-3" /> Pending setup
                          </span>
                        ) : u.is_active ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-destructive">
                            <XCircle className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </div>
                    </TableCell>
                    {/* joined */}
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </TableCell>
                    {/* actions */}
                    <TableCell className="pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => openEdit(u)} className="gap-2 cursor-pointer">
                            <Edit2 className="h-3.5 w-3.5" /> Edit user
                          </DropdownMenuItem>
                          {!u.is_email_verified && (
                            <DropdownMenuItem
                              onClick={() => resendMut.mutate(u.id)}
                              className="gap-2 cursor-pointer"
                            >
                              <RefreshCw className="h-3.5 w-3.5" /> Resend invitation
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {u.is_active ? (
                            <DropdownMenuItem
                              onClick={() => toggleActiveMut.mutate({ pk: u.id, active: false })}
                              className="gap-2 cursor-pointer text-amber-600 focus:text-amber-600"
                            >
                              <ShieldOff className="h-3.5 w-3.5" /> Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => toggleActiveMut.mutate({ pk: u.id, active: true })}
                              className="gap-2 cursor-pointer text-emerald-600 focus:text-emerald-600"
                            >
                              <Shield className="h-3.5 w-3.5" /> Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteUser(u)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── invite dialog ── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Invite New User</DialogTitle>
            <DialogDescription>
              They will receive an email with a link to set their password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="inv-name">Full name</Label>
              <Input
                id="inv-name"
                placeholder="Jane Doe"
                value={inviteForm.full_name}
                onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-email">Email address</Label>
              <Input
                id="inv-email"
                type="email"
                placeholder="jane@church.org"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inv-phone">Phone number</Label>
              <Input
                id="inv-phone"
                placeholder="+254700000000"
                value={inviteForm.phone_number}
                onChange={(e) => setInviteForm({ ...inviteForm, phone_number: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(v) => setInviteForm({ ...inviteForm, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="elder">Elder</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button
              className="bg-church-600 hover:bg-church-700 text-white gap-2"
              disabled={inviteMut.isPending}
              onClick={() => inviteMut.mutate(inviteForm)}
            >
              <Mail className="h-4 w-4" />
              {inviteMut.isPending ? 'Sending...' : 'Send invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── edit dialog ── */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Edit User</DialogTitle>
            <DialogDescription>
              Update details for {editUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input
                value={editForm.full_name || ''}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone number</Label>
              <Input
                value={editForm.phone_number || ''}
                onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={editForm.role || ''}
                onValueChange={(v) => setEditForm({ ...editForm, role: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="elder">Elder</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Account status</Label>
              <Select
                value={editForm.is_active ? 'active' : 'inactive'}
                onValueChange={(v) => setEditForm({ ...editForm, is_active: v === 'active' })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button
              className="bg-church-600 hover:bg-church-700 text-white"
              disabled={updateMut.isPending}
              onClick={() => editUser && updateMut.mutate({ pk: editUser.id, data: editForm })}
            >
              {updateMut.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── delete confirmation ── */}
      <AlertDialog open={!!deleteUser} onOpenChange={(o) => !o && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteUser?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove their account and cannot be undone.
              Consider deactivating instead to preserve records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => deleteUser && deleteMut.mutate(deleteUser.id)}
            >
              {deleteMut.isPending ? 'Deleting...' : 'Yes, delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}