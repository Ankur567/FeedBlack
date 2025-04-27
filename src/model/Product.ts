import mongoose, { Document, Schema } from "mongoose";
import FeedbackSchema, { Feedback } from "./Feedback";

export interface Product extends Document {
  productname: string;
  feedbacks: Feedback[];
}

const ProductSchema: Schema<Product> = new Schema({
  productname: {
    type: String,
    required: [true, "Productname is required"],
    trim: true,
    unique: true,
  },
  feedbacks: [FeedbackSchema],
});

const ProductModel =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;
