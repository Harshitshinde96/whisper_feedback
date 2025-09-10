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
        </body>
      </AuthProvider>
    </html>
  );
}
