import { MongoClient, Db } from "mongodb";

let client: MongoClient;

export async function connectToDb(): Promise<{ db: Db; client: MongoClient }> {
  const uri = process.env.MONGODB_URI!; 

  if (!client) {
    client = new MongoClient(uri); 
    await client.connect();
  }

  const db = client.db("spchess"); 

  return { db, client };
}
