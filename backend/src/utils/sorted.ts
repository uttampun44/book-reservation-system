import books from "@/data/book.data";

export type SortOption =
  | "most_popular"    // highest reviewCount
  | "highest_rated"   // highest rating
  | "most_available"  // inStock first
  | "title_asc";      // A → Z
 
export const sortBooks = (sortBy: SortOption) => {
  const list = [...books]; // never mutate the original array
 
  switch (sortBy) {
    case "most_popular":
      return list.sort((a, b) => b.reviewCount - a.reviewCount);
 
    case "highest_rated":
      return list.sort((a, b) => b.rating - a.rating);
 
    case "most_available":
      return list.sort((a, b) => {
        if (a.inStock === b.inStock) return 0;
        return a.inStock ? -1 : 1; // inStock=true floats to top
      });
 
    case "title_asc":
      return list.sort((a, b) => a.title.localeCompare(b.title));
 
    default:
      return list; // no sort — original order
  }
};