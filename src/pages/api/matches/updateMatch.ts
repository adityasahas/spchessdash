// pages/api/updateMatch.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../../utils/legacyMongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const { db } = await connectToDb();
    const { _id, player1, player2, matchTime, visibility } = req.body;
    const result = await db.collection("matches").updateOne(
      { _id },
      {
        $set: {
          player1,
          player2,
          matchTime,
          visibility,
        },
      }
    );
    res.status(200).json({ success: true, data: result });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
