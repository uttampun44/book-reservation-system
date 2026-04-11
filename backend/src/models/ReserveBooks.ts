import mongoose, { Schema, Document } from "mongoose";

export type IReserve = Document & {
  userId: string;
  bookId: string;
  reserveDate: string;
  createdAt: Date;
}

const ReserveSchema = new Schema<IReserve>(
  {
    userId: { type: String, required: true },
    bookId: { type: String, required: true },
    reserveDate: { type: String, required: true },
  },
  { timestamps: true } 
);

export const ReserveModel = mongoose.model<IReserve>("reserve_books", ReserveSchema);