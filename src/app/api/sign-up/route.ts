import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await connectDB()

    try {
        const {email, username, password} = await request.json()

        // finding user by username
        const existingUserVerrifiedByUsername = 
        await UserModel.findOne(
            {
                username: username,
                isVerified: true
            }
        )
        if (existingUserVerrifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    feedback: "Username already exists"
                }, { status: 400 }
            )
        }

        //finding user by email
        const existingUserByEmail = 
        await UserModel.findOne(
            {
                email: email
            }
        )
        const otpGenerator = () => {   
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let otp = '';
            for (let i = 0; i < 6; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              otp += characters[randomIndex];
            }
            return otp;
        } 
        const otp = otpGenerator()    // generating a new otp

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email"
                    }, { status: 400 }
                )
            } else {    // if a email already existing but unverified or want to change password
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = otp
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)
                existingUserByEmail.verifyCodeExpiry = expiryDate
                await existingUserByEmail.save()    
            }
        } else { // creating a new user
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: otp,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingFeedback: true,
                feedbacks: []
            })
            await newUser.save()
        }
        const emailResponse = await sendVerificationEmail(email, username, otp)  // sending verification mail
        if(!emailResponse.success) {       // if sending verification email fails
            return Response.json(
                {
                    success: false,
                    message: emailResponse.feedback
                }, { status: 500 }
            )
        }
        // if verify mail is sent with success
        return Response.json(
            {
                success: true,
                message: "Verification mail has been sent. Please verify your email"
            }, { status: 201 }
        )

    } catch (error) {
        console.log("Error in sign-up registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            }, { status: 500 }
        )
    }
}
