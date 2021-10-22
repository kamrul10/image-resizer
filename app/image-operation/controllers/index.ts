import { Request,Response } from "express";
import S3 from 'aws-sdk/clients/s3';
import logger from "../../../utils/logger";
import {awsConfig} from "../../config"
import { publishMessage } from "../libs";
import redisClient from "../../../utils/redis";

/**
 *
 * @param req
 * @param res
 */
export const imageUploadToS3 = (req:Request, res:Response)=>{
    try{
        req.body.files = req.files;
        const s3bucket = new S3(awsConfig);

        logger.info(req.get('origin'))
        logger.info(req.headers.host)
        req.body.files.forEach(async (file:any) => {
            if(["image/png","image/jpg"].includes(file.mimetype)){
                // storing size of the uploading image
                let fileSize = await redisClient.getAsync('file_size') || 0
                fileSize = parseFloat(fileSize) + parseFloat(((parseInt(file.size,10)/1024)/1024).toFixed(3))
                redisClient.setAsync('file_size',fileSize)

                // // Uploading files to the bucket
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: file.originalname,
                    Body: file.buffer,
                    Tagging: `public=${req.body.public}`
                };
                s3bucket.upload(params, (err:Error, data:any) => {
                    if (err) {
                        throw err;
                    }

                    // send image data to sqs for resizing
                    const msgData = {
                        identify:"ragnar",
                        location:data.Location,
                        resolutions:JSON.parse(req.body.resolutions),
                        mime:file.mimetype,
                        originalName: file.originalname,
                        public:req.body.public,
                        origin: req.headers.origin
                    }
                    publishMessage(JSON.stringify(msgData))

                    // response uploaded s3 url to client side
                    res.status(200).json({success:true, message: "File uploaded successfully",data:data.Location})
                });


            }
        })
    }catch(error){
        logger.error(error)
        res.status(500).json({success:true, message: "Something went wrong"})
    }

}

/**
 *
 * @param req
 * @param res
 */
export const getResizeImageStat = async (req:Request, res:Response)=>{
    try{
        // get resized info from redis
        let resizeRedisKey = req.body.original_image;
        if(typeof(req.headers.origin)!==undefined && req.headers.origin){
            resizeRedisKey = resizeRedisKey + req.headers.origin
        }
        let resizedData = await redisClient.getAsync(req.body.original_image)
        if(resizedData){
            resizedData = JSON.parse(resizedData)
        }
        const data = {
            resized_data:resizedData,
            file_size: await redisClient.getAsync('file_size')
        }
        res.status(200).json({success:true,data})
    }catch(error){
        logger.error(error)
        res.status(500).json({success:true, message: "Something went wrong"})
    }


}