import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  // Ensure database connection is established before proceeding
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if a user with the same username already exists and is verified
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check if a user with the same email already exists
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate a 6-digit verification code for the email
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // If a user with this email exists and is already verified, block registration
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // If user exists but is not verified, update their info to allow re-verification
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } else {
      // If the user is completely new, create a new user record
      const hashedPassword = await bcrypt.hash(password, 10);

      // 'const' prevents re-assigning the variable, not changing the properties of the object it points to.
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set 1-hour expiry

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode, // FIX: Was verifyCode.replace, now correctly assigns the code
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send the verification email to the user
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    // Catch any unexpected errors during the process
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
