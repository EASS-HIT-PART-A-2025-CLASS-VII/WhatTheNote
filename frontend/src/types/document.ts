export interface Document {
  id: number;
  title: string;
  preview?: string;
  lastViewed?: Date;
  subject?: string;
  uploadedDate?: Date;
}

export type ViewMode = "grid" | "list";
