import dotenv from "dotenv";
import logger from "../src/utils/logger"
dotenv.config();
logger.info("hello from worker")
logger.info(process.env.NODE_ENV)