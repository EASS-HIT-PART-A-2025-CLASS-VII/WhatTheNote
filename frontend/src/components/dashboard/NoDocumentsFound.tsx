import React from "react";
import { Plus } from "lucide-react";

interface NoDocumentsFoundProps {
  searchQuery?: string;
  onFileSelect: (file: File) => void;
}

const NoDocumentsFound: React.FC<NoDocumentsFoundProps> = ({
  searchQuery,
  onFileSelect,
}) => {
  return (
    <div className="text-center py-12">
      <button onClick={() => (window.location.href = "/upload")}>
        <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <Plus className="h-8 w-8 text-primary" />
        </div>
      </button>
      <h3 className="text-xl font-semibold mb-2">No documents found</h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery
          ? "Try a different search term or upload a new document."
          : "Upload your first document to get started."}
      </p>
    </div>
  );
};

export default NoDocumentsFound;
