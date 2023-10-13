// pages/api/getName.ts

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { connectToDb } from "../../utils/userMongo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const gpt3Response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `The name associated with the email ${email} is (if needed use any word from the name to help the model predict the name)): `,
        },
      ],
      model: "gpt-4",
    });

    const predictedName = gpt3Response.choices[0].message.content;

    const { db } = await connectToDb();

    const result = await db
      .collection("users")
      .updateOne({ email: email }, { $set: { name: predictedName } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ name: predictedName });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
