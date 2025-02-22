import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await connectDB()

    try {
        let {username, code} = await request.json()
        username = decodeURIComponent(username)
        const user = await UserModel.findOne({username})
        if(!user) {
            return Response.json(
                {
                    success: false,
                    feedback: "User not found"
                }, {status:400}
            )
        }
        if(user.isVerified) {
            return Response.json(
                {
                    success: false,
                    feedback: "User already verified"
                }, {status:400}
            )
        }
        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date(Date.now())
        if(isCodeValid && !isCodeExpired) {
            user.isVerified = true
            user.save()
            console.log(isCodeExpired)
            return Response.json(
                {
                    success: true,
                    feedback: "User is verified successfully"
                }, {status:201}
            )
        } else if(!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    feedback: "Code is invalid"
                }, {status:400}
            )
        } else if(isCodeExpired) {
            return Response.json(
                {
                    success: false,
                    feedback: "Code has expired"
                }, {status:400}
            )
        }
    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json(
            {
                success: false,
                feedback: "Error verifying user"
            }, {status:500}
        )
    }
}