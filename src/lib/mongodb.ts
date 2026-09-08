import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB ?? "vinayaka-committee"

// Cache the client across hot reloads so serverless functions don't open a
// new connection on every invocation.
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient
}

export async function connectToDatabase(): Promise<Db> {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your .env.local file.",
    )
  }

  let client = globalForMongo.mongoClient
  if (!client) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    await client.connect()
    globalForMongo.mongoClient = client
  }

  return client.db(dbName)
}

export async function withDatabase<T>(
  operation: (db: Db) => Promise<T>,
): Promise<T> {
  const db = await connectToDatabase()
  return operation(db)
}