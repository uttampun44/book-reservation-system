import { describe, it, beforeEach, expect, vi } from 'vitest';
import { BooksController } from './books';
import type { Request, Response } from 'express';

describe('BooksController', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        mockReq = {
            query: {},
        };

        mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };

        vi.clearAllMocks();
    });

    it('should be defined', () => {
        expect(BooksController).toBeDefined();
    });

    it('should return all books with pagination', async () => {
        mockReq.query = { page: '1', perPage: '10' };

        await BooksController(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalled();
        
        const response = (mockRes.json as any).mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.pagination).toBeDefined();
    });

    it('should handle sorting', async () => {
        mockReq.query = { page: '1', perPage: '10', sortBy: 'title' };

        await BooksController(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        const response = (mockRes.json as any).mock.calls[0][0];
        expect(response.sortBy).toBe('title');
    });

    it('should return default sort when sortBy is not provided', async () => {
        mockReq.query = { page: '1', perPage: '10' };

        await BooksController(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        const response = (mockRes.json as any).mock.calls[0][0];
        expect(response.sortBy).toBe('default');
    });

    it('should handle errors gracefully', async () => {
        mockReq.query = { page: 'invalid', perPage: 'invalid' };

        await BooksController(mockReq as Request, mockRes as Response);

        // Should either return 200 with defaults or handle the error
        expect(mockRes.status).toHaveBeenCalled();
    });
});