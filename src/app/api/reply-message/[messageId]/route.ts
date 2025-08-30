import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    await dbConnect();
    const { username, replyContent } = await req.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const message = user.messages.id(params.messageId);
    if (!message) {
      return Response.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    if (message.reply) {
      return Response.json({ success: false, message: "Reply already exists" }, { status: 400 });
    }

    message.reply = {
      content: replyContent,
      createdAt: new Date(),
    };

    await user.save();

    return Response.json({ success: true, message: "Reply added" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
