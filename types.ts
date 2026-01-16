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

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  EDITOR = 'EDITOR',
  READER = 'READER',
}

export type GenerationStatus = 'idle' | 'planning' | 'writing' | 'illustrating' | 'complete' | 'error';
