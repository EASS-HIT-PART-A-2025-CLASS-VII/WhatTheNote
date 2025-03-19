
export interface Document {
  id: number;
  title: string;
  preview?: string;
  createdAt: Date;
  lastViewed?: Date;
  isProcessed?: boolean;
  subject?: string;
}

export type ViewMode = 'grid' | 'list';
