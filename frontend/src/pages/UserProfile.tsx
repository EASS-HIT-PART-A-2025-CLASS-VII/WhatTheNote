import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { useAuth } from '../lib/AuthContext';
import { User } from '../types/user';
import { deleteUser, DeleteAccountResponse } from '../lib/api';

interface ApiResponse {
  error?: boolean;
  message?: string;
  data?: any;
}

interface UpdateProfileResponse extends ApiResponse {
  user?: User;
}



const UserProfile = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{ name: string; email: string }>({ 
    name: user?.name ?? '', 
    email: user?.email ?? '' 
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not logged in
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow context to update
      if (!user && !localStorage.getItem('token')) {
        navigate('/login');
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error('Name and email are required');
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Invalid email format');
      }

      const { updateUser } = await import('../lib/api');
      const result: UpdateProfileResponse = await updateUser(formData);
      
      if (result.error) {
        toast({
          title: "Update failed",
          description: result.message || 'Failed to update profile',
          variant: "destructive"
        });
        return;
      }

      await refreshUser();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update error",
        description: error instanceof Error ? error.message : "An error occurred while updating your profile.",
        variant: "destructive"
      });
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { deleteUser } = await import('../lib/api');
      const result: DeleteAccountResponse = await deleteUser();

      if (result.error) {
        toast({
          title: "Deletion failed",
          description: result.message || 'Failed to delete account',
          variant: "destructive"
        });
        return;
      }

      logout();
      toast({
        title: "Account deleted",
        description: "Your account has been removed successfully.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Deletion error",
        description: error instanceof Error ? error.message : "An error occurred while deleting your account.",
        variant: "destructive"
      });
      console.error('Account deletion error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-32 md:pt-40 pb-16">
          <div className="container px-6 mx-auto">
            <p>Loading user profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 md:pt-40 pb-16">
        <div className="container px-6 mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                // Edit mode
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                </>
              ) : (
                // View mode
                <>
                  <div className="space-y-1">
                    <Label>Name</Label>
                    <p className="text-lg">{user?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label>Account Created</Label>
                    <p className="text-lg">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isSaving}>
  {isSaving ? 'Saving...' : 'Save Changes'}
</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
  {isDeleting ? 'Deleting...' : 'Delete Account'}
</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;