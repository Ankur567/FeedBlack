import { z } from "zod";

export const productFeedbackSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  title: z
    .string()
    .min(3, { message: "Title must be of minimum 3 characters" })
    .max(30, { message: "Title must be of maximum 30 characters" }),
  content: z
    .string()
    .min(10, { message: "Feedback must be of minimum 20 characters" })
    .max(300, { message: "Feedback must be of maximum 30 characters" }),
});
