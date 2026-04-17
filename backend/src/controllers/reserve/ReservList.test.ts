import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReserveListController } from "./ReserveListController";
import { ReserveModel } from "@models/ReserveBooks";
import * as bookData from "@data/book.data";
import type { Request, Response } from "express";

// Mock the ReserveModel
vi.mock("@models/ReserveBooks");

// Mock the book data
vi.mock("@data/book.data");

describe("ReserveListController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusSpy: ReturnType<typeof vi.fn>;
  let jsonSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Setup request mock
    req = {
      user: { id: "test-user-123" } as any,
    };

    // Setup response mocks
    statusSpy = vi.fn().mockReturnThis();
    jsonSpy = vi.fn().mockReturnThis();

    res = {
      status: statusSpy as any,
      json: jsonSpy as any,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return reserved books with full details for authenticated user", async () => {
    // Mock reserved books data
    const mockReserves = [
      {
        _id: "reserve-1",
        userId: "test-user-123",
        bookId: "book-041",
        reserveDate: "2026-04-17T20:44:44.335Z",
        createdAt: new Date("2026-04-17T20:44:45.927Z"),
        updatedAt: new Date("2026-04-17T20:44:45.927Z"),
        __v: 0,
        toObject: vi.fn().mockReturnValue({
          _id: "reserve-1",
          userId: "test-user-123",
          bookId: "book-041",
          reserveDate: "2026-04-17T20:44:44.335Z",
          createdAt: new Date("2026-04-17T20:44:45.927Z"),
          updatedAt: new Date("2026-04-17T20:44:45.927Z"),
          __v: 0,
        }),
      },
    ];

    // Mock book details
    const mockBook = {
      id: "book-041",
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      genre: "Fiction",
      subGenre: "Fantasy",
      publishedYear: 1997,
      isbn: "978-0-439-70818-8",
      rating: 4.8,
      reviewCount: 520000,
      price: 10.99,
    };

    vi.mocked(ReserveModel.find).mockResolvedValueOnce(mockReserves as any);
    vi.mocked(bookData.getBookById).mockReturnValueOnce(mockBook as any);

    await ReserveListController(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith({
      success: true,
      message: "Reserved books retrieved successfully",
      data: [
        {
          _id: "reserve-1",
          reserveDate: "2026-04-17T20:44:44.335Z",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          __v: 0,
          book: mockBook,
        },
      ],
    });
  });

  it("should return 401 when user is not authenticated", async () => {
    req.user = undefined as any;

    await ReserveListController(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized: User not authenticated",
    });
  });

  it("should return 401 when user ID is empty", async () => {
    req.user = { id: "" };

    await ReserveListController(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized: User not authenticated",
    });
  });

  it("should return empty array when user has no reserved books", async () => {
    vi.mocked(ReserveModel.find).mockResolvedValueOnce([] as any);

    await ReserveListController(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith({
      success: true,
      message: "Reserved books retrieved successfully",
      data: [],
    });
  });

  it("should filter reserved books by logged-in user ID only", async () => {
    const mockReserves = [
      {
        _id: "reserve-1",
        userId: "test-user-123",
        bookId: "book-041",
        reserveDate: "2026-04-17T20:44:44.335Z",
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: vi.fn().mockReturnValue({
          _id: "reserve-1",
          userId: "test-user-123",
          bookId: "book-041",
          reserveDate: "2026-04-17T20:44:44.335Z",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    ];

    vi.mocked(ReserveModel.find).mockResolvedValueOnce(mockReserves as any);
    vi.mocked(bookData.getBookById).mockReturnValueOnce({} as any);

    await ReserveListController(req as Request, res as Response);

    expect(ReserveModel.find).toHaveBeenCalledWith({
      userId: "test-user-123",
    });
  });

  it("should exclude userId and bookId from response", async () => {
    const mockReserves = [
      {
        _id: "reserve-1",
        userId: "test-user-123",
        bookId: "book-041",
        reserveDate: "2026-04-17T20:44:44.335Z",
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: vi.fn().mockReturnValue({
          _id: "reserve-1",
          userId: "test-user-123",
          bookId: "book-041",
          reserveDate: "2026-04-17T20:44:44.335Z",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    ];

    vi.mocked(ReserveModel.find).mockResolvedValueOnce(mockReserves as any);
    vi.mocked(bookData.getBookById).mockReturnValueOnce({ id: "book-041" } as any);

    await ReserveListController(req as Request, res as Response);

    const callArgs = jsonSpy.mock.calls[0];
    const responseData = callArgs ? (callArgs[0] as any)?.data?.[0] : undefined;
    expect(responseData).toBeDefined();
    expect(responseData).not.toHaveProperty("userId");
    expect(responseData).not.toHaveProperty("bookId");
    expect(responseData).toHaveProperty("_id");
    expect(responseData).toHaveProperty("book");
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(ReserveModel.find).mockRejectedValueOnce(
      new Error("Database connection error")
    );

    await ReserveListController(req as Request, res as Response);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred while retrieving reserved books",
    });
  });

  it("should include book details in the response", async () => {
    const mockReserves = [
      {
        _id: "reserve-1",
        userId: "test-user-123",
        bookId: "book-041",
        reserveDate: "2026-04-17T20:44:44.335Z",
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: vi.fn().mockReturnValue({
          _id: "reserve-1",
          userId: "test-user-123",
          bookId: "book-041",
          reserveDate: "2026-04-17T20:44:44.335Z",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    ];

    const mockBook = {
      id: "book-041",
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      genre: "Fiction",
      rating: 4.8,
      price: 10.99,
    };

    vi.mocked(ReserveModel.find).mockResolvedValueOnce(mockReserves as any);
    vi.mocked(bookData.getBookById).mockReturnValueOnce(mockBook as any);

    await ReserveListController(req as Request, res as Response);

    const callArgs = jsonSpy.mock.calls[0];
    const responseData = callArgs ? (callArgs[0] as any)?.data?.[0] : undefined;
    expect(responseData).toBeDefined();
    expect(responseData?.book).toEqual(mockBook);
    expect(responseData?.book?.title).toBe("Harry Potter and the Philosopher's Stone");
    expect(responseData?.book?.author).toBe("J.K. Rowling");
  });
});
