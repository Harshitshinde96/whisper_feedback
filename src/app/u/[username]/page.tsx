"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

export default function SendMessages() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to send message", {
        description:
          axiosError.response?.data.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsLoadingSuggestions(true);
    setSuggestedMessages([]);
    try {
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      const parsedMessages = parseStringMessages(data.message);
      setSuggestedMessages(parsedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch suggestions");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-black h-16 w-16 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Send Anonymous Message
            </h1>
            <p className="text-gray-600">
              Send an anonymous message to @{username}
            </p>
          </div>

          {/* Message Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mb-8"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Your Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here..."
                        className="resize-none h-32 border-gray-300 focus:border-black focus:ring-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled className="bg-black text-white px-8">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="bg-black text-white hover:bg-gray-800 px-8"
                  >
                    Send Message
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <Separator className="my-8" />

          {/* Suggested Messages */}
          <div className="space-y-6">
            <div className="text-center">
              <Button
                onClick={fetchSuggestedMessages}
                disabled={isLoadingSuggestions}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isLoadingSuggestions
                  ? "Generating Suggestions..."
                  : "Get Message Suggestions"}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Click on any suggestion to use it
              </p>
            </div>

            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Suggested Messages
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingSuggestions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                    <p className="text-gray-500">Generating suggestions...</p>
                  </div>
                ) : suggestedMessages.length > 0 ? (
                  suggestedMessages.map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto py-3 px-4 text-left whitespace-normal border-gray-200 hover:bg-gray-50"
                      onClick={() => handleMessageClick(message)}
                    >
                      <span className="flex-1">{message}</span>
                    </Button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Click above to get message suggestions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Call to Action */}
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Want to receive anonymous messages?
              </h3>
              <p className="text-gray-600">
                Create your own message board and share it with others
              </p>
            </div>
            <Link href={"/sign-in"}>
              <Button className="bg-black text-white hover:bg-gray-800">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
