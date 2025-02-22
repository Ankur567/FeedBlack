import {Feedback} from "@/model/User";

export interface ApiResponse {
    success: boolean;
    feedback: string;
    isAcceptingFeedback?: boolean;
    allFeedbacks?: Array<Feedback>;
}