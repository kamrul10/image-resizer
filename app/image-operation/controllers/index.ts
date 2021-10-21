import { Request,Response } from "express";
import S3 from 'aws-sdk/clients/s3';
import File from "multer"
import logger from "../../../utils/logger";
import {awsConfig} from "../../config"
import { publishMessage } from "../libs";
import redisClient from "../../../utils/redis";
/**
 * @ReqBody{}
 */
export const imageUploadToS3 = (req:Request, res:Response)=>{
    try{
        req.body.files = req.files;
        const s3bucket = new S3(awsConfig);

        // Uploading files to the bucket
        req.body.files.forEach((file:any) => {
            if(["image/png","image/jpg"].includes(file.mimetype)){
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
                        public:req.body.public
                    }
                    publishMessage(JSON.stringify(msgData))
                    res.status(200).json({success:true, message: "File uploaded successfully",data:data.Location})
                });


            }
        })
    }catch(error){
        logger.error(error)
        res.status(500).json({success:true, message: "Something went wrong"})
    }

}

export const getResizeImageStat = async (req:Request, res:Response)=>{
    try{
        let resizedData = await redisClient.getAsync(req.body.original_image)
        if(resizedData){
            resizedData = JSON.parse(resizedData)
        }
        res.status(200).json({success:true,data:resizedData})
    }catch(error){
        logger.error(error)
        res.status(500).json({success:true, message: "Something went wrong"})
    }


}