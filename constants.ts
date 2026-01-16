import { Story } from './types';

export const GENRES = [
  'Fantasy', 'Sci-Fi', 'Adventure', 'Fairy Tale', 'Mystery', 'Educational', 'Bedtime Story'
];

export const AGE_GROUPS = [
  'Toddler (1-3)', 'Preschool (3-5)', 'Early Reader (5-8)', 'Pre-Teen (9-12)', 'Young Adult'
];

export const ART_STYLES = [
  'Watercolor', 'Cartoon', 'Pixel Art', '3D Render', 'Oil Painting', 'Sketch', 'Anime', 'Storybook Illustration'
];

export const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: 'The Robot who Loved Flowers',
    description: 'A gentle robot discovers a garden in a futuristic city.',
    genre: 'Sci-Fi',
    targetAge: 'Preschool (3-5)',
    artStyle: 'Watercolor',
    createdAt: new Date('2023-10-15'),
    isPublic: true,
    coverImage: 'https://picsum.photos/400/400?random=1',
    pages: [
      { pageNumber: 1, text: 'Once upon a time, in a city of chrome and glass, lived Unit 734.', imagePrompt: 'Robot in city', imageUrl: 'https://picsum.photos/800/600?random=1' },
      { pageNumber: 2, text: 'Unlike other robots who liked oil and gears, Unit 734 liked soft petals.', imagePrompt: 'Robot holding flower', imageUrl: 'https://picsum.photos/800/600?random=2' }
    ]
  },
  {
    id: '2',
    title: 'Dragon\'s Tea Party',
    description: 'A fierce dragon just wants someone to share tea with.',
    genre: 'Fantasy',
    targetAge: 'Early Reader (5-8)',
    artStyle: 'Cartoon',
    createdAt: new Date('2023-10-20'),
    isPublic: false,
    coverImage: 'https://picsum.photos/400/400?random=3',
    pages: []
  }
];
