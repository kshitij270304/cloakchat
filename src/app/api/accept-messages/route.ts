import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {User} from "next-auth";
import { get } from "http";
import { authOptions } from "../auth/[..nextauth]/options";
import { is } from "zod/locales";

export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user) {
            return Response.json({
                success: false,
                message: "not authenticated"
            }, {status: 500});
   }

   const userId = user._id;
   const {acceptMessages} = await request.json();

   try {
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAcceptingMessages: acceptMessages },
        {new: true}
    )
    if(!updatedUser) {
        return Response.json({
            success: false,
            message: "failed to update user status"
        }, {status: 401}
        )

    return Response.json({
        success: true,
        message: "message acceptance status updated successfully"
    }, 
    {status: 200});
    }
   } catch (error) {
    console.log("failed to update user status to accept messages", error);
    return Response.json({
        success: false,
        message: "failed to update user status"
    }, {status: 500}
    );

   }

}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user) {
            return Response.json({
                success: false,
                message: "not authenticated"
            }, {status: 500});
   }

   const userId = user._id;

   try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
        return Response.json({
            success: false,
            message: "user not found"
        }, {status: 404});
    }
 
    return Response.json({
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage
    }, 
    {status: 200});
   } catch (error) {
    console.log("failed to retrieve user acceptance status", error);
    return Response.json({
        success: false,
        message: "failed to retrieve user acceptance status"
    }, {status: 500});
   }
}
