export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string; // The prompt used to generate the image
  imageUrl?: string; // Base64 or URL
  isLoadingImage?: boolean;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  genre: string;
  targetAge: string;
  artStyle: string;
  createdAt: Date;
  pages: StoryPage[];
  isPublic: boolean;
  coverImage?: string;
}

export interface StorySettings {
  topic: string;
  genre: string;
  ageGroup: string;
  artStyle: string;
  pageCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  EDITOR = 'EDITOR',
  READER = 'READER',
  ADMIN = 'ADMIN'
}

export type GenerationStatus = 'idle' | 'planning' | 'writing' | 'illustrating' | 'complete' | 'error';