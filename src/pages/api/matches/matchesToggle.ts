
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../../utils/legacyMongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    const { db } = await connectToDb();
    const { visibility } = req.body;
    const result = await db
      .collection("matches")
      .updateMany({}, { $set: { visibility } });
    res.status(200).json({ success: true, data: result.modifiedCount });
  } else {
    res.status(405).json({ error: "Method Not Allowed" }); 
  }
};
