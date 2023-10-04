import { MongoClient, Db } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

let client: MongoClient;

async function connectToDatabase(): Promise<Db> {
    if (!client) {
        client = await MongoClient.connect(process.env.MONGODB_URI as string);
    }
    const db = client.db("test");
    return db;  
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase();
    
    try {
        if (req.query.email) {
            const email = req.query.email as string;
            const user = await db.collection('users').findOne({ email });
            return res.status(200).json({ userType: user?.type });
        }
    } finally {
        await client.close();
    }

    res.status(400).send('Email query parameter is required');
}
