import Jimp from "jimp"
import logger from "../utils/logger";
import S3 from 'aws-sdk/clients/s3';
import redisClient from "../utils/redis"

const s3bucket = new S3(
    {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.REGION
    }
);
export const resizeImage = (messageBody:any)=>{
    Jimp
        .read(messageBody.location)
        .then(image => {
            messageBody.resolutions.forEach(async (resolution:any)=>{
                const buffer = await image
                    .resize(resolution.width, resolution.height).getBufferAsync(messageBody.mime) // resize
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: `${resolution.width}x${resolution.height}_${messageBody.originalName}`,
                    Body: buffer,
                    Tagging: `public=yes`
                };
                s3bucket.upload(params, async (err:Error, data:any) => {
                    if (err) {
                        logger.error(err)
                        throw err;
                    }
                    logger.info(data.Location)

                    // store resize update status to a key-value db for user acknowledgement
                    const resizeRedisKey = messageBody.originalName
                    let storedResized = await redisClient.getAsync(resizeRedisKey)
                    const key = `${resolution.width}x${resolution.height}`
                    if(storedResized) {
                        storedResized = JSON.parse(storedResized)
                    }else{
                        storedResized = {}
                    }
                    storedResized[key]={url:data.Location,public:resolution.public}
                    storedResized = JSON.stringify(storedResized)
                    await redisClient.setAsync(resizeRedisKey,storedResized)
                })
            })



        })
        .catch(err => {
            logger.error(err);
        });

}