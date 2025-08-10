import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username ,email ,password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message : "username is already taken"
            }, {status : 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(10000 + Math.random()*90000).toString()


        if (existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                success: true,
                message : "user already exists with this email"
            } ,{status:400})
            } else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifycode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }
        else{
            const hasedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                    username,
                    email,
                    hasedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: []
            });
            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse){
            return Response.json({
                success: true,
                message : "failed to send verificcation code"
            } ,{status:500})
        }

        return Response.json({
                success: true,
                message : "user registered successfully , please verify your email"
            } ,{status:201})


    } catch (error) {
        console.log("error registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {status: 500}
        )
    }
}