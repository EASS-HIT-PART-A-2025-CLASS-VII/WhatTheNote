import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  ChevronLeft,
  Search,
  DownloadCloud,
  Send,
  Sparkles,
  Copy,
  BookOpen,
  Layers,
  MessageSquare,
  History,
  FileQuestion,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { getRandomItems } from "../lib/utils";
import Markdown from "markdown-to-jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const sampleQuestions = [
  "What are the key points of this document?",
  "Summarize the main ideas of the document.",
  "Who is this document relevant for?",
  "How current is this information and when was it last updated?",
  "Are there any recommended actions or next steps?",
];

const DocumentView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const documentId = parseInt(id || "");
  const [document, setDocument] = useState({
    id: null,
    title: "",
    content: "",
    summary: "",
    subject: "",
    queries: [],
    uploadedDate: new Date(),
    lastViewed: new Date(),
  });
  const cleanContent = document.content
    .replace(/^```[\w]*\n?/, "")
    .replace(/```$/, "");
  const [question, setQuestion] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [queries, setQueries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [randomQuestions, setRandomQuestions] = useState(() =>
    getRandomItems(sampleQuestions, 3),
  );
  const [latestQuery, setLatestQuery] = useState<any | null>(null);

  const MarkdownViewer = ({ content }: { content: string }) => (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );

  React.useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/documents/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await response.json();
        setDocument({
          ...data,
          content: data.content || "",
          summary: data.summary || "",
          subject: data.subject || "",
          queries: data.queries || [],
          uploadedDate: new Date(data.uploadedDate || Date.now()),
          lastViewed: new Date(data.lastViewed || Date.now()),
        });
        setQueries(data.queries || []);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        setError(
          err instanceof Error ? err.message : "Failed to load document",
        );
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleAskQuestion = () => {
    if (!question.trim()) return;

    setIsQuerying(true);

    fetch(`http://localhost:8000/documents/${documentId}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ question }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Query failed");
        return response.json();
      })
      .then((data) => {
        setQueries((prevQueries) => {
          const updated = [data, ...prevQueries];
          setLatestQuery(data);
          return updated;
        });

        setQuestion("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsQuerying(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
    return;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-6 mx-auto">
          <div className="mb-8">
            <Button variant="ghost" className="mb-4" asChild>
              <Link to="/dashboard?subject=All%20Subjects">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{document.title}</h1>
              <div className="flex items-center space-x-2"></div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <span>
                Uploaded: {document.uploadedDate.toLocaleDateString("en-GB")}
              </span>
              <span className="mx-2">•</span>
              <span>Document ID: {document.id}</span>
              <span className="mx-2">•</span>
              <span>
                <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted rounded-full">
                  {document.subject && (
                    <Button
                      variant="ghost"
                      className="flex items-center text-xs font-medium text-muted-foreground bg-muted rounded-full hover:bg-muted/80 h-7 min-h-0 py-0 px-3"
                      onClick={() => {
                        navigate(
                          `/dashboard?subject=${encodeURIComponent(document.subject)}`,
                        );
                      }}
                    >
                      <Layers className="h-3 w-3 mr-1" />
                      {document.subject}
                    </Button>
                  )}
                </div>
              </span>
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
                  <p className="prose prose-sm dark:prose-invert max-w-none">
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
                      <h3 className="font-semibold">
                        AI-Formatted Document Content
                      </h3>
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
                  <MarkdownViewer content={cleanContent} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qa" className="mt-0 animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Ask a Question</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask any question about this document and get AI-powered
                      answers.
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
                        {isQuerying ? "Processing..." : "Ask AI"}
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {latestQuery ? (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-bold">
                            {"Question: " + latestQuery.question}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(
                              latestQuery.timestamp,
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <hr className="my-4 border-t border-muted" />
                          <MarkdownViewer content={latestQuery.answer} />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <MessageSquare className="h-10 w-10 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="font-semibold mb-1">
                          Your question will appear here, ask away!
                        </h3>
                      </div>
                    )}
                    <hr className="my-4 border-t border-muted" />
                    <h3 className="text-center font-semibold mb-1">
                      Suggested Questions
                    </h3>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {randomQuestions.map((q, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="text-left h-auto"
                          onClick={() => setQuestion(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <Button
                        variant="outline"
                        className="text-left h-auto"
                        onClick={() =>
                          setRandomQuestions(getRandomItems(sampleQuestions, 3))
                        }
                      >
                        {"Reload"}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-left h-auto"
                        onClick={() => setQuestion("")}
                      >
                        {"Clear"}
                      </Button>
                    </div>
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
                        <div
                          key={index}
                          className="border rounded-lg p-4 flex flex-col gap-2"
                        >
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">
                                {(query as { question: string }).question}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(
                                  (query as { timestamp: Date }).timestamp,
                                ).toLocaleTimeString()}{" "}
                                {new Date(
                                  (query as { timestamp: Date }).timestamp,
                                ).toLocaleDateString("en-GB")}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedIndex(
                                  expandedIndex === index ? null : index,
                                )
                              }
                            >
                              {expandedIndex === index
                                ? "Hide Answer"
                                : "View Answer"}
                            </Button>
                          </div>
                          {expandedIndex === index && (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <MarkdownViewer content={query.answer} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No query history yet
                    </p>
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
