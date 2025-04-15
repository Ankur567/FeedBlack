import { z } from "zod";

export const feedbackSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Feedback must be of minimum 20 characters" })
    .max(300, { message: "Feedback must be of maximum 20 characters" }),
});
