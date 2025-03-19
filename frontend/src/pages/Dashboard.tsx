
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
    isProcessed: true,
    subject: 'Computer Science'
  },
  {
    id: 2,
    title: 'Quantum Computing: A Beginner\'s Guide',
    preview: 'An introduction to quantum computing principles, qubits, and quantum algorithms...',
    createdAt: new Date('2023-03-10'),
    lastViewed: new Date('2023-06-05'),
    isProcessed: true,
    subject: 'Physics'
  },
  {
    id: 3,
    title: 'Data Structures and Algorithms',
    preview: 'Comprehensive overview of fundamental data structures and algorithms with time complexity analysis...',
    createdAt: new Date('2023-02-28'),
    lastViewed: new Date('2023-05-12'),
    isProcessed: false,
    subject: 'Computer Science'
  },
  {
    id: 4,
    title: 'Artificial Neural Networks',
    preview: 'Deep dive into artificial neural networks, backpropagation, and deep learning architectures...',
    createdAt: new Date('2023-01-18'),
    lastViewed: new Date('2023-04-30'),
    isProcessed: true,
    subject: 'Computer Science'
  },
  {
    id: 5,
    title: 'Principles of Quantum Mechanics',
    preview: 'Exploring the fundamental principles of quantum mechanics including wave-particle duality...',
    createdAt: new Date('2023-05-10'),
    lastViewed: new Date('2023-06-01'),
    isProcessed: true,
    subject: 'Physics'
  },
  {
    id: 6,
    title: 'Introduction to Biology',
    preview: 'An overview of basic biological concepts, cell structure, and genetics...',
    createdAt: new Date('2023-06-05'),
    lastViewed: new Date('2023-06-20'),
    isProcessed: true,
    subject: 'Biology'
  }
];

// Available subject options
const subjectOptions = ['All Subjects', 'Computer Science', 'Physics', 'Biology', 'Mathematics', 'Chemistry', 'Other'];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState(mockDocuments);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [subjectGroups, setSubjectGroups] = useState<Record<string, Document[]>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Filter documents based on search query and selected subject
    let filtered = documents;
    
    // First filter by search query
    filtered = documents.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.preview && doc.preview.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Then filter by subject if not "All Subjects"
    if (selectedSubject !== 'All Subjects') {
      filtered = filtered.filter(doc => doc.subject === selectedSubject);
    }
    
    setFilteredDocuments(filtered);
    
    // Group documents by subject
    const groups: Record<string, Document[]> = {};
    filtered.forEach(doc => {
      const subject = doc.subject || 'Uncategorized';
      if (!groups[subject]) {
        groups[subject] = [];
      }
      groups[subject].push({...doc, id: doc.id});
    });
    
    setSubjectGroups(groups);
    
    // Initialize expanded state for new subjects
    const newExpandedState = { ...expandedSubjects };
    Object.keys(groups).forEach(subject => {
      if (newExpandedState[subject] === undefined) {
        newExpandedState[subject] = true; // Default to expanded
      }
    });
    setExpandedSubjects(newExpandedState);
    
  }, [searchQuery, documents, selectedSubject]);

  const handleFileSelect = (file: File) => {
    setIsUploading(true);
    
    // Mock subject detection based on filename
    let detectedSubject = 'Other';
    const filename = file.name.toLowerCase();
    
    if (filename.includes('machine') || filename.includes('algorithm') || filename.includes('neural')) {
      detectedSubject = 'Computer Science';
    } else if (filename.includes('quantum') || filename.includes('mechanics')) {
      detectedSubject = 'Physics';
    } else if (filename.includes('bio') || filename.includes('cell')) {
      detectedSubject = 'Biology';
    } else if (filename.includes('math') || filename.includes('calculus')) {
      detectedSubject = 'Mathematics';
    } else if (filename.includes('chem') || filename.includes('element')) {
      detectedSubject = 'Chemistry';
    }
    
    // Simulate processing delay
    setTimeout(() => {
      // Add new document to the list
      const newDocument = {
        id: documents.length + 1,
        title: file.name.replace('.pdf', ''),
        preview: 'Processing document...',
        createdAt: new Date(),
        lastViewed: new Date(),
        isProcessed: false,
        subject: detectedSubject
      };
      
      setDocuments([newDocument, ...documents]);
      setIsUploading(false);
    }, 3000);
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
            searchQuery={searchQuery}
            onFileSelect={handleFileSelect}
            viewMode={viewMode}
            subjectGroups={subjectGroups}
            expandedSubjects={expandedSubjects}
            toggleSubjectExpanded={toggleSubjectExpanded}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
