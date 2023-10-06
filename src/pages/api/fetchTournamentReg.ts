import { connectToDb } from "../../utils/legacyMongo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db, client } = await connectToDb();
  const registrationCollection = db.collection("tournament_registrations");

  if (req.method === "GET") {
    try {
      const regs = await registrationCollection.find({}).toArray();
      res.status(200).json(regs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await registrationCollection.deleteMany({});
      res.status(200).json({ message: "All registrations have been cleared." });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear registrations" });
    }
  }
}
