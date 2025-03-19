import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/button";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { FileQuestion } from "lucide-react";

const Upload = () => {
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleSubmit = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('http://localhost:8000/documents/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Upload failed: ${errorData.detail || 'Unknown error'}`);
          return;
        }

        const result = await response.json();
        alert('File uploaded successfully!');
        // Optionally reset file state or redirect
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      }
    } else {
      alert("No file selected.");
    }
  };

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
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="mb-4 border border-input rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
            <div className="flex space-x-4">
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg transition-colors">
                Upload
              </Button>
              <Button variant="destructive" onClick={handleClearSelection} className="py-2 px-4 rounded-lg transition-colors">
                Clear Selection
              </Button>
            </div>
          </div>
          {file && (
            <p className="mt-4 text-success-foreground">Selected file: {file.name}</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;