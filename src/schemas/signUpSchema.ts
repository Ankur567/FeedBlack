import { z } from "zod"

export const usernameValidation = z
.string()
.min(3, "Username must be betwen 3 and 20 characters")
.max(20, "Username must be betwen 3 and 20 characters")
.regex(/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/, "Username is invalid")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Email is invalid"}),
    password: z.string().min(8, {message: "Password must be atleast 8 characters"})
})