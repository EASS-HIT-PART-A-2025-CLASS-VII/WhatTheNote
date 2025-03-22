
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Calendar, Clock, MoreHorizontal, Sparkles, Layers, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { deleteDocument } from '../../lib/api';

interface DocumentCardProps {
  id: number;
  title: string;
  preview?: string;
  uploadedDate: Date;
  lastViewed?: Date;
  isProcessed?: boolean;
  subject?: string;
  className?: string;
  summary?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  preview,
  uploadedDate,
  lastViewed,
  isProcessed = false,
  subject,
  className,
  summary
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md relative min-h-[200px]", 
        "border border-border hover:border-primary/20",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="rounded-md bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Link to={`/document/${id}`} className="font-medium text-lg line-clamp-1 hover:text-primary transition-colors">
                {title}
              </Link>
              <div className="flex items-center text-xs text-muted-foreground space-x-3 mt-1">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(uploadedDate, 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="-mt-1 -mr-2 absolute top-5 right-5"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive-foreground"
              onSelect={async (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to delete this document?');
    if (confirmed) {
      try {
        await deleteDocument(id);
        alert('Document deleted successfully!');
        window.location.reload();
      } catch (error) {
        alert('Failed to delete document. Please try again.');
      }
    }
  }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        
        {preview && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {preview}
            </p>
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          {isProcessed && (
            <div className="flex items-center text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Summary Available
            </div>
          )}
          
          {subject && (
            <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              <Layers className="h-3 w-3 mr-1" />
              {subject}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 h-16 absolute bottom-0 right-0">
        <Button variant="outline" asChild size="sm">
          <Link to={`/document/${id}`}>
            View Document
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
