import connectDB from "@/lib/connectDB";
import ProductModel from "@/model/Product";

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const productname = searchParams.get("productname");

  if (!productname) {
    return Response.json(
      { success: false, feedback: "Product name is required" },
      { status: 400 }
    );
  }

  try {
    const existingProduct = await ProductModel.findOne({
      productname: { $regex: new RegExp(`^${productname.trim()}$`, "i") },
    });
    if (!existingProduct) {
      return Response.json(
        { success: false, feedback: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, feedback: existingProduct.feedbacks },
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
