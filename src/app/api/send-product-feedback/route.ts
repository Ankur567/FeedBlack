import connectDB from "@/lib/connectDB";
import { Feedback } from "@/model/Feedback";
import ProductModel from "@/model/Product";

export async function POST(request: Request) {
  await connectDB();

  const { productName, rating, content, title } = await request.json();
  try {
    const product = await ProductModel.findOne({ productname: productName });
    if (!product) {
      return Response.json(
        {
          success: false,
          feedback: "No Such Product Found",
        },
        { status: 400 }
      );
    }
    console.log(rating);
    const newFeedback = { rating, title, content, dateCreated: new Date() };
    product.feedbacks.push(newFeedback as Feedback);
    await product.save();
    return Response.json(
      {
        success: true,
        feedback: "Feedback sent succesfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        feedback: "Error sending feedback",
      },
      { status: 500 }
    );
  }
}
