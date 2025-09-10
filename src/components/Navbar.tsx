"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <nav className="p-4 md:p-6 bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-gray-900"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">
            Whisper Feedback
          </span>
        </div>
        {session ? (
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-300">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-white text-gray-900 hover:bg-gray-100 transition-colors font-medium "
              variant="default"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in" className="mt-4 md:mt-0">
            <Button
              className="bg-white text-gray-900 hover:bg-gray-100 transition-colors font-medium"
              variant={"default"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
