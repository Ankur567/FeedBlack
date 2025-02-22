import { z } from "zod"

export const acceptFeedbackSchema = z.object({
    acceptFeedbacks: z.boolean()
})