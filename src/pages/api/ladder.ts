import { connectToDb } from "../../utils/legacyMongo";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDb();

  const ladderData = await db
    .collection("ladder")
    .find({})
    .sort({ pos: 1 }) 
    .toArray();

  res.json(ladderData);
};
