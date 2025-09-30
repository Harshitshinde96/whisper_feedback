import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whisper Feedback",
  description: "Real feedback from real people.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster
            position="top-right"
            theme="light"
            toastOptions={{
              style: {
                background: "#fff",
                color: "#000",
                border: "1px solid #e5e5e5",
              },
              classNames: {
                toast: "sonner-toast",
                title: "sonner-title",
                description: "sonner-description",
              },
            }}
          />
          <footer className="text-center p-6 bg-gray-800 text-gray-300 ">
            © {new Date().getFullYear()} Whisper Feedback. All rights reserved.{" "}
            <br /> <br />
            Created with ❤️ by{" "}
            <a
              href="https://github.com/Harshitshinde96"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Harshit Shinde
            </a>
          </footer>
        </body>
      </AuthProvider>
    </html>
  );
}
