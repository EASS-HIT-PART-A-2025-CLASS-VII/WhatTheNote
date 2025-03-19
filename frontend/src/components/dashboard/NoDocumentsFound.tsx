
import React from 'react';
import { Plus } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';

interface NoDocumentsFoundProps {
  searchQuery?: string;
  onFileSelect: (file: File) => void;
}

const NoDocumentsFound: React.FC<NoDocumentsFoundProps> = ({ searchQuery, onFileSelect }) => {
  return (
    <div className="text-center py-12">
      <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
        <Plus className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No documents found</h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery ? 'Try a different search term or upload a new document.' : 'Upload your first document to get started.'}
      </p>
      <FileUpload 
        onFileSelect={onFileSelect}
        className="max-w-md mx-auto"
      />
    </div>
  );
};

export default NoDocumentsFound;
