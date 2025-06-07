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
import { Rating } from "@mui/material";

type ProductFeedbackCardProps = {
  feedback: Feedback;
  name: string;
};

const ProductFeedbackCard = ({ feedback, name }: ProductFeedbackCardProps) => {
  const [countVotes, setCountVotes] = useState(feedback.votes);
  const [upflag, setUpflag] = useState(false);
  const [downflag, setDownflag] = useState(false);
  const [hasVoted, setHasVoted] = useState<"up" | "down" | null>(null);
  const [ipCheck, setIpCheck] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get("/api/get-feedback-votes", {
          params: { id: feedback._id, productname: name },
        });
        setCountVotes(response.data.feedback);
      } catch (err) {
        console.error("Error fetching vote count", err);
      }
    };

    fetchVotes(); // initial call
    const interval = setInterval(fetchVotes, 5000); // every 5 seconds

    setCountVotes(feedback.votes);
    if (!localStorage.getItem("feedbackVotes")) setIpCheck(true);
    const voteMap = JSON.parse(localStorage.getItem("feedbackVotes") || "{}");
    if (voteMap[String(feedback._id)]) {
      setHasVoted(voteMap[String(feedback._id)]);
      if (voteMap[String(feedback._id)] === "up") {
        setUpflag(true);
        setDownflag(false);
      } else if (voteMap[String(feedback._id)] === "down") {
        setDownflag(true);
        setUpflag(false);
      }
    }
    return () => clearInterval(interval);
  }, [feedback]);

  const updateVotes = async (change: number) => {
    let hasVotedDummy = hasVoted;
    if (change < 0 && countVotes <= 0) {
      return; // Prevent negative votes
    }
    if (hasVoted == "up") {
      if (change > 0) {
        setUpflag(true);
        setDownflag(false);
        change = 0; // No change in votes
      } else {
        setUpflag(false);
        setDownflag(true);
        setHasVoted("down");
        hasVotedDummy = "down";
        setCountVotes((prev) => prev + change);
      }
    } else if (hasVoted == "down") {
      if (change < 0) {
        setDownflag(true);
        setUpflag(false);
        change = 0; // No change in votes
      } else {
        setDownflag(false);
        setUpflag(true);
        setHasVoted("up");
        hasVotedDummy = "up";
        setCountVotes((prev) => prev + change);
      }
    } else {
      if (change > 0) {
        setUpflag(true);
        setDownflag(false);
        setHasVoted("up");
        hasVotedDummy = "up";
        setCountVotes((prev) => prev + change);
      } else {
        setDownflag(true);
        setUpflag(false);
        setHasVoted("down");
        hasVotedDummy = "down";
        setCountVotes((prev) => prev + change);
      }
    }
    const voteMap = JSON.parse(localStorage.getItem("feedbackVotes") || "{}");
    voteMap[String(feedback._id)] = hasVotedDummy;
    localStorage.setItem("feedbackVotes", JSON.stringify(voteMap));
    console.log(`count after operation-${countVotes}`);
    try {
      const response = await axios.post("/api/update-product-vote", {
        productname: name,
        feedback: feedback,
        voteChange: change,
        ipCheck
      });
      console.log(response.data.feedback);
    } catch (error) {
      console.error("Error updating votes");
      setCountVotes((prev) => prev - change); // Revert the vote count on error
    }
  };

  return (
    <Card
      className={`card-bordered flex flex-col justify-between h-full ${
        feedback.sentiment === "Positive"
          ? "bg-green-50"
          : feedback.sentiment === "Negative"
            ? "bg-red-50"
            : ""
      }`}
    >
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <div>
              <CardTitle>{feedback.title}</CardTitle>
            </div>
            <div className="text-sm">
              {dayjs(feedback.dateCreated).format("MMM D, YYYY h:mm A")}
            </div>
          </div>
          <Rating
            name="read-only"
            value={feedback.rating}
            readOnly
            precision={0.1}
            size="small"
            sx={{
              color: "black",
              "& .MuiRating-iconEmpty": {
                color: "gray",
              },
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-grow">{feedback.content}</CardContent>

      <CardFooter className="mt-auto">
        <div className="flex flex-row items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => updateVotes(1)}
            disabled={upflag}
            className="bg-black text-white"
          >
            <ArrowUpFromDot />
          </Button>
          <span>{countVotes}</span>
          <Button
            variant="ghost"
            onClick={() => updateVotes(-1)}
            disabled={downflag || countVotes <= 0}
          >
            <ArrowDown />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductFeedbackCard;
