"use strict"
import dotenv from "dotenv";
import morgan from "morgan";
import express,{Application,Request, Response, NextFunction} from "express";
import chalk from "chalk";
import cors from "cors";
import logger from "../utils/logger";
import bodyParser from "body-parser";
dotenv.config();
import redisClient from "../utils/redis"
// routes for different modules
import baseRoutes from "./routes/index";
// import config from "./config";
const app:Application = express();
const port = process.env.SERVER_PORT; // default port to listen;
export const createServer = () => {
  app.use(morgan("dev"));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors());
  app.use(bodyParser.json({ limit: "50mb" }));

    app.use(
      (req: Request, res: Response, next: NextFunction) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      }
    );
    // define a route handler for the default home page
    app.use("/", baseRoutes);


    // start the express server
    logger.info(
        chalk.underline("APP ENVIRONMENT: %s"),
        chalk.magenta(process.env.NODE_ENV)
    );
    return app
}
export const startServer = () => {
  redisClient.deleteAsync('file_size')
  app.listen( port, () => {
      createServer()
      // tslint:disable-next-line:no-console
      console.log(`server started at http://localhost:${ port }`);
  } );
}

startServer()