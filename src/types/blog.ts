
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  thumbnail: string;
}

export interface Category {
  name: string;
  count: number;
}
