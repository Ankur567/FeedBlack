"use client";

import ProductFeedbackCard from "@/components/ProductFeedbackCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "@/model/Feedback";
import { ApiResponse } from "@/types/apiResponse";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Rating from "@mui/material/Rating";

const productReviewPage = () => {
  const params = useParams<{ productname: string }>();
  const productname = decodeURIComponent(params.productname);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const productFeedbackUrl = `${baseUrl}/p/${encodeURIComponent(productname) || ""}`;
  const router = useRouter();
  const addReview = () => {
    router.replace(`/p/${encodeURIComponent(productname) || ""}`);
  };

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const fetchfeedbacks = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>(
          "/api/get-product-feedbacks",
          {
            params: { productname: productname },
          }
        );
        const feedbackData =
          typeof response.data.feedback === "string"
            ? JSON.parse(response.data.feedback)
            : response.data.feedback;
        setRating(feedbackData.rating);
        if (feedbackData && Array.isArray(feedbackData.feedbacks)) {
          setFeedbacks(feedbackData.feedbacks);
        } else {
          setFeedbacks([]);
        }
        if (refresh) {
          toast({
            title: "Refreshed products",
            description: "Showing latest products",
          });
        }
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setFeedbacks]
  );

  useEffect(() => {
    fetchfeedbacks();
  }, []);

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <div className="flex flex-row items-center justify-between mb-4 pb-5">
        <h1 className="text-4xl font-bold mb-4">{productname}</h1>
        <div className="flex flex-col items-end">
          <Rating
            name="read-only"
            value={rating}
            readOnly
            precision={0.1}
            size="large"
            sx={{
              color: "black",
              "& .MuiRating-iconEmpty": {
                color: "gray",
              },
            }}
          />
          <h2>
            {rating} out of 5 based on {feedbacks.length} reviews
          </h2>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-left">
          <h2 className="text-lg font-semibold mb-2 pr-10">
            Do you want to add a review for this product?
          </h2>
          <Button onClick={addReview}>Add Review</Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {!isLoading ? (
          feedbacks.length > 0 ? (
            currentFeedbacks.map((feedback, index) => (
              <ProductFeedbackCard
                key={index}
                feedback={feedback}
                name={productname}
              />
            ))
          ) : (
            <p>No feedbacks to display.</p>
          )
        ) : (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-20 w-20 animate-spin" />
          </div>
        )}
      </div>
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              />
            </PaginationItem>
          )}
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default productReviewPage;
