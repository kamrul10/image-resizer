import dotenv from "dotenv";
import logger from "../utils/logger";
import AWS from "aws-sdk";
import { Consumer,SQSMessage } from "sqs-consumer";
dotenv.config();
import  {resizeImage} from  "./libs"
logger.info("Worker Started Successfully");

// Set the region


// Create an SQS service object
const sqs = new AWS.SQS({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.REGION
});

const queueURL = process.env.AWS_SQS_URL;
logger.info(queueURL)



const app = Consumer.create({
  queueUrl: queueURL,
  handleMessage: async (message:SQSMessage) => {
    if (JSON.parse(message.Body).identify==='ragnar'){
        const messageBody = JSON.parse(message.Body)
        // do some work with `message`
        resizeImage(messageBody)
    }

  },
  sqs
});

app.on('error', (err:Error) => {
  logger.error(err.message);
});

app.on('processing_error', (err:Error) => {
  logger.error(err.message);
});

app.start();
