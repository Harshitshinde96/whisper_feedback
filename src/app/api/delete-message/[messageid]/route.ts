import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/operations";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ messageid: string }> }
) {
  const { messageid } = await context.params;
  const messageId = messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  console.log("Session user:", user);

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: "Message Deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete message route ", error);
    return Response.json(
      {
        success: false,
        message: "Error deleteing message",
      },
      { status: 500 }
    );
  }
}
