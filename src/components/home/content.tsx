import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Divider } from "@nextui-org/react";
import { isFriday, isWithinInterval } from "date-fns";
import { motion } from "framer-motion";
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  
  return (
    <div className="flex flex-col justify-center items-center h-screen text-left  mx-5 md:mx-auto">
      <motion.div
        className="text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-4xl md:text-5xl font-bold" variants={itemVariants}>
          {chessClubMessage || "Welcome to the sp chess dashboard,"} <br />
          {session?.user?.name || session?.user?.email}
        </motion.h1>
        <motion.p className="text-2xl md:text-3xl mt-5" variants={itemVariants}>
          {date.toLocaleString()}
        </motion.p>
        <motion.div className="my-5" variants={itemVariants}>
          <Divider />
        </motion.div>
        <motion.p className="text-2xl  mt-5" variants={itemVariants}>
          Your auth session expires at: {formattedExpires}
        </motion.p>
      </motion.div>
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
