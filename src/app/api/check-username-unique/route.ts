import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('uername')
        }

        //validate w/ zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success) {
            const usernameErrors = result.error.format().username?._error || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0? usernameErrors.join(', ')
                : "Invalid query parameters",
            }, {status:400})
        }

        const {username} = result.data

        const existingVerifiedUser = UserModel.findOne({username, isVerified: true})

        if(await existingVerifiedUser){
            return Response.json(
            {
            success: false,
            message: "error chechking username"
            },
            {status: 400}
        )
        }

        return Response.json(
            {
            success: false,
            message: "error chechking username"
            },
            {status: 400}
        )


    } catch (error) {
        console.log("error checking usename", error)
        return Response.json(
            {
                success: false,
                message: "error chechking username"
            },
            {status: 500}
        )
    }
}