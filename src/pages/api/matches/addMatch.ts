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
    const insertedId = result.insertedId;
    const insertedDocument = await db
      .collection("matches")
      .findOne({ _id: insertedId });
    res.status(201).json({ success: true, data: insertedDocument });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
