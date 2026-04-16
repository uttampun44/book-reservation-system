// ---------------------------------------------------------------------------
// pagination.helper.js  —  Node.js (CommonJS)
// ---------------------------------------------------------------------------

const DEFAULT_PAGE     = 1;
const DEFAULT_PER_PAGE = 8;

/**
 * Paginate any array.
 *
 * @param {Array}  source   - Full array to paginate
 * @param {number} page     - Current page, 1-based (default: 1)
 * @param {number} perPage  - Items per page (default: 8)
 *
 * @returns {{ data: Array, pagination: Object }}
 */
export const paginate = <T>(source = [] as T[], page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE) => {
  const safePage    = Math.max(1, Math.floor(Number(page)));
  const safePerPage = Math.max(1, Math.floor(Number(perPage)));
  const totalItems  = source.length;
  const totalPages  = Math.ceil(totalItems / safePerPage) || 1;
  const currentPage = Math.min(safePage, totalPages);

  const start = (currentPage - 1) * safePerPage;
  const end   = start + safePerPage;

  return {
    data: source.slice(start, end),
    pagination: {
      currentPage,
      perPage:     safePerPage,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      nextPage:    currentPage < totalPages ? currentPage + 1 : null,
      prevPage:    currentPage > 1          ? currentPage - 1 : null,
    },
  };
};

/**
 * Safely parse a page number from Express req.query or any raw value.
 * Returns 1 for missing / invalid / negative values.
 *
 * @param {*} value  - Raw value (e.g. req.query.page)
 * @returns {number}
 */
export const parsePage = (value: any) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_PAGE;
};

/**
 * Safely parse perPage from query. Clamps between 1 and maxAllowed.
 *
 * @param {*}      value       - Raw value (e.g. req.query.perPage)
 * @param {number} maxAllowed  - Upper limit (default: 100)
 * @returns {number}
 */
export const parsePerPage = (value: any, maxAllowed: number = 100) => {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_PER_PAGE;
  return Math.min(n, maxAllowed);
};




// ---------------------------------------------------------------------------
// USAGE EXAMPLES
// ---------------------------------------------------------------------------

/*

// 1. Basic Express route
// ----------------------
const express = require('express');
const { paginate, parsePage, parsePerPage } = require('./pagination.helper');
const { books } = require('./books.data');

const router = express.Router();

// GET /books?page=2&perPage=6
router.get('/books', (req, res) => {
  const page    = parsePage(req.query.page);
  const perPage = parsePerPage(req.query.perPage);

  const result = paginate(books, page, perPage);

  res.json(result);
});

// Response shape:
// {
//   "data": [ { id: "book-007", title: "..." }, ... ],   ← 6 books
//   "pagination": {
//     "currentPage": 2,
//     "perPage": 6,
//     "totalItems": 60,
//     "totalPages": 10,
//     "hasNextPage": true,
//     "hasPrevPage": true,
//     "nextPage": 3,
//     "prevPage": 1
//   }
// }


// 2. Paginate a filtered list (genre)
// ------------------------------------
router.get('/books/genre/:genre', (req, res) => {
  const page    = parsePage(req.query.page);
  const perPage = parsePerPage(req.query.perPage);
  const filtered = books.filter(
    (b) => b.genre.toLowerCase() === req.params.genre.toLowerCase()
  );

  res.json(paginate(filtered, page, perPage));
});


// 3. Paginate a search result
// ----------------------------
router.get('/books/search', (req, res) => {
  const page    = parsePage(req.query.page);
  const perPage = parsePerPage(req.query.perPage);
  const q       = (req.query.q || '').toLowerCase();

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
  );

  res.json(paginate(filtered, page, perPage));
});


// 4. Paginate sorted results
// ---------------------------
router.get('/books/top-rated', (req, res) => {
  const page    = parsePage(req.query.page);
  const sorted  = [...books].sort((a, b) => b.rating - a.rating);

  res.json(paginate(sorted, page));
});

*/