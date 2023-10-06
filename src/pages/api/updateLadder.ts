import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const url = process.env.MONGODB_URI;
const dbName = 'spchess';
interface LadderData {
    _id: ObjectId;
    pos: number;
    name: string;
  }
const updateDatabase = async (data: LadderData[]) => {
    if (!url) {
        throw new Error('MONGODB_URI is not defined');
      }
const client = new MongoClient(url);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('ladder');

    await collection.deleteMany({});
  
    await collection.insertMany(data);
  } finally {
    await client.close();
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body;
    
    try {
      await updateDatabase(data);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });  
  }
};
