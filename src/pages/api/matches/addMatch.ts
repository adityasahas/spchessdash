import { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../../utils/legacyMongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { db } = await connectToDb();
    const { player1, player2, matchTime, visibility = "private" } = req.body;
    const result = await db.collection("matches").insertOne({
      player1,
      player2,
      matchTime,
      visibility,
      createdAt: new Date(),
    });
    res.status(201).json({ success: true, data: result.ops[0] });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
