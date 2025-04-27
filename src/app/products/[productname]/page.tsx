"use client";

import ProductFeedbackCard from "@/components/ProductFeedbackCard";
import { Feedback } from "@/model/Feedback";
import { ApiResponse } from "@/types/apiResponse";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const productReviewPage = () => {
  const params = useParams<{ productname: string }>();
  const productname = params.productname;
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
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
    fetchfeedbacks()
  }, []);
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">{productname}</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback, index) => (
            <ProductFeedbackCard
              key={index}
              feedback={feedback}
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
