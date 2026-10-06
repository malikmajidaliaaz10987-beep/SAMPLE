export interface Comment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: 'Architecture' | 'Typography & Craft' | 'Ecology' | 'Philosophy' | 'Digital Culture';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  imageCaption?: string;
  excerpt: string;
  featured?: boolean;
  content: {
    dropCap: string;
    opening: string;
    section1Heading?: string;
    section1Text?: string;
    pullQuote?: string;
    section2Heading?: string;
    section2Text?: string;
    figureImage?: string;
    figureCaption?: string;
    conclusion: string;
  };
  likes: number;
  tags: string[];
  comments: Comment[];
}
