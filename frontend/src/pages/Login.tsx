import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Import the login function from our API utility
      const { login } = await import('../lib/api');
      
      // Call the login API
      const result = await login(formData.email, formData.password);
      
      if (result.error) {
        setError(result.error ? (result as { message: string }).message : '');
        return;
      }
      
      // On success, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 md:pt-40 pb-16">
        <div className="container px-6 mx-auto flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="rounded-full bg-primary/10 p-5 w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                  Enter your email and password to login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {error && (
                    <div className="text-sm text-red-500 text-center">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;