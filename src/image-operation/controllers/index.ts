import { Request,Response } from "express";
import S3 from 'aws-sdk/clients/s3';
import File from "multer"
import logger from "../../utils/logger";
import {awsConfig} from "../../config"
export const imageUploadToS3 = (req:Request, res:Response)=>{
    try{
        req.body.files = req.files;
        const s3bucket = new S3(awsConfig);

        // Uploading files to the bucket
        req.body.files.forEach((file:any) => {
            if(["image/png","image/jpg"].includes(file.mimetype)){
                logger.info(file.mimetype)
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
                    logger.info(`File uploaded successfully. ${data.Location}`);
                });
            }
        })

        res.status(200).json({success:true, message: "File uploaded successfully"})
    }catch(error){
        logger.error(error)
        res.status(500).json({success:true, message: "Something went wrong"})
    }

}