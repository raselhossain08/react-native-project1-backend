import { Response } from "express";

export const sendErrors =(res: Response,message: string,statusCode:number) => {
    res.status(statusCode).json({message})
}