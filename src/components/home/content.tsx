import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Divider } from "@nextui-org/react";
import { isFriday, isWithinInterval } from "date-fns";

export const Content = () => {
  const { data: session } = useSession();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const expiresDate = new Date(session?.expires || "");
  const formattedExpires = expiresDate.toLocaleString();

  const chessClubMessage = checkForChessClubMessage(date);

  return (
    <div className="flex flex-col justify-center items-center h-screen text-left mx-auto">
      <div className="text-left">
        <h1 className="text-5xl font-bold">
          {chessClubMessage || "Welcome to the sp chess dashboard,"} <br />
          {session?.user?.name || "Guest"}
        </h1>
        <p className="text-3xl mt-5">{date.toLocaleString()}</p>
        <Divider className="my-5" />
        <p className="text-3xl mt-5">
          Your auth session expires at: {formattedExpires}
        </p>
      </div>
    </div>
  );
};

function checkForChessClubMessage(date) {
  const pstDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );
  if (isFriday(pstDate)) {
    const chessClubStart = new Date(pstDate);
    chessClubStart.setHours(13, 10, 0);
    const chessClubEnd = new Date(pstDate);
    chessClubEnd.setHours(13, 55, 0);
    if (
      isWithinInterval(pstDate, { start: chessClubStart, end: chessClubEnd })
    ) {
      return "Welcome to Chess Club at Sierra Pacific!";
    }
  }
  return null;
}
