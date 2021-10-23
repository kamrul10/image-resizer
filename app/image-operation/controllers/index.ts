import { Request,Response } from "express";
import S3 from 'aws-sdk/clients/s3';
import logger from "../../../utils/logger";
import {awsConfig} from "../../config"
import { publishMessage } from "../libs";
import redisClient from "../../../utils/redis";
const s3bucket = new S3(awsConfig);
/**
 *
 * @param req
 * @param res
 */
export const imageUploadToS3 = (req:Request, res:Response)=>{
    try{
        req.body.files = req.files;
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


            }else{
                res.status(400).json({success:false, message: "Supported Image format are jpg and png"})
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
        const resizeRedisKey = req.body.original_image;
        let resizedData = await redisClient.getAsync(resizeRedisKey)
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

export const deleteUploadedImage = async (req:Request, res:Response)=>{
    try{
        // get resized info from redis
        const resizeRedisKey = req.body.original_image;
        const resizedData = await redisClient.getAsync(resizeRedisKey)

        //  array of file name which will  be deleted
        let filesToDelete:string[]  = []
        if (resizedData){
            filesToDelete = Object.keys(JSON.parse(resizedData)).map(key=>{
                return key+req.body.original_image
            })
        }

        filesToDelete.push(req.body.original_image)

        // delete files from  S3
        logger.info(filesToDelete)
        filesToDelete.forEach(async (fileName)=>{
            const params = {  Bucket: process.env.BUCKET_NAME, Key:fileName};
            const data = await s3bucket.deleteObject(params);
            logger.info("Success. Object deleted.", data);

        })

        // delete from redis
        await redisClient.deleteAsync(resizeRedisKey)

        res.status(200).json({success:true})
    }catch(error){
        logger.error(error)
        res.status(500).json({success:true, message: "Something went wrong"})
    }
}