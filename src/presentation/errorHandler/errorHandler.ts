// errorHandler.ts
import { Response } from "express";
import { CustomError } from "../../domain";

export const handleErrors = async (error: unknown, res: Response) => {
    if (error instanceof CustomError) return res.status(error.statusCode).json({ error: error.message });
    console.log(error, 'que error me trae');
    return res.status(500).json({ error: 'Internal Server Error' });
}