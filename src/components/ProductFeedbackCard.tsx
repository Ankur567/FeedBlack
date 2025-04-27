import { Feedback } from "@/model/Feedback";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import dayjs from "dayjs";

type productFeedbackCardProps = {
  feedback: Feedback;
};

const ProductFeedbackCard = ({ feedback }: productFeedbackCardProps) => {
  return (
    <Card
      className={`card-bordered ${
        feedback.sentiment === "Positive"
          ? "bg-green-50"
          : feedback.sentiment === "Negative"
            ? "bg-red-50"
            : ""
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{feedback.content}</CardTitle>
        </div>
        <div className="text-sm">
          {dayjs(feedback.dateCreated).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default ProductFeedbackCard;
