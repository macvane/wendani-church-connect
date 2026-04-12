import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LogOut, User, Bell, Search, KeyRound, ChevronDown, Settings,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/utils/api';

const initials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

export function AdminHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user, role } = useAuth();

  const [logoutOpen, setLogoutOpen]         = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);

  const [oldPassword, setOldPassword]           = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [changingPass, setChangingPass]         = useState(false);

  const handleLogout = async () => {
    navigate('/admin/login');
    await logout();
    toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: 'Password too short', description: 'Minimum 8 characters.', variant: 'destructive' });
      return;
    }
    setChangingPass(true);
    try {
      await authAPI.changePassword(oldPassword, newPassword);
      toast({ title: 'Password changed', description: 'Your password has been updated.' });
      setChangePassOpen(false);
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      toast({ title: 'Failed', description: e.message || 'Could not change password.', variant: 'destructive' });
    } finally {
      setChangingPass(false);
    }
  };

  const displayName = user?.full_name || 'Admin User';
  const displayRole = role || 'Administrator';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6 shadow-sm">
        {/* left */}
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="text-muted-foreground hover:text-church-600" />
          <div className="h-6 w-[1px] bg-border mx-2 hidden md:block" />
          <div className="relative max-w-sm w-full hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search records..."
              className="pl-9 bg-muted/50 border-none h-9 focus-visible:ring-church-600"
            />
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-church-600">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
          </Button>

          <div className="flex items-center gap-3 pl-2 ml-2 border-l border-border">
            {/* name + role — hidden on small screens */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold leading-none text-foreground">
                {displayName}
              </span>
              <span className="text-[11px] text-muted-foreground capitalize mt-0.5">
                {displayRole}
              </span>
            </div>

            {/* avatar + dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 gap-1.5 pl-1 pr-2 rounded-full hover:bg-church-50 focus-visible:ring-church-600"
                >
                  <div className="h-7 w-7 rounded-full bg-church-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials(displayName)}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                {/* identity header */}
                <div className="px-3 py-2 border-b border-border/50">
                  <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <DropdownMenuItem
                  className="gap-2 cursor-pointer mt-1"
                  onClick={() => setChangePassOpen(true)}
                >
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  Change password
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => setLogoutOpen(true)}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ── logout confirm ── */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end your current session? You will need to log in again to access the admin area.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-church-600 hover:bg-church-700 text-white"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── change password modal ── */}
      <Dialog open={changePassOpen} onOpenChange={(o) => {
        if (!o) { setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }
        setChangePassOpen(o);
      }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-church-600" /> Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="old-pass">Current password</Label>
              <Input
                id="old-pass"
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-pass">New password</Label>
              <Input
                id="new-pass"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-pass">Confirm new password</Label>
              <Input
                id="confirm-pass"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePassOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-church-600 hover:bg-church-700 text-white"
              disabled={changingPass || !oldPassword || !newPassword || newPassword !== confirmPassword}
              onClick={handleChangePassword}
            >
              {changingPass ? 'Updating...' : 'Update password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}