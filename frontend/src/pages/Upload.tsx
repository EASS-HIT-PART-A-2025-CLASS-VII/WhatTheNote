import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/button";
import FileUpload from "../components/ui/FileUpload";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { FileQuestion, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'sonner';


const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClearSelection = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  if (user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 pt-32 md:pt-40 pb-16">
          <div className="container px-6 mx-auto text-center">
            <div className="rounded-full bg-primary/10 p-5 w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FileQuestion className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Upload PDF</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              Please upload your PDF file below.
            </p>
            <FileUpload
              allowedTypes={['.pdf']}
              maxSize={10}
              onFileSelect={(selectedFile) => setFile(selectedFile)}
              onError={(error) => toast.error(error, {
                action: {
                  label: 'Close',
                  onClick: () => handleClearSelection(),
                },
                duration: 5000,
              })}
              className="max-w-md mx-auto"
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  } else {
    navigate('/login');
  }
};

export default Upload;