import mongoose from 'mongoose'
import logger from '../../config/logger'

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {

  static async connect( options: Options ) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect( mongoUrl, {
        dbName,
      });

      logger.info(`Connected to: ${mongoUrl}`)

      return true;

    } catch (error) {
      logger.error('Mongo connection error')
      throw error;
    }

  }

}