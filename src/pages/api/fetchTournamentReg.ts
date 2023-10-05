import { NextApiRequest, NextApiResponse } from "next";
import { connectToDb } from "../../utils/legacyMongo";
import { InsertOneResult, Document, Collection } from "mongodb";

export default async function registerTournament(req: NextApiRequest, res: NextApiResponse) {
  const { db, client } = await connectToDb();

  if (req.method === "POST") {
    const { name, email, chessUsername, rating } = req.body;

    try {
      const registrations: Collection = db.collection("tournament_registrations");

      const existingPlayer = await registrations.findOne({ email });

      if (existingPlayer) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const result: InsertOneResult<Document> = await registrations.insertOne({
        name,
        email,
        chessUsername,
        rating,
      });

      res.status(201).json({ success: true, insertedId: result.insertedId });
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(400).json({ success: false, message: 'An error occurred' });
    } finally {
      client.close();
    }
  } else {
    res.status(400).json({ success: false });
  }
}
