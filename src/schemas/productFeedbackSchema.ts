import { z } from "zod";

export const productFeedbackSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be of minimum 3 characters" })
    .max(30, { message: "Title must be of maximum 30 characters" }),
  content: z
    .string()
    .min(10, { message: "Feedback must be of minimum 20 characters" })
    .max(300, { message: "Feedback must be of maximum 30 characters" }),
});
