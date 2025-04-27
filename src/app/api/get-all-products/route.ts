import connectDB from "@/lib/connectDB";
import ProductModel from "@/model/Product";

export async function GET() {
  await connectDB();

  try {
    const products = await ProductModel.find();
    return Response.json(
      {
        success: true,
        feedback: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        feedback: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
