import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { passwordResetAPI } from '@/utils/api';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail]       = useState('');
  const [isLoading, setLoading] = useState(false);
  const [sent, setSent]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await passwordResetAPI.forgotPassword(email);
      setSent(true);
      toast({ title: 'Email sent', description: res.message });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
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
            <h2 className="text-3xl font-bold">Password Reset</h2>
            <p className="text-white/90 leading-relaxed">
              Enter your email and we'll send you a secure link to reset your password.
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
                {sent ? 'Check your email' : 'Forgot password?'}
              </CardTitle>
              <CardDescription>
                {sent
                  ? `We sent a reset link to ${email}`
                  : 'No worries — enter your email and well send a reset link'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {sent ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center gap-3 py-4">
                    <div className="h-16 w-16 rounded-full bg-church-50 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-church-600" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      If that email is registered, a reset link has been sent.
                      Check your inbox (and spam folder).
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => { setSent(false); setEmail(''); }}
                  >
                    <Mail className="h-4 w-4" /> Try a different email
                  </Button>

                  <Link to="/admin/login">
                    <Button variant="ghost" className="w-full gap-2 mt-1">
                      <ArrowLeft className="h-4 w-4" /> Back to login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@church.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-church-600 hover:bg-church-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send reset link'}
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

export default ForgotPassword;