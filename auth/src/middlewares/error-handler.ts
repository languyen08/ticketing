import { Request, NextFunction, Response } from "express";
import { CustomError } from "../error/custom-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).send(err.serializeErrors());
    }

    res.status(400).send({
        errors: [{message: 'Something went wrong'}]
    });
};
