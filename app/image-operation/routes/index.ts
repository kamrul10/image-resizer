
import multer from "multer";
import { Router,IRouter } from "express";
import { imageUploadToS3,getResizeImageStat,deleteUploadedImage } from "../controllers";
const imageRoutes: IRouter = Router();
const storage = multer.memoryStorage();
const multipleUpload = multer({ storage }).array('files');
const upload = multer({ storage }).single('file');



imageRoutes.post("/", multipleUpload,imageUploadToS3);
imageRoutes.post("/resize/stat",getResizeImageStat);
imageRoutes.post("/delete",deleteUploadedImage)

export default imageRoutes;

