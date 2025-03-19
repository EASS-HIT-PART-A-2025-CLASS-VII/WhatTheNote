
import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import DocumentGrid from './DocumentGrid';
interface Document {
  id: number;
  title: string;
  preview?: string;
  createdAt: Date;
  lastViewed?: Date;
  isProcessed?: boolean;
  subject?: string;
}

interface SubjectGroupingProps {
  subjectGroups: Record<string, Document[]>;
  expandedSubjects: Record<string, boolean>;
  toggleSubjectExpanded: (subject: string) => void;
  viewMode: 'grid' | 'list';
}

const SubjectGrouping: React.FC<SubjectGroupingProps> = ({
  subjectGroups,
  expandedSubjects,
  toggleSubjectExpanded,
  viewMode
}) => {
  if (Object.keys(subjectGroups).length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No documents found</h3>
        <p className="text-muted-foreground">
          Try a different search term or upload a new document.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(subjectGroups).map(([subject, docs]) => (
        <Collapsible
          key={subject}
          open={expandedSubjects[subject]}
          onOpenChange={() => toggleSubjectExpanded(subject)}
          className="border rounded-lg bg-card shadow-sm"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{subject}</h3>
              <span className="text-muted-foreground text-sm">({docs.length} documents)</span>
            </div>
            <Button variant="ghost" size="icon">
              <Plus className={`h-4 w-4 transition-transform ${expandedSubjects[subject] ? 'rotate-45' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 pt-0">
              <DocumentGrid documents={docs} viewMode={viewMode} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default SubjectGrouping;
