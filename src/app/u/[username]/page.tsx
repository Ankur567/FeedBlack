"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const specialChar = "||";

export default function Sendfeedback() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
  });

  const feedbackContent = form.watch("content");

  const handlefeedbackClick = (feedback: string) => {
    form.setValue("content", feedback);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-feedback", {
        ...data,
        username,
      });

      toast({
        title: response.data.feedback,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.feedback ?? "Failed to sent feedback",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { data: session } = useSession();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="w-1/2 align-middle">
        <div className="w-full bg-white p-5 rounded-xl">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Public Profile Link
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Send Anonymous feedback to @{username}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous feedback here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !feedbackContent}
                  >
                    Send It
                  </Button>
                )}
              </div>
            </form>
          </Form>

          {!session ? (
            <div className="text-center">
              <div className="mb-4">Get Your feedback Board</div>
              <Link href={"/sign-up"}>
                <Button>Create Your Account</Button>
              </Link>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
