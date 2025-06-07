import mongoose, { Document, Schema } from "mongoose";

export interface Feedback extends Document {
  title: string;
  rating: number;
  content: string;
  dateCreated: Date;
  sentiment: string;
  votes: number;
  voters: string[];
}

const FeedbackSchema: Schema<Feedback> = new Schema({
  title: {
    type: String,
    minLength: 3,
    maxLength: 30,
  },
  rating: {
    type: Number,
    default: 3,
    min: 1,
    max: 5,
  },
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
  voters: {
    type: [String], 
    default: [],
  },
});

export default FeedbackSchema;
