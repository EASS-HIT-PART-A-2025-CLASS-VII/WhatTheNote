
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Calendar, Clock, MoreHorizontal, Sparkles, Layers, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { deleteDocument } from '../../lib/api';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md relative min-h-[230px]", 
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
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center w-full">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Document
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      document and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => {
                      setIsDeleting(true);
                      try {
                        await deleteDocument(id);
                        toast.success(`Document successfully deleted!`);
                        window.dispatchEvent(new CustomEvent('document-deleted', { detail: id }));
                      } catch (error) {
                        toast.error(`Document deletion error!`);
                        console.error('Document deletion error:', error);
                      } finally {
                        setIsDeleting(false);
                      }
                    }} disabled={isDeleting}>
                      {isDeleting ? 'Deleting...' : 'Delete Document'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
