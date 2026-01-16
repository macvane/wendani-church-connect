import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://churchmedia.kahawawendanisda.org/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        // Fetch user role
        try {
          const roleResponse = await fetch('https://churchmedia.kahawawendanisda.org/api/me/', {
            headers: { 'Authorization': `Bearer ${data.access}` },
          });
          
          if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            const userRole = roleData.role || 'admin';
            localStorage.setItem('user_role', userRole);
            
            // Redirect based on role
            if (userRole === 'treasurer') {
              toast({
                title: "Login Successful",
                description: "Welcome to the treasurer dashboard!",
              });
              navigate('/treasurer/dashboard');
            } else {
              localStorage.setItem('isAdminLoggedIn', 'true');
              toast({
                title: "Login Successful",
                description: "Welcome to the admin dashboard!",
              });
              navigate('/admin/dashboard');
            }
          } else {
            // Default to admin if role fetch fails
            localStorage.setItem('isAdminLoggedIn', 'true');
            toast({
              title: "Login Successful",
              description: "Welcome to the admin dashboard!",
            });
            navigate('/admin/dashboard');
          }
        } catch (error) {
          // Default to admin if role fetch fails
          localStorage.setItem('isAdminLoggedIn', 'true');
          toast({
            title: "Login Successful",
            description: "Welcome to the admin dashboard!",
          });
          navigate('/admin/dashboard');
        }
      } else {
        const error = await response.json();
        toast({
          title: "Login Failed",
          description: error.detail || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to connect to server. Please try again later.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center p-4">
    <div className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl bg-white grid grid-cols-1 md:grid-cols-2">
      
      {/* LEFT: Image Section */}
      <div className="hidden md:flex relative">
        <img
          src="/assets/image (45).jpg"
          alt="Admin Dashboard"
          loading='lazy'
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        
        <div className="absolute bottom-4 left-0 z-10 flex flex-col  justify-center px-10 text-white">
          <h2 className="text-3xl font-bold">
            Admin Portal
          </h2>
          <p className="text-white/90 leading-relaxed">
            Secure access to manage church content, media, and administration.
          </p>
        </div>
      </div>

      {/* RIGHT: Login Form */}
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
              Admin Login
            </CardTitle>
            <CardDescription>
              Access the church administration dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
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
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-sm text-center text-gray-600 hover:text-primary transition">
                <Link to="/">
                    <button className="border w-full rounded-md py-2  hover:bg-black hover:text-white transition duration-500">
                      Back Home
                    </button>
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

};

export default AdminLogin;