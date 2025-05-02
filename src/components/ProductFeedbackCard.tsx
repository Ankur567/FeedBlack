import { Feedback } from "@/model/Feedback";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import dayjs from "dayjs";
import { ArrowDown, ArrowUpFromDot } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

type ProductFeedbackCardProps = {
  feedback: Feedback;
  name: string;
};

const ProductFeedbackCard = ({ feedback, name }: ProductFeedbackCardProps) => {
  const [countVotes, setCountVotes] = useState(feedback.votes);
  const [upflag, setUpflag] = useState(false);
  const [downflag, setDownflag] = useState(false);
  const [hasVoted, setHasVoted] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const voteMap = JSON.parse(localStorage.getItem("feedbackVotes") || "{}");
    if (voteMap[String(feedback._id)]) {
      setHasVoted(voteMap[String(feedback._id)]);
    }
  }, [feedback._id]);

  const updateVotes = async (change: number) => {
    if (hasVoted == "up") {
      if (change > 0) {
        setUpflag(true);
        setDownflag(false);
      } else {
        setUpflag(false);
        setDownflag(true);
        setCountVotes((prev) => prev + change);
      }
    } else if (hasVoted == "down") {
      if (change < 0) {
        setDownflag(true);
        setUpflag(false);
      } else {
        setDownflag(false);
        setUpflag(true);
        setCountVotes((prev) => prev + change);
      }
    } else {
      if (change > 0) {
        setUpflag(true);
        setDownflag(false);
        setCountVotes((prev) => prev + change);
      } else {
        setDownflag(true);
        setUpflag(false);
        setCountVotes((prev) => prev + change);
      }
    }
    setHasVoted(change > 0 ? "up" : "down");
    const voteMap = JSON.parse(localStorage.getItem("feedbackVotes") || "{}");
    voteMap[String(feedback._id)] = change > 0 ? "up" : "down";
    localStorage.setItem("feedbackVotes", JSON.stringify(voteMap));
    try {
      const response = await axios.post("/api/update-product-vote", {
        productname: name,
        feedback: feedback,
        voteCount: countVotes,
      });
      console.log(response.data.feedback);
    } catch (error) {
      console.error("Error updating votes:", error);
      setCountVotes((prev) => prev - change); // Revert the vote count on error
    }
  };
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
      <CardContent>jkjfjkf</CardContent>
      <CardFooter>
        <div className="flex flex-row items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => updateVotes(1)}
            disabled={upflag}
          >
            <ArrowUpFromDot className="h-5 w-5" />
          </Button>
          <span>{countVotes}</span>
          <Button
            variant="ghost"
            onClick={() => updateVotes(-1)}
            disabled={downflag}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductFeedbackCard;
