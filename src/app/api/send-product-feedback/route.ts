import connectDB from "@/lib/connectDB";
import { Feedback } from "@/model/Feedback";
import ProductModel from "@/model/Product";

export async function POST(request: Request) {
  await connectDB();

  const { productName, content } = await request.json();
  try {
    const product = await ProductModel.findOne({ productname: productName });
    if (!product) {
      // making a new product and add the feedback to it
      const newproduct = new ProductModel({
        productname: productName,
        feedbacks: [],
      });
      const newFeedback = { content, dateCreated: new Date() };
      newproduct.feedbacks.push(newFeedback as Feedback);
      await newproduct.save();
      return Response.json(
        {
          success: true,
          feedback: "New product created and feedback sent succesfully",
        },
        { status: 200 }
      );
    }

    const newFeedback = { content, dateCreated: new Date() };
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
