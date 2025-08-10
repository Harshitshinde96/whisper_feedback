import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions = NextAuth({
  //  { signIn, signOut, auth }
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.email }],
          });

          if (!user) {
            throw new Error("No User Found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const password = credentials.password as string;
          const hashedPassword = user.password as string;
          const isPasswordCorrect = await bcrypt.compare(
            password,
            hashedPassword
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          } else {
            return user;
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  session:{
    strategy: "jwt"
  }
});
