// User and authentication related types

import { Document } from './document';

// Query interface for document Q&A
export interface Query {
  question: string;
  answer: string;
  timestamp: Date;
}

// Extended Document interface with additional fields
export interface DocumentWithDetails extends Document {
  content: string;
  subject: string;
  summary: string;
  queries: Query[];
  uploadedDate: Date;
  lastViewed: Date;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  documents: DocumentWithDetails[];
  createdAt: Date;
}

// User data for authentication
export interface UserAuth {
  email: string;
  password: string;
}

// User data returned from the API
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}