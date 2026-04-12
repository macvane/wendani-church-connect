import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { passwordResetAPI } from '@/utils/api';

const ResetPassword = () => {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword]           = useState('');
  const [confirm, setConfirm]             = useState('');
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [isLoading, setLoading]           = useState(false);
  const [done, setDone]                   = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;
  const weak     = password.length > 0 && password.length < 8;
  const canSubmit = password.length >= 8 && password === confirm && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uidb64 || !token) return;
    setLoading(true);
    try {
      const res = await passwordResetAPI.resetPassword(uidb64, token, password, confirm);
      setDone(true);
      toast({ title: 'Password reset', description: res.message });
    } catch (err: any) {
      toast({ title: 'Reset failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl bg-white grid grid-cols-1 md:grid-cols-2">
        {/* left panel */}
        <div className="hidden md:flex relative">
          <img
            src="/assets/image (45).jpg"
            alt="Church"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70" />
          <div className="absolute bottom-4 left-0 z-10 flex flex-col justify-center px-10 text-white">
            <h2 className="text-3xl font-bold">
              {done ? 'All done!' : 'Set New Password'}
            </h2>
            <p className="text-white/90 leading-relaxed">
              {done
                ? 'Your password has been changed. You can now log in.'
                : 'Choose a strong password you havent used before.'}
            </p>
          </div>
        </div>

        {/* right panel */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <Card className="w-full max-w-md border-none shadow-none">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Link to="/" className="inline-flex items-center space-x-2">
                  <img
                    src="/new-logo.png"
                    alt="Kahawa Wendani SDA Church Logo"
                    className="h-[3rem] md:h-[4rem] object-contain"
                  />
                </Link>
              </div>
              <CardTitle className="text-2xl font-serif">
                {done ? 'Password updated' : 'Reset your password'}
              </CardTitle>
              <CardDescription>
                {done ? 'You can now log in with your new password' : 'Enter a new password for your account'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {done ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center gap-3 py-4">
                    <div className="h-16 w-16 rounded-full bg-church-50 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-church-600" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Your password has been reset successfully.
                    </p>
                  </div>
                  <Button
                    className="w-full bg-church-600 hover:bg-church-700 text-white"
                    onClick={() => navigate('/admin/login')}
                  >
                    Go to login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* new password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">New password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button" variant="ghost" size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPass(!showPass)}
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {weak && (
                      <p className="text-xs text-destructive">Password must be at least 8 characters</p>
                    )}
                  </div>

                  {/* confirm */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm new password</Label>
                    <div className="relative">
                      <Input
                        id="confirm"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                      />
                      <Button
                        type="button" variant="ghost" size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {mismatch && (
                      <p className="text-xs text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-church-600 hover:bg-church-700 text-white mt-2"
                    disabled={!canSubmit}
                  >
                    {isLoading ? 'Resetting...' : 'Reset password'}
                  </Button>

                  <Link to="/admin/login">
                    <Button type="button" variant="ghost" className="w-full gap-2 mt-1">
                      <ArrowLeft className="h-4 w-4" /> Back to login
                    </Button>
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;