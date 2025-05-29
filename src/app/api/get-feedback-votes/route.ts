import connectDB from "@/lib/connectDB";
import ProductModel from "@/model/Product";

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const feedbackId = searchParams.get("id");
  const productname = searchParams.get("productname");

  try {
    const existingProduct = await ProductModel.findOne({
      productname: productname,
    });
    if (!existingProduct) {
      console.log("Product not found");
      return Response.json(
        { success: false, feedback: "Product not found" },
        { status: 404 }
      );
    }
    const feedbacks = existingProduct.feedbacks;
    const feedback = feedbacks.find((f) => String(f._id) === feedbackId);

    if (!feedback) {
      console.log("Feedback not found");
      return Response.json(
        { success: false, feedback: "Feedback not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, feedback: Number(feedback.votes) },
      { status: 200 }
    );
  } catch (error) {
    console.error("[get-feedback-votes] Error:", error);
    return Response.json(
      { success: false, feedback: "Internal server error" },
      { status: 500 }
    );
  }
}
