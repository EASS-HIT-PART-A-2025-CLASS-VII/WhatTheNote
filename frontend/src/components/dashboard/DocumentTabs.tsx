
import React from 'react';
import { Clock, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import DocumentGrid from './DocumentGrid';
import NoDocumentsFound from './NoDocumentsFound';
import SubjectGrouping from './SubjectGrouping';
import { Document } from '../../types/document';



interface DocumentTabsProps {
  filteredDocuments: Document[];
  searchQuery: string;
  onFileSelect: (file: File) => void;
  viewMode: 'grid' | 'list';
  subjectGroups: Record<string, Document[]>;
  expandedSubjects: Record<string, boolean>;
  toggleSubjectExpanded: (subject: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({
  filteredDocuments,
  searchQuery,
  onFileSelect,
  viewMode,
  subjectGroups,
  expandedSubjects,
  toggleSubjectExpanded
}) => {
  const recentDocuments = [...filteredDocuments]
    .filter(doc => doc.lastViewed)
    .sort((a, b) => (b.lastViewed?.getTime() || 0) - (a.lastViewed?.getTime() || 0));

  const processedDocuments = filteredDocuments.filter(doc => doc.isProcessed);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Documents</TabsTrigger>
        <TabsTrigger value="recent">
          <Clock className="mr-2 h-4 w-4" />
          Recently Viewed
        </TabsTrigger>
        <TabsTrigger value="processed">AI Processed</TabsTrigger>
        <TabsTrigger value="subjects">
          <Layers className="mr-2 h-4 w-4" />
          By Subject
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        {filteredDocuments.length === 0 ? (
          <NoDocumentsFound searchQuery={searchQuery} onFileSelect={onFileSelect} />
        ) : (
          <DocumentGrid documents={filteredDocuments} viewMode={viewMode} />
        )}
      </TabsContent>
      
      <TabsContent value="recent" className="mt-0">
        <DocumentGrid documents={recentDocuments} viewMode={viewMode} />
      </TabsContent>
      
      <TabsContent value="processed" className="mt-0">
        <DocumentGrid documents={processedDocuments} viewMode={viewMode} />
      </TabsContent>
      
      <TabsContent value="subjects" className="mt-0">
        <SubjectGrouping 
          subjectGroups={subjectGroups}
          expandedSubjects={expandedSubjects}
          toggleSubjectExpanded={toggleSubjectExpanded}
          viewMode={viewMode}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DocumentTabs;
