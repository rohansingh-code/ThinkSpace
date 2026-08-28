import { ZodType } from "zod";
import { createNoteSchema,updateNoteSchema } from "../validation/note.schema";
import { Request,Response,NextFunction } from "express";

export function validateBody(schema : ZodType){
    return function(req:Request,res:Response,next:NextFunction){
        const result = schema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                message : "Validation error",
                error : result.error.flatten(),
            });
        }
        req.body = result.data;
        next();
    };
};



