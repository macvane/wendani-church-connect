import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserCog, Send, Loader2 } from 'lucide-react';
import { privateRequest } from '@/utils/api';

interface InviteForm {
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
}

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'elder', label: 'Elder' },
  { value: 'treasurer', label: 'Treasurer' },
];

const InviteUser = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<InviteForm>({
    email: '',
    full_name: '',
    phone_number: '',
    role: '',
  });

  const handleChange = (field: keyof InviteForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.full_name || !form.phone_number || !form.role) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields before sending the invite.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await privateRequest('/api/invite/', {
        method: 'POST',
        body: form,
      });

      toast({
        title: 'Invite sent',
        description: `An invitation email has been sent to ${form.email}.`,
      });

      setForm({ email: '', full_name: '', phone_number: '', role: '' });
    } catch (err: any) {
      toast({
        title: 'Failed to send invite',
        description: err?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Invite User</h1>
        <p className="text-muted-foreground">
          Send an invitation to a new admin, elder, or treasurer to join the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-church-50">
                <UserCog className="h-5 w-5 text-church-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-serif">New Invitation</CardTitle>
                <CardDescription>
                  The user will receive an email with a link to set their password.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="e.g. John Doe"
                  value={form.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. john@church.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  placeholder="e.g. 0712345678"
                  value={form.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => handleChange('role', val)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-church-600 hover:bg-church-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Role Permissions</CardTitle>
            <CardDescription>What each role can do in the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                role: 'Superadmin',
                color: 'bg-church-50 text-church-700',
                perms: 'Full access. Can invite users and manage everything.',
              },
              {
                role: 'Admin',
                color: 'bg-blue-50 text-blue-700',
                perms: 'Manage prayers, baptisms, dedications, memberships, announcements, and events.',
              },
              {
                role: 'Elder',
                color: 'bg-purple-50 text-purple-700',
                perms: 'View and manage ministry requests and membership transfers.',
              },
              {
                role: 'Treasurer',
                color: 'bg-mpesa-50 text-mpesa-700',
                perms: 'Access to treasurer dashboard and financial records only.',
              },
            ].map((item) => (
              <div key={item.role} className="flex gap-3 items-start">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md shrink-0 ${item.color}`}>
                  {item.role}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.perms}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InviteUser;