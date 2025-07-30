import {z} from "zod"

export const MessageSchema = z.object({
    content: z
    .string()
    .min(10, {message: "content must be atleast of 10 characters"})
    .max(300, {message: "content must be atmost of 300 characters"})
})