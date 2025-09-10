"use client";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-16 max-w-3xl">
          <div className="inline-block bg-gray-800 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-medium text-gray-300">
              Anonymous Feedback Platform
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Share Your Thoughts{" "}
            <span className="text-gray-300">Anonymously</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Provide honest feedback without revealing your identity. Our
            platform ensures complete privacy and confidentiality.
          </p>
        </section>
        {/* Carousel for Messages */}
        <div className="w-full max-w-2xl mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Recent Feedback
            </h2>
            <p className="text-gray-400">
              See what others are sharing anonymously
            </p>
          </div>

          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-black">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                      <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-gray-700">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6 gap-2">
              <CarouselPrevious className="relative -left-0 -translate-y-0 bg-white border border-gray-300 text-black hover:bg-gray-50" />
              <CarouselNext className="relative -right-0 -translate-y-0 bg-white border border-gray-300 text-black hover:bg-gray-50" />
            </div>
          </Carousel>
        </div>
        {/* Features Section */}
        <section className="w-full max-w-4xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Complete Anonymity
              </h3>
              <p className="text-gray-400 text-sm">
                Your identity is protected with advanced encryption.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Honest Feedback
              </h3>
              <p className="text-gray-400 text-sm">
                Get genuine insights without fear of judgment.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="bg-white p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Secure Platform
              </h3>
              <p className="text-gray-400 text-sm">
                Enterprise-grade security for all your communications.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-gray-800 text-gray-300">
        © {new Date().getFullYear()} Whisper Feedback. All rights reserved.
      </footer>
    </div>
  );
}
