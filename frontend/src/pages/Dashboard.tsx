
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Document } from '../types/document';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SearchFilters from '../components/dashboard/SearchFilters';
import DocumentTabs from '../components/dashboard/DocumentTabs';

// Mock data for documents with added subject property
const mockDocuments = [
  {
    id: 1,
    title: 'Machine Learning Fundamentals',
    preview: 'This document covers the basic principles of machine learning, including supervised and unsupervised learning techniques...',
    createdAt: new Date('2023-04-15'),
    lastViewed: new Date('2023-05-20'),
  
    subject: 'Computer Science'
  },
  {
    id: 2,
    title: 'Quantum Computing: A Beginner\'s Guide',
    preview: 'An introduction to quantum computing principles, qubits, and quantum algorithms...',
    createdAt: new Date('2023-03-10'),
    lastViewed: new Date('2023-06-05'),
  
    subject: 'Physics'
  },
  {
    id: 3,
    title: 'Data Structures and Algorithms',
    preview: 'Comprehensive overview of fundamental data structures and algorithms with time complexity analysis...',
    createdAt: new Date('2023-02-28'),
    lastViewed: new Date('2023-05-12'),
  
    subject: 'Computer Science'
  },
  {
    id: 4,
    title: 'Artificial Neural Networks',
    preview: 'Deep dive into artificial neural networks, backpropagation, and deep learning architectures...',
    createdAt: new Date('2023-01-18'),
    lastViewed: new Date('2023-04-30'),
  
    subject: 'Computer Science'
  },
  {
    id: 5,
    title: 'Principles of Quantum Mechanics',
    preview: 'Exploring the fundamental principles of quantum mechanics including wave-particle duality...',
    createdAt: new Date('2023-05-10'),
    lastViewed: new Date('2023-06-01'),
  
    subject: 'Physics'
  },
  {
    id: 6,
    title: 'Introduction to Biology',
    preview: 'An overview of basic biological concepts, cell structure, and genetics...',
    createdAt: new Date('2023-06-05'),
    lastViewed: new Date('2023-06-20'),
  
    subject: 'Biology'
  }
];

// Available subject options
const subjectOptions = ['All Subjects', 'Computer Science', 'Physics', 'Biology', 'Mathematics', 'Chemistry', 'Other'];

// Remove mockDocuments array completely

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [subjectGroups, setSubjectGroups] = useState<Record<string, Document[]>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:8000/documents', { // Update API endpoint
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json(); // Get detailed error
          throw new Error(errorData.detail || 'Failed to fetch documents');
        }
        
        const data = await response.json();
        // Transform backend data to frontend format
        const transformed = data.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          lastViewed: doc.lastViewed ? new Date(doc.lastViewed) : undefined,
          preview: doc.content?.substring(0, 200) // Create preview from content
        }));
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
  }, []);

  useEffect(() => {
    let filtered = [...documents];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
(doc.preview && doc.preview.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Subject filter
    if (selectedSubject !== 'All Subjects') {
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
  }, [searchQuery, documents, selectedSubject]);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/documents', {
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
