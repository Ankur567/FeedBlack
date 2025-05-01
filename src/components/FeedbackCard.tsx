import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { CrossIcon, X, XIcon } from "lucide-react";
import dayjs from "dayjs";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Feedback } from "@/model/Feedback";

type feedbackCardProps = {
  feedback: Feedback;
  onFeedbackDelete: (feedbackId: string) => void;
};
const FeedbackCard = ({ feedback, onFeedbackDelete }: feedbackCardProps) => {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    if (!feedback || !feedback._id) {
      console.error("Feedback ID is missing:", feedback);
      return;
    }
    const response = await axios.delete<ApiResponse>(`/api/delete-feedback`, {
      data: { feedbackid: feedback._id },
    });
    toast({
      title: response.data.feedback,
    });
    onFeedbackDelete(feedback._id.toString());
  };
  return (
    <Card className={`card-bordered ${
      feedback.sentiment === "Positive"
        ? ""
        : feedback.sentiment === "Negative"
        ? "bg-gray-200"
        : "bg-gray-100"
    } rounded-xl`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{feedback.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-black rounded-2xl">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(feedback.dateCreated).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
      <CardContent>yo yo yo</CardContent>
    </Card>
  );
};

export default FeedbackCard;
