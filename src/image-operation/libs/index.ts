
import AWS from "aws-sdk";
import logger from "../../../utils/logger";
import { awsConfig } from "../../config";
export const  publishMessage = (msg:string) =>{
    // Create an SQS service object
    const sqs = new AWS.SQS(awsConfig);
    logger.info(msg)
    const params = {
    // Remove DelaySeconds parameter and value for FIFO queues
    DelaySeconds: 10,
    MessageAttributes: {
        "Title": {
        DataType: "String",
        StringValue: "Image Resize"
        },
        "Author": {
        DataType: "String",
        StringValue: "Kamrujjaman"
        }
    },
    MessageBody: msg,
    // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
    // MessageGroupId: "Group1",  // Required for FIFO queues
    QueueUrl: process.env.AWS_SQS_URL
    };

    sqs.sendMessage(params, (err, data)=> {
    if (err) {
        logger.error(err);
    } else {
        logger.info(data.MessageId);
    }
    });
}