import { describe, it, expect, beforeEach, vi } from "vitest";
import { ReserveController } from "./ReserveController";
import { ReserveModel } from "@models/ReserveBooks";
import type { Request, Response } from "express";

vi.mock("@models/ReserveBooks");

describe("ReserveController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = vi.fn().mockReturnValue({});
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      user: { id: "user123" },
      body: {
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
      },
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    vi.clearAllMocks();
  });

  it("should successfully reserve a single book", async () => {
    const mockResult = [
      {
        _id: "610c7018370733ebee4dd6e1",
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
        createdAt: new Date(),
      },
    ] as any;

    vi.mocked(ReserveModel.find).mockResolvedValueOnce([]);
    vi.mocked(ReserveModel.insertMany).mockResolvedValueOnce(mockResult);

    await ReserveController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "1 book(s) reserved successfully",
      data: mockResult,
    });
  });

  it("should successfully reserve multiple books", async () => {
    mockReq.body = [
      {
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
      },
      {
        userId: "user123",
        bookId: "book124",
        reserveDate: "2025-04-11",
      },
    ];

    const mockResult = [
      {
        _id: "610c7018370733ebee4dd6e1",
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
        createdAt: new Date(),
      },
      {
        _id: "610c7018370733ebee4dd6e2",
        userId: "user123",
        bookId: "book124",
        reserveDate: "2025-04-11",
        createdAt: new Date(),
      },
    ] as any;

    vi.mocked(ReserveModel.find).mockResolvedValueOnce([]);
    vi.mocked(ReserveModel.insertMany).mockResolvedValueOnce(mockResult);

    await ReserveController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "2 book(s) reserved successfully",
      data: mockResult,
    });
  });

  it("should return 400 when book is already reserved", async () => {
    const alreadyReserved = [
      {
        _id: "610c7018370733ebee4dd6e1",
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
      },
    ] as any;

    vi.mocked(ReserveModel.find).mockResolvedValueOnce(alreadyReserved);

    await ReserveController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Some book(s) are already reserved",
      duplicates: ["book123"],
    });
  });

  it("should return 400 when some books are already reserved", async () => {
    mockReq.body = [
      {
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
      },
      {
        userId: "user123",
        bookId: "book124",
        reserveDate: "2025-04-11",
      },
    ];

    const alreadyReserved = [
      {
        _id: "610c7018370733ebee4dd6e1",
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
      },
    ] as any;

    vi.mocked(ReserveModel.find).mockResolvedValueOnce(alreadyReserved);

    await ReserveController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Some book(s) are already reserved",
      duplicates: ["book123"],
    });
  });

  it("should return 500 when reservation fails", async () => {
    vi.mocked(ReserveModel.find).mockResolvedValueOnce([]);
    vi.mocked(ReserveModel.insertMany).mockResolvedValueOnce([]);

    await ReserveController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Failed to reserve book(s)",
    });
  });

  it("should call find with correct userId and bookIds", async () => {
    const mockResult = [
      {
        _id: "610c7018370733ebee4dd6e1",
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
        createdAt: new Date(),
      },
    ] as any;

    vi.mocked(ReserveModel.find).mockResolvedValueOnce([]);
    vi.mocked(ReserveModel.insertMany).mockResolvedValueOnce(mockResult);

    await ReserveController(mockReq as Request, mockRes as Response);

    expect(ReserveModel.find).toHaveBeenCalledWith({
      userId: "user123",
      bookId: { $in: ["book123"] },
    });
  });

  it("should add userId from token to reservation data", async () => {
    const expectedInsertData = [
      {
        userId: "user123",
        bookId: "book123",
        reserveDate: "2025-04-11",
      },
    ];

    const mockResult = [
      {
        _id: "610c7018370733ebee4dd6e1",
        ...expectedInsertData[0],
        createdAt: new Date(),
      },
    ] as any;

    vi.mocked(ReserveModel.find).mockResolvedValueOnce([]);
    vi.mocked(ReserveModel.insertMany).mockResolvedValueOnce(mockResult);

    await ReserveController(mockReq as Request, mockRes as Response);

    expect(ReserveModel.insertMany).toHaveBeenCalled();
    const calls = vi.mocked(ReserveModel.insertMany).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const callArg = calls[0]![0];
    expect(callArg).toEqual(expectedInsertData);
  });

  it("should handle database error", async () => {
    vi.mocked(ReserveModel.find).mockRejectedValueOnce(
      new Error("Database error")
    );

    await ReserveController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
  });
});
