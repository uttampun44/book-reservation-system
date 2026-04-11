import { describe, it, expect, beforeEach, vi } from "vitest";
import { UnreservedController } from "./UnreservedController";
import { ReserveModel } from "@models/ReserveBooks";
import type { Request, Response } from "express";

vi.mock("@models/ReserveBooks");

describe("UnreservedController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = vi.fn().mockReturnValue({});
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      user: { id: "user123" },
      params: { bookId: "book123" },
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("should successfully unreserve a book", async () => {
    const mockDeleteResult = { deletedCount: 1, acknowledged: true };
    vi.mocked(ReserveModel.deleteOne).mockResolvedValueOnce(mockDeleteResult);

    await UnreservedController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Book unreserved successfully",
      data: {
        bookId: "book123",
        userId: "user123",
      },
    });
  });

  it("should return 404 when reservation not found", async () => {
    const mockDeleteResult = { deletedCount: 0, acknowledged: true };
    vi.mocked(ReserveModel.deleteOne).mockResolvedValueOnce(mockDeleteResult);

    await UnreservedController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Reservation not found",
    });
  });

  it("should call deleteOne with correct userId and bookId", async () => {
    const mockDeleteResult = { deletedCount: 1, acknowledged: true };
    vi.mocked(ReserveModel.deleteOne).mockResolvedValueOnce(mockDeleteResult);

    await UnreservedController(mockReq as Request, mockRes as Response);

    expect(ReserveModel.deleteOne).toHaveBeenCalledWith({
      userId: "user123",
      bookId: "book123",
    });
  });

  it("should return 500 when an error occurs", async () => {
    vi.mocked(ReserveModel.deleteOne).mockRejectedValueOnce(
      new Error("Database error")
    );

    await UnreservedController(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred while processing the unreservation",
    });
  });
});
