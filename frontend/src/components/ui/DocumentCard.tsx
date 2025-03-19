
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Calendar, Clock, MoreHorizontal, Sparkles, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface DocumentCardProps {
  id: string;
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
        "overflow-hidden transition-all duration-300 hover:shadow-md", 
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
                {lastViewed && (
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(lastViewed, 'MMM dd, yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="-mt-1 -mr-2"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
      
      <CardFooter className="p-4 pt-0 flex justify-end">
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
