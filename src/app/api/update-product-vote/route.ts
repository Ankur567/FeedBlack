import connectDB from "@/lib/connectDB";
import ProductModel from "@/model/Product";

export async function POST(request: Request) {
  await connectDB();

  const { productname, feedback, voteChange } = await request.json();
  try {
    const product = await ProductModel.findOne({ productname });
    if (!product) {
      return Response.json(
        { success: false, feedback: "Product not found" },
        { status: 404 }
      );
    }
    const feedbackIndex = product.feedbacks.findIndex(
      (f) => f.content === feedback.content
    );
    if (feedbackIndex === -1) {
      return Response.json(
        { success: false, feedback: "Feedback not found" },
        { status: 404 }
      );
    }
    const votes = product.feedbacks[feedbackIndex].votes;
    const newVoteCount = votes + voteChange;
    product.feedbacks[feedbackIndex].votes = newVoteCount;
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
