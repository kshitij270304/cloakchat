import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "username must be ateast 2 character")
    .max(20 ,"not more than 20 char")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain speacial character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'invalid email address'}),
    password: z.string().min(6, {message: 'password must be atleast 6 char'})
})