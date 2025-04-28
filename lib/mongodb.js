import mongoose from 'mongoose';

// Get the MongoDB URI from environment variables
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Ensure the database name is 'tonyluxe'
if (MONGODB_URI.includes('?')) {
  // If there are query parameters, insert the database name before them
  MONGODB_URI = MONGODB_URI.replace(/\/([^\/?]+)(\?|$)/, '/tonyluxe$2');
} else {
  // If there are no query parameters, simply append the database name
  MONGODB_URI = MONGODB_URI.replace(/\/([^\/?]+)$/, '/tonyluxe');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
