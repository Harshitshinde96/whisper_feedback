import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/operations";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

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
  if (!user || !("_id" in user)) {
    return new Response(JSON.stringify({ success: false, message: "User not found in session." }), { status: 401 });
  }
  const userId = new mongoose.Types.ObjectId((user as { _id: string })._id);
  try {
    //Aggregation Pipeline
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, // <- important
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpcted error occured", error);
    return Response.json(
      {
        success: false,
        message: "An unexpcted error occured",
      },
      { status: 500 }
    );
  }
}
