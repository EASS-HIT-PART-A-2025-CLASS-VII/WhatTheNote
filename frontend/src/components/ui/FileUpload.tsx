
import React, { useState, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Upload, File, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  allowedTypes = ['.pdf'],
  maxSize = 10, // Default 10MB
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedTypes.includes(fileType) && !allowedTypes.includes('*')) {
      setUploadError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File too large. Maximum size: ${maxSize}MB`);
      return false;
    }

    setUploadError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (onFileSelect) {
          onFileSelect(file);
        }
        handleFileUpload(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (onFileSelect) {
          onFileSelect(file);
        }
        handleFileUpload(file);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // This is a simulation of an upload process
  // In a real app, this would be replaced with actual API calls
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
      throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      setIsUploading(false);
      setProgress(100);
      toast.success(`${file.name} uploaded successfully!`);
      return result;
    } catch (error) {
      setIsUploading(false);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      toast.error('Upload failed. Please try again.');
      return null;
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setProgress(0);
    setIsUploading(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={allowedTypes.join(',')}
        className="hidden"
        id="file-upload"
      />
      
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            isDragging ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50",
            "cursor-pointer"
          )}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Upload your document</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Drag and drop your PDF or click to browse
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm">
                  Select File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Max size: {maxSize}MB | Formats: {allowedTypes.join(', ')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm line-clamp-1">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <div>
              {isUploading ? (
                <Button variant="outline" size="sm" disabled>
                  Uploading...
                </Button>
              ) : progress === 100 ? (
                <Button variant="outline" size="sm" onClick={resetUpload}>
                  <Check className="mr-1 h-4 w-4" /> Done
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={resetUpload}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
          
          {uploadError ? (
            <div className="bg-destructive/10 rounded p-3 mb-2 flex items-center text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {uploadError}
            </div>
          ) : null}
          
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-right text-muted-foreground">
              {progress}% {isUploading ? 'Uploading...' : progress === 100 ? 'Complete' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
