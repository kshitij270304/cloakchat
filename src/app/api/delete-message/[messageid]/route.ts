import UserModel from '@/model/User.model';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';
import { User } from 'next-auth';

interface RouteContext {
  params: Promise<{
    messageid: string;
  }>;
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  // 👇 params must be awaited
  const { messageid } = await context.params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user as User | undefined;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message not found or already deleted',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting message' },
      { status: 500 }
    );
  }
}
