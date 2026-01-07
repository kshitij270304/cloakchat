import UserModel, { Message } from "@/model/User.model";
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  await dbConnect();
  // 👇 now also receive "sender"
  const { username, content, sender } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 }
      );
    }

    // 👇 include sender when creating a new message
    const newMessage: Partial<Message> = {
      content,
      createdAt: new Date(),
      // sender: sender || 'Anonymous',  // Fallback if sender not provided
    };

    user.messages.push(newMessage as Message);

    await user.save({ validateBeforeSave: false });

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
