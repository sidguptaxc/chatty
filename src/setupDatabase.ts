import Logger from 'bunyan';
import { config } from './config';
import mongoose from "mongoose";


const log: Logger = config.createLogger('database');
export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => log.info("Connected to MongoDB"))
      .catch((error) => {
         log.error("Error connecting to MongoDB", error);
         return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect)
};
