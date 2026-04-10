export interface CoverImage {
  small: string;
  medium: string;
  large: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  subGenre: string;
  publishedYear: number;
  isbn: string;
  imageUrl: string;
  coverImage: CoverImage;
  pages: number;
  language: string;
  publisher: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  coverColor: string;
  description: string;
  tags: string[];
  inStock: boolean;
  available: number;
  featured: boolean;
}

export interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface BookListResponse {
  success: boolean;
  message: string;
  data: Book[];
  pagination: Pagination;
  sortBy: string;
}

export type SortOption = "Most Popular" | "Highest Rated" | "Most Available" | "Title A–Z";
export type Genre = "All" | "Fiction" | "Classic" | "Sci-fi" | "Mystery" | "Dystopia" | "Non-fiction";