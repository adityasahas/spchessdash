import { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../../utils/legacyMongo";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    const { db } = await connectToDb();
    const { _id } = req.body;
    const objectId = new ObjectId(_id); 
    const result = await db.collection("matches").deleteOne({ _id: objectId });
    res.status(200).json({ success: true, data: result });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
