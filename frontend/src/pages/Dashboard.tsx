import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Document } from '../types/document';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SearchFilters from '../components/dashboard/SearchFilters';
import DocumentTabs from '../components/dashboard/DocumentTabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import DocumentView from './DocumentView';
import { toast } from 'sonner';
import { useRef } from 'react';

const Dashboard = () => {
  const [subjectOptions, setSubjectOptions] = useState<string[]>(['all']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjectGroups, setSubjectGroups] = useState<Record<string, Document[]>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedSubject = useRef(false);

  useEffect(() => {
    const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        navigate('/login');
      }
      
      const data = await response.json();
      // Transform backend data to frontend format
      const transformed = data.map((doc: any) => {
        try {
          // Subject filtering handled in useEffect below
          return {
            ...doc,
            uploadedDate: doc.uploadedDate ? new Date(doc.uploadedDate) : new Date(),
            lastViewed: doc.lastViewed ? new Date(doc.lastViewed) : undefined,
            preview: doc.summary ? `AI Summary - ${doc.summary}` : 'No Summary Available'
          };
        } catch (err) {
          console.error('Error transforming document:', err);
          return null;
        }
      }).filter(Boolean);
      setDocuments(transformed);
      
    } catch (err) {
      // Handle JWT expiration
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };
  fetchDocuments();
  }, [user, navigate]);

  useEffect(() => {
    const handleDocumentDeleted = (e: CustomEvent) => {
      const deletedId = e.detail;
      setDocuments(prev => prev.filter(doc => doc.id !== deletedId));
    };

    window.addEventListener('document-deleted', handleDocumentDeleted as EventListener);
    return () => {
      window.removeEventListener('document-deleted', handleDocumentDeleted as EventListener);
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectFromUrl = urlParams.get('subject') || 'all';
  
    // Initialize selectedSubject from URL only once
    if (!hasInitializedSubject.current && documents.length > 0) {
      const uniqueSubjects = ['all', ...new Set(documents.map(d => d.subject))].filter(Boolean);
  
      if (uniqueSubjects.includes(subjectFromUrl)) {
        setSelectedSubject(subjectFromUrl);
      } else {
        setSelectedSubject('all');
      }
  
      hasInitializedSubject.current = true;
      setSubjectOptions(uniqueSubjects as string[]);
    }
  }, [documents]);
  
  useEffect(() => {
    if (!hasInitializedSubject.current) return; // Skip until initialized
  
    let filtered = [...documents];
  
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(doc => doc.subject === selectedSubject);
    }
  
    setFilteredDocuments(filtered);
  
    // Group by subject
    const groups = filtered.reduce((acc, doc) => {
      const subject = doc.subject || 'Uncategorized';
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);
  
    setSubjectGroups(groups);
  
    // Update URL
    navigate(`/dashboard?subject=${selectedSubject}`);
  }, [searchQuery, documents, selectedSubject]);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:8000/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
  
      if (!response.ok) throw new Error('Upload failed');
      
      const newDocument = await response.json();
      setDocuments([newDocument, ...documents]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleSubjectExpanded = (subject: string) => {
    setExpandedSubjects({
      ...expandedSubjects,
      [subject]: !expandedSubjects[subject]
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-6 mx-auto">
          {/* In the return statement */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error: {error}
              <button 
                className="ml-4 text-blue-500 hover:text-blue-700"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <DashboardHeader />
              <SearchFilters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                subjectOptions={subjectOptions}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
              <DocumentTabs 
                filteredDocuments={filteredDocuments}
                isUploading={isUploading}
                handleFileSelect={handleFileSelect}
                viewMode={viewMode}
                subjectGroups={subjectGroups}
                expandedSubjects={expandedSubjects}
                toggleSubjectExpanded={toggleSubjectExpanded}
                searchQuery={searchQuery}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
