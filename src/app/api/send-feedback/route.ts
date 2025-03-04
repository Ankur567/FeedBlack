import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { Feedback } from "@/model/User";

export async function POST(request: Request) {
    await connectDB()

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user) {
            return Response.json(
                { 
                    success: false,
                    feedback: "User not found"
                }, { status: 404 }
            )
        }

        // is user accepting feedbacks?
        if(!user.isAcceptingFeedback) {
            return Response.json(
                { 
                    success: false,
                    feedback: "User is not accepting feedbacks"
                }, { status: 401 }
            )
        }
        const newFeedback = {content, dateCreated: new Date()} 
        user.feedbacks.push(newFeedback as Feedback)
        await user.save()
        return Response.json(
            { 
                success: true,
                feedback: "Feedback sent succesfully"
            }, { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return Response.json(
            { 
                success: false,
                feedback: "Error sending feedback"
            }, { status: 500 }
        )
    }
}