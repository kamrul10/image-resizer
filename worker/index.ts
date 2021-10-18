import dotenv from "dotenv";
import logger from "../utils/logger"
dotenv.config();
logger.info("hello from worker")
logger.info(process.env.NODE_ENV)