"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { productFeedbackSchema } from "@/schemas/productFeedbackSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Rating from "@mui/material/Rating";

const productReviewPage = () => {
  const params = useParams<{ productname: string }>();
  const productName = decodeURIComponent(params.productname);

  const form = useForm<z.infer<typeof productFeedbackSchema>>({
    resolver: zodResolver(productFeedbackSchema),
    defaultValues: {
      rating: 3,
      title: "",
      content: "",
    },
  });

  const feedbackContent = form.watch("content");

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: z.infer<typeof productFeedbackSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/send-product-feedback",
        {
          ...data,
          productName,
        }
      );
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

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-white pt-10">
      <div className="w-1/2 align-middle">
        <div className="w-full bg-white p-5 rounded-xl">
          <h1 className="text-4xl font-bold mb-6 text-center">{productName}</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="rating"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex pb-10 items-center">
                    <FormLabel className="text-center pr-5 pt-3">
                      Give your anonymous rating for the product
                    </FormLabel>
                    <FormControl>
                      <Rating
                        value={field.value || 3}
                        onChange={(_, value) => field.onChange(value)}
                        size="large"
                        sx={{
                          color: 'black',             // sets filled star color
                          '& .MuiRating-iconEmpty': {
                            color: 'gray',            // optional: sets empty star color
                          },
                        }}
                        precision={0.5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormLabel>Add Anonymous feedback for @{productName}</FormLabel>
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Input
                      {...field}
                      name="title"
                      className="border-indigo-100"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
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
        </div>
      </div>
    </div>
  );
};

export default productReviewPage;
