import { MongoClient, Db } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(
    process.env.MONGODB_URI as string,
  );

  const db = client.db("test");
  cachedDb = db;
  return db;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = await connectToDatabase();

    if (req.query.email) {
      const email = req.query.email as string;
      const user = await db.collection("users").findOne({ email });
      return res.status(200).json({ userType: user?.type });
    }

    res.status(400).send("Email query parameter is required");
  } catch (error) {
    console.error("API Error", error);
    res.status(500).send("Error occurred while fetching user data");
  }
};
