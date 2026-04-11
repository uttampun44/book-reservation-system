import z from "zod";

const singleReserveType = z.object({
  bookId: z.string(),
  reserveDate: z.string(),
});

export const reserveTypes = z.union([
  singleReserveType,
  z.array(singleReserveType).min(1),
]);

export type ReserveInput = z.infer<typeof reserveTypes>;