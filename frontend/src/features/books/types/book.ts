export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  available: number;
  waitlist?: boolean;
  cover: string;
  coverAccent: string;
    coverUrl: string;
  isbn?: string;
}

export type SortOption = "Most Popular" | "Highest Rated" | "Most Available" | "Title A–Z";
export type Genre = "All" | "Fiction" | "Classic" | "Sci-fi" | "Mystery" | "Dystopia" | "Non-fiction";