
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ChevronLeft, Search, DownloadCloud, Send, Sparkles, Copy, BookOpen, MessageSquare, History } from 'lucide-react';

// Mock document data
const mockDocument = {
  id: 1,
  title: 'Machine Learning Fundamentals',
  content: `# Machine Learning Fundamentals

## Introduction to Machine Learning

Machine learning is a subfield of artificial intelligence (AI) that focuses on developing systems that learn from and make predictions based on data. Unlike traditional programming, where explicit instructions are provided to solve a problem, machine learning algorithms build a mathematical model based on sample data, known as "training data," to make predictions or decisions without being explicitly programmed to perform the task.

## Types of Machine Learning

There are three main types of machine learning:

1. **Supervised Learning**: The algorithm is trained on labeled data, meaning that each training example is paired with an output value or label. The goal is to learn a mapping from inputs to outputs.

2. **Unsupervised Learning**: The algorithm is given unlabeled data and must find patterns and relationships within it. Clustering and dimensionality reduction are common unsupervised tasks.

3. **Reinforcement Learning**: The algorithm learns by interacting with an environment and receiving rewards or penalties for its actions. Over time, it learns to maximize cumulative rewards.

## Common Algorithms

Machine learning encompasses a wide range of algorithms, including:

- Linear Regression
- Logistic Regression
- Decision Trees
- Random Forests
- Support Vector Machines (SVM)
- Neural Networks
- k-Nearest Neighbors (k-NN)
- k-Means Clustering

## The Machine Learning Process

The machine learning process typically involves the following steps:

1. **Data Collection**: Gathering relevant data for the problem.
2. **Data Preprocessing**: Cleaning and preparing the data for analysis.
3. **Feature Engineering**: Selecting and transforming variables to enhance model performance.
4. **Model Selection**: Choosing appropriate algorithms for the task.
5. **Model Training**: Using data to train the model.
6. **Model Evaluation**: Assessing the model's performance.
7. **Model Deployment**: Implementing the model in a production environment.`,
  summary: "This document provides a comprehensive introduction to machine learning concepts including supervised, unsupervised, and reinforcement learning. It outlines common algorithms such as regression models, decision trees, and neural networks. The document also details the typical machine learning workflow from data collection to model deployment. Key points include the distinction between traditional programming and machine learning approaches, the importance of training data, and the iterative nature of the model development process.",
  queries: [
    {
      question: "What are the three main types of machine learning?",
      answer: "The three main types of machine learning are: 1) Supervised Learning, where algorithms are trained on labeled data to learn mappings from inputs to outputs; 2) Unsupervised Learning, which works with unlabeled data to find patterns and relationships; and 3) Reinforcement Learning, where algorithms learn by interacting with an environment and receiving rewards or penalties.",
      timestamp: new Date('2023-05-15T14:32:00')
    },
    {
      question: "Explain the machine learning process",
      answer: "The machine learning process typically follows these steps: 1) Data Collection - gathering relevant data; 2) Data Preprocessing - cleaning and preparing data; 3) Feature Engineering - selecting and transforming variables; 4) Model Selection - choosing appropriate algorithms; 5) Model Training - using data to train the model; 6) Model Evaluation - assessing performance; and 7) Model Deployment - implementing in production.",
      timestamp: new Date('2023-05-18T09:15:00')
    }
  ],
  uploadedDate: new Date('2023-04-15'),
  lastViewed: new Date()
};

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const documentId = parseInt(id || '');
  const [document, setDocument] = useState({
  id: 0,
  title: '',
  content: '',
  summary: '',
  queries: [],
  createdAt: new Date(),
  lastViewed: new Date()
});
  const [question, setQuestion] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch document data from API
  React.useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/documents/${documentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch document');
        }
  
        const data = await response.json();
        setDocument({
          ...data,
          content: data.content || '',
          summary: data.summary || '',
          queries: data.queries || [],
          createdAt: new Date(data.createdAt),
          lastViewed: new Date(data.lastViewed || Date.now())
        });
        setQueries(data.queries || []);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error && err.message.includes('401')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        setError(err instanceof Error ? err.message : 'Failed to load document');
        setIsLoading(false);
      }
    };
    
    fetchDocument();
  }, [id]);
  
  const handleAskQuestion = () => {
    if (!question.trim()) return;
    
    setIsQuerying(true);
    
    fetch(`http://localhost:8000/documents/${documentId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ question })
    })
    .then(response => {
      if (!response.ok) throw new Error('Query failed');
      return response.json();
    })
    .then(data => {
      setQueries(prevQueries => [data as typeof prevQueries[0], ...prevQueries]);
      setQuestion('');
    })
    .catch(err => setError(err.message))
    .finally(() => setIsQuerying(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast would be shown here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-6 mx-auto">
          <div className="mb-8">
            <Button variant="ghost" className="mb-4" asChild>
              <Link to="/dashboard">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{document.title}</h1>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <span>Uploaded {new Date(document.createdAt).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>Last viewed {document.lastViewed.toLocaleDateString()}</span>
            </div>
          </div>
          
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="summary">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Summary
              </TabsTrigger>
              <TabsTrigger value="document">
                <BookOpen className="mr-2 h-4 w-4" />
                Document
              </TabsTrigger>
              <TabsTrigger value="qa">
                <MessageSquare className="mr-2 h-4 w-4" />
                Q&A
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="mr-2 h-4 w-4" />
                Query History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-0 animate-fade-in">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold">AI-Generated Summary</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(document.summary)}
                      aria-label="Copy summary"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {document.summary}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="document" className="mt-0 animate-fade-in">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold">Document Content</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(document.summary)}
                      aria-label="Copy summary"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {document.content}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qa" className="mt-0 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Ask a Question</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask any question about this document and get AI-powered answers.
                    </p>
                    
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ask about the document..."
                          className="pl-10 pr-16"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyDown={handleKeyDown}
                          disabled={isQuerying}
                        />
                      </div>
                      <Button 
                        onClick={handleAskQuestion} 
                        disabled={!question.trim() || isQuerying}
                      >
                        {isQuerying ? 'Processing...' : 'Ask'}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {queries.length > 0 ? (
                      queries.map((query, index) => (
                        <div key={index} className="border rounded-lg p-4 animate-scale-in">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium">{(query as { question: string }).question}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date((query as { timestamp: Date }).timestamp).toLocaleTimeString()} {new Date((query as { timestamp: Date }).timestamp).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {(query as { answer: string }).answer}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <MessageSquare className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="font-semibold mb-1">No questions yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Ask your first question about this document.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Query History</h3>
                  
                  {queries.length > 0 ? (
                    <div className="space-y-4">
                      {queries.map((query, index) => (
                        <div key={index} className="border rounded-lg p-4 flex justify-between">
                          <div>
                            <div className="font-medium">{(query as { question: string }).question}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date((query as { timestamp: Date }).timestamp).toLocaleString()}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/document/${id}?query=${index}`}>
                              View Answer
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <History className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="font-semibold mb-1">No query history</h3>
                      <p className="text-sm text-muted-foreground">
                        Questions you ask will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentView;
