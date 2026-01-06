export interface NewsArticle {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  image?: string;
  url?: string;
  lang?: string;
  source?: {
    id?: string;
    name?: string;
    url?: string;
    country?: string;
  };
  publishedAt?: string;
}