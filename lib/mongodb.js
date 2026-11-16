import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban_fit';
const dbName = process.env.MONGODB_DB || 'urban_fit';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

/**
 * Connect to MongoDB and return database instance and client
 */
export async function connectToDatabase() {
  try {
    const connectedClient = await clientPromise;
    const db = connectedClient.db(dbName);
    return { client: connectedClient, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

/**
 * Get MongoDB database instance directly
 */
export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

/**
 * Helper to safely convert string to ObjectId or return existing ObjectId
 */
export function toObjectId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string' && ObjectId.isValid(id) && id.length === 24) {
    return new ObjectId(id);
  }
  return null;
}

/**
 * Serialize MongoDB document (_id -> string, Dates -> ISO strings)
 */
export function serializeDoc(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  
  const serialized = Array.isArray(doc) ? [] : {};
  
  for (const [key, value] of Object.entries(doc)) {
    if (value instanceof ObjectId) {
      serialized[key] = value.toString();
    } else if (value instanceof Date) {
      serialized[key] = value.toISOString();
    } else if (value !== null && typeof value === 'object') {
      serialized[key] = serializeDoc(value);
    } else {
      serialized[key] = value;
    }
  }
  
  return serialized;
}

/**
 * Serialize an array of MongoDB documents
 */
export function serializeDocs(docs = []) {
  if (!Array.isArray(docs)) return [];
  return docs.map((doc) => serializeDoc(doc));
}

export default clientPromise;
