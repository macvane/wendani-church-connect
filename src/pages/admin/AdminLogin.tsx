import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { authAPI } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://churchmedia.kahawawendanisda.org';

const AdminLogin = () => {
  const { refreshCurrentUser } = useAuth();
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpReference, setOtpReference] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const storeSessionAndRedirect = async (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('isAdminLoggedIn', 'true');

    // Let AuthContext bootstrap itself with the new tokens
    await refreshCurrentUser();

    // Navigate AFTER context has updated
    const userRole = localStorage.getItem('user_role');
    if (userRole === 'treasurer') {
      navigate('/treasurer/dashboard', { replace: true });
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast({
          title: 'Login Failed',
          description: data?.detail || data?.message || 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Case 1: backend immediately returns tokens (fallback old flow)
      if (data?.access && data?.refresh) {
        await storeSessionAndRedirect(data.access, data.refresh);
        return;
      }

      // Case 2: backend triggers OTP and expects verification
      setOtpReference(data?.otp_reference || data?.reference || email);
      setStep('otp');

      toast({
        title: 'OTP Required',
        description:
          data?.detail ||
          data?.message ||
          'A verification code has been sent. Enter the OTP to continue.',
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Unable to connect to server. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authAPI.verifyOtp({
        email,
        otp_code: otp,  
      } as any);

      if (!data?.access || !data?.refresh) {
        toast({
          title: 'OTP Verification Failed',
          description: 'Tokens were not returned after OTP verification.',
          variant: 'destructive',
        });
        return;
      }

      await storeSessionAndRedirect(data.access, data.refresh);
    } catch (err: any) {
      toast({
        title: 'OTP Verification Failed',
        description: err?.message || 'Invalid or expired OTP.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast({
          title: 'Resend Failed',
          description: data?.detail || data?.message || 'Could not resend OTP.',
          variant: 'destructive',
        });
        return;
      }

      setOtpReference(data?.otp_reference || data?.reference || email);

      toast({
        title: 'OTP Sent',
        description: data?.detail || data?.message || 'A new OTP has been sent.',
      });
    } catch (error) {
      toast({
        title: 'Resend Failed',
        description: 'Unable to connect to server. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setOtp('');
    setOtpReference(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl bg-white grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex relative">
          <img
            src="/assets/image (45).jpg"
            alt="Admin Dashboard"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70" />

          <div className="absolute bottom-4 left-0 z-10 flex flex-col justify-center px-10 text-white">
            <h2 className="text-3xl font-bold">
              {step === 'login' ? 'Admin Portal' : 'OTP Verification'}
            </h2>
            <p className="text-white/90 leading-relaxed">
              {step === 'login'
                ? 'Secure access to manage church content, media, and administration.'
                : 'Enter the verification code sent to your email or phone to complete sign in.'}
            </p>
          </div>
        </div>

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
                {step === 'login' ? 'Admin Login' : 'Verify OTP'}
              </CardTitle>

              <CardDescription>
                {step === 'login'
                  ? 'Enter your credentials to continue'
                  : `Enter the one-time code sent for ${email}`}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {step === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@church.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
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
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Continue'}
                  </Button>

                  <p className="text-sm text-center text-gray-600 hover:text-primary transition">
                    <Link to="/">
                      <button
                        type="button"
                        className="border w-full rounded-md py-2 hover:bg-black hover:text-white transition duration-500"
                      >
                        Back Home
                      </button>
                    </Link>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter OTP code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBackToLogin}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  </div>

                  <p className="text-sm text-center text-muted-foreground">
                    After verification you will be redirected to your dashboard automatically.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;