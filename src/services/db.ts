import mongoose, { Mongoose } from 'mongoose';
import { logger } from './logger';

/**
 * @returns connection string based on DB_HOST, DB_PASSWORD, DB_PORT, DB_USER and DB_DATABASE Environment Variables.
 * If not specified, defaults to local connection string
 */
const getDbConnectionString = (): string => {
  const { DB_CONNECTION_STRING } = process.env;

  return DB_CONNECTION_STRING ?? '';
};

/**
 * Connects to MongoDB and returns connection instance (if successful)
 */
const connectDB = async (): Promise<Mongoose> => {
  try {
    const connection = await mongoose.connect(getDbConnectionString(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info('💾 Connected to Database!');
    return connection;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export { connectDB };
