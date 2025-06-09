import connectDB from "@/lib/connectDB";
import ProductModel from "@/model/Product";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { productname, feedback, voteChange, ipCheck, fingerprint } =
    await request.json();
  try {
    const product = await ProductModel.findOne({ productname });
    if (!product) {
      return Response.json(
        { success: false, feedback: "Product not found" },
        { status: 404 }
      );
    }
    const feedbackIndex = product.feedbacks.findIndex(
      (f) => (f._id as any).toString() === feedback._id
    );
    if (feedbackIndex === -1) {
      return Response.json(
        { success: false, feedback: "Feedback not found" },
        { status: 400 }
      );
    }
    // Prevent duplicate voting from same IP
    if (ipCheck && product.feedbacks[feedbackIndex].voters.includes(ip)) {
      return Response.json(
        { success: false, feedback: "Already voted from this IP" },
        { status: 403 }
      );
    }
    if (
      ipCheck &&
      product.feedbacks[feedbackIndex].fingerprints?.includes(fingerprint)
    ) {
      return Response.json(
        { success: false, feedback: "Already voted from this IP" },
        { status: 404 }
      );
    }
    const votes = product.feedbacks[feedbackIndex].votes;
    const newVoteCount = votes + voteChange;
    if (newVoteCount < 0) {
      return Response.json(
        { success: false, feedback: "Vote count cannot be negative" },
        { status: 400 }
      );
    }
    product.feedbacks[feedbackIndex].votes = newVoteCount;
    product.feedbacks[feedbackIndex].voters.push(ip);
    product.feedbacks[feedbackIndex].fingerprints.push(fingerprint);
    await product.save();
    return Response.json(
      { success: true, feedback: "Vote updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, feedback: "Error updating vote" },
      { status: 500 }
    );
  }
}
