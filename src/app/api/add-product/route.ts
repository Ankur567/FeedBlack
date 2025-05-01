import connectDB from "@/lib/connectDB";
import ProductModel from "@/model/Product";

export async function POST(request: Request) {
  await connectDB();

  const { productname, category } = await request.json();
  try {
    const existingproduct = await ProductModel.findOne({
      productname: productname,
    });
    if (existingproduct) {
      return Response.json(
        {
          success: false,
          feedback: "Product already exists",
        },
        { status: 400 }
      );
    }
    const newproduct = new ProductModel({
      productname: productname,
      category: category,
      feedbacks: [],
    });
    await newproduct.save();
    return Response.json(
      {
        success: true,
        feedback: "New product added succesfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        feedback: "Error adding product",
      },
      { status: 500 }
    );
  }
}
