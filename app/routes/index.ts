"use strict";

import { Router, Request, Response, NextFunction, IRouter } from "express";
import imageRoutes from "../image-operation/routes";
const router: IRouter = Router();
router.get( "/", ( req: Request, res:Response, next: NextFunction ) => {
    // render the index template
    res.status(200).json({"message": "Server is OK"});
} );
router.use("/api/v1/images", imageRoutes);

export default router