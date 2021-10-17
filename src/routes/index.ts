"use strict";

import express, { Router, Request, Response, NextFunction, IRouter } from "express";
const router: IRouter = Router();
router.get( "/", ( req: Request, res:Response, next: NextFunction ) => {
    // render the index template
    res.status(200).json({"message": "Server is OK"});
} );
// router.use("/api/v1/products", productRoutes);

export default router