import mongoose, { Document, Schema } from "mongoose";

export interface Feedback extends Document {
  content: string;
  dateCreated: Date;
  sentiment: string;
  votes: number;
}

const FeedbackSchema: Schema<Feedback> = new Schema({
  content: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sentiment: {
    type: String,
    enum: ["Positive", "Negative", "Neutral"],
    default: "Neutral",
  },
  votes: {
    type: Number,
    default: 0,
  },
});

export default FeedbackSchema;
