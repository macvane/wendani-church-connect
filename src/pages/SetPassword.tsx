import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import { publicRequest } from '@/utils/api';

const SetPassword = () => {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const rules = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
    { label: 'Passwords match', valid: password.length > 0 && password === confirmPassword },
  ];

  const allValid = rules.every((r) => r.valid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allValid) {
      toast({
        title: 'Invalid password',
        description: 'Please meet all password requirements before continuing.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await publicRequest(`/api/set-password/${uidb64}/${token}/`, {
        method: 'POST',
        body: { password, confirm_password: confirmPassword },
      });

      setIsSuccess(true);
      toast({
        title: 'Password set successfully',
        description: 'Your account is now active. Redirecting to login...',
      });

      setTimeout(() => navigate('/admin/login', { replace: true }), 2500);
    } catch (err: any) {
      toast({
        title: 'Failed to set password',
        description: err?.message || 'The link may be invalid or expired. Please contact your admin.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl bg-white grid grid-cols-1 md:grid-cols-2">

        {/* Left panel — mirrors AdminLogin */}
        <div className="hidden md:flex relative">
          <img
            src="/assets/image (45).jpg"
            alt="Set Password"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70" />
          <div className="absolute bottom-4 left-0 z-10 flex flex-col justify-center px-10 text-white">
            <h2 className="text-3xl font-bold">Set your password</h2>
            <p className="text-white/90 leading-relaxed">
              You've been invited to join the admin portal. Create a strong password to activate your account.
            </p>
          </div>
        </div>

        {/* Right panel */}
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
              <CardTitle className="text-2xl font-serif">Create password</CardTitle>
              <CardDescription>Set a password for your new account</CardDescription>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                  <p className="font-medium text-gray-800">Password set successfully!</p>
                  <p className="text-sm text-muted-foreground">Redirecting you to login...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* New password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">New password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Password rules */}
                  <div className="rounded-md border bg-muted/30 p-3 space-y-1.5">
                    {rules.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2 text-sm">
                        {rule.valid ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className={rule.valid ? 'text-green-700' : 'text-muted-foreground'}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={isLoading || !allValid}
                  >
                    {isLoading ? 'Setting password...' : 'Set password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;