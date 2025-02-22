import connectDB from "@/lib/connectDB";
import { z } from "zod"
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema"

// this route is made to check the username is unique or not ebven before user presses sign in through url
const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await connectDB()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        // validation with zod
        const result = usernameQuerySchema.safeParse(queryParam)

        console.log(result)
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    feedback: usernameErrors?.length > 0? usernameErrors.join(', '): 'Invalid query parameters'
                },{ status:400 }
            )
        }

        const {username} = result.data
        const existingverifiedUser = await UserModel.findOne({username, isVerified: true})
        if(existingverifiedUser) {
            return Response.json(
                {
                    success: false,
                    feedback: "Username already taken"
                }, {status:400}
            )
        }
        return Response.json(
            {
                success: true,
                feedback: "Username is unique"
            }, {status:200}
        )
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                feedback: "Error checking username"
            }, {status:500}
        )
    }
}
