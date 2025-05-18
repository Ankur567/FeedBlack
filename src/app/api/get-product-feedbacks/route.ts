import connectDB from "@/lib/connectDB";
import ProductModel from "@/model/Product";

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const productname = searchParams.get("productname");
  const decodedProductName = decodeURIComponent(productname || "");

  if (!decodedProductName) {
    return Response.json(
      { success: false, feedback: "Product name is required" },
      { status: 400 }
    );
  }

  try {
    const existingProduct = await ProductModel.findOne({
      productname: decodedProductName,
    });
    if (!existingProduct) {
      return Response.json(
        { success: false, feedback: "Product not found" },
        { status: 404 }
      );
    }
    const feedbacks = existingProduct.feedbacks;
    let averageRating = 0;
    if (feedbacks.length > 0) {
      let sumRating = 0;
      feedbacks.forEach((feedback) => {
        sumRating += feedback.rating;
      });
      averageRating = sumRating / feedbacks.length;
    }
    existingProduct.rating = Number(averageRating.toFixed(1));
    await existingProduct.save();
    return Response.json(
      { success: true, feedback: existingProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("[send-product-feedbacks] Error:", error);
    return Response.json(
      { success: false, feedback: "Internal server error" },
      { status: 500 }
    );
  }
}
