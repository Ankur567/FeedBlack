import mongoose, { Document, Schema } from "mongoose";

export interface Feedback extends Document
{
    // _id: string;
    content: string;
    dateCreated: Date;
}

const FeedbackSchema: Schema<Feedback> = new Schema({
    content: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document
{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingFeedback: boolean;
    feedbacks: Feedback[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email ID is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid Email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingFeedback: {
        type: Boolean,
        default: true,
    },
    feedbacks: [FeedbackSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))

export default UserModel