
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import AnimatedLogo from '../../components/ui/AnimatedLogo';
import { Menu, X, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            aria-label="WhatTheNote"
          >
            <AnimatedLogo className="text-2xl" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/') ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive('/dashboard') ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/user" 
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
                <Button variant="outline" className="mr-4" onClick={() => { logout(); window.location.href = '/'; }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="mr-4">Login</Button>
                </Link>
                <Button asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "md:hidden fixed inset-x-0 top-[72px] bg-white/95 dark:bg-black/95 backdrop-blur-lg transition-all duration-300 ease-in-out z-40 border-t shadow-lg",
          isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="px-6 py-6 space-y-4">
          <Link 
            to="/" 
            className={cn(
              "block py-2 text-base font-medium transition-colors hover:text-primary",
              isActive('/') ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={cn(
                  "block py-2 text-base font-medium transition-colors hover:text-primary",
                  isActive('/dashboard') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link 
                to="/user" 
                className="flex items-center space-x-2 py-2 text-base font-medium transition-colors hover:text-primary"
              >
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </Link>
              <Button className="w-full" onClick={() => { logout(); window.location.href = '/'; }}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full mb-2">Login</Button>
              </Link>
              <Button className="w-full" asChild>
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
