// pages/api/matches.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../../utils/legacyMongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { db } = await connectToDb();
    const matches = await db.collection("matches").find().toArray();
    res.status(200).json({ success: true, data: matches });
  } else {
    res.status(405).json({ error: "Method Not Allowed" }); 
  }
};
