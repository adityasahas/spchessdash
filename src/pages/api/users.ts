import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectToDb } from "../../utils/userMongo";
import { ObjectId } from 'mongodb';  // Import the ObjectId constructor

interface UserTypeUpdate {
  userId: string;
  userType: string;
}

interface ResponseData {
  success: boolean;
  message?: string;
  users?: Array<any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getSession({ req });

  const { method } = req;
  const { db } = await connectToDb();

  switch (method) {
    case 'GET': {
      const users = await db.collection('users').find().toArray();
      res.status(200).json({ success: true, users });
      break;
    }
    case 'POST': {
      const { userId, userType }: UserTypeUpdate = req.body;
    if (
      !userId ||
      (userType !== "" &&
        userType !== "student" &&
        userType !== "admin" &&
        userType !== null)
    ) {
      res.status(400).json({ success: false, message: "Invalid request" });
      return;
    }



      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },  
        { $set: { type: userType } }
      );
      res.status(200).json({ success: true });
      break;
    }
    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
