
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ChevronLeft, Search, DownloadCloud, Send, Sparkles, Copy, BookOpen, MessageSquare, History, FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { getRandomItems } from '../lib/utils';

const sampleQuestions = [
  "What are the key points of this document?",
  "Summarize the main ideas of the document.",
  "Who is this document relevant for?",
  "How current is this information and when was it last updated?",
  "Are there any recommended actions or next steps?"
];

const DocumentView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const documentId = parseInt(id || '');
  const [document, setDocument] = useState({
  id: null,
  title: '',
  content: '',
  summary: '',
  queries: [],
  uploadedDate: new Date(),
  lastViewed: new Date()
});
  const [question, setQuestion] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
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
  
        const data = await response.json();
        setDocument({
          ...data,
          content: data.content || '',
          summary: data.summary || '',
          queries: data.queries || [],
          uploadedDate: new Date(data.uploadedDate || Date.now()),
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
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container px-6 mx-auto">
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading document...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!document.id) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="container px-6 mx-auto text-center">
            <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested document could not be loaded.</p>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                <div className="flex items-center space-x-2"></div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <span>Uploaded: {document.uploadedDate.toLocaleDateString('en-GB')}</span>
                <span className="mx-2">•</span>
                <span>Document ID: {document.id}</span>
              </div>
            </div>
            
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="summary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Summary
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
                        onClick={() => copyToClipboard(document.content)}
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
                          {isQuerying ? 'Processing...' : 'Ask AI'}
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
                                {new Date((query as { timestamp: Date }).timestamp).toLocaleTimeString()} {new Date((query as { timestamp: Date }).timestamp).toLocaleDateString('en-GB')}
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
                          <div className="mt-4 flex justify-center gap-2">
                            {getRandomItems(sampleQuestions, 3).map((question) => (
                              <Button
                                key={question}
                                variant="outline"
                                size="lg"
                                onClick={() => setQuestion(question)}
                                disabled={!question.trim() || isQuerying}
                                className="text-sm px-4 py-1 hover:bg-primary/10 transition-colors"
                              >
                                {question}
                              </Button>
                            ))}
                          </div>
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
                        <div key={index} className="border rounded-lg p-4 flex flex-col gap-2">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">{(query as { question: string }).question}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                              {new Date((query as { timestamp: Date }).timestamp).toLocaleTimeString()} {new Date((query as { timestamp: Date }).timestamp).toLocaleDateString('en-GB')}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            >
                              {expandedIndex === index ? 'Hide Answer' : 'View Answer'}
                            </Button>
                          </div>
                          {expandedIndex === index && (
                            <div className="text-muted-foreground text-sm mt-2 bg-muted/5 p-3 rounded-lg transition-all duration-300">
                            {(query as { answer: string }).answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No query history yet</p>
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
