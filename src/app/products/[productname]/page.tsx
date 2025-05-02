"use client";

import ProductFeedbackCard from "@/components/ProductFeedbackCard";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/model/Feedback";
import { ApiResponse } from "@/types/apiResponse";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const productReviewPage = () => {
  const params = useParams<{ productname: string }>();
  const productname = decodeURIComponent(params.productname);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const productFeedbackUrl = `${baseUrl}/p/${encodeURIComponent(productname) || ""}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productFeedbackUrl);
      alert("Profile URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy URL");
    }
  };

  useEffect(() => {
    const fetchfeedbacks = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "/api/get-product-feedbacks",
          {
            params: { productname: productname },
          }
        );
        if (Array.isArray(response.data.feedback)) {
          setFeedbacks(response.data.feedback);
        } else {
          setFeedbacks([]);
        }
      } catch (error) {}
    };
    fetchfeedbacks();
  }, []);
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">{productname}</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy the link to write review about this product</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={productFeedbackUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 text-gray-400"
          />
          <Button onClick={copyToClipboard} className="">
            Copy
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <ProductFeedbackCard
              key={index}
              feedback={feedback}
              name={productname}
            />
          ))
        ) : (
          <p>No feedbacks to display.</p>
        )}
      </div>
    </div>
  );
};

export default productReviewPage;
