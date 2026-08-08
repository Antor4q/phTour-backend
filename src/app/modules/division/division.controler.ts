/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";

import httpStatus from "http-status-codes"
import { sendResponse } from "../../utils/rendResponse";
import { IDivision } from "./division.interface";


const createDivision = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  
   const payload:IDivision = {
    ...req.body,
    thumbnail: req.file?.path
   }
    const result = await DivisionServices.createDivision(payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Division Created Successfully",
        data: result,
    })
})

const getAllDivisions = catchAsync(async(req:Request, res:Response) => {
    const query = req.query;
    const result = await DivisionServices.getAllDivisions(query as Record<string, string>);
     sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division Retrived Successfully",
        data: result,
    })
}
)
const getSingleDivision = catchAsync(async(req:Request, res:Response) => {
    const slug = req.params.slug as string
    const result = await DivisionServices.getSingleDivision(slug);
     sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Division Retrived Successfully",
        data: result,
    })
}
)
const updateDivision =  catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
     const payload:IDivision = {
    ...req.body,
    thumbnail: req.file?.path
   }

    const result = await DivisionServices.updateDivision(id as string, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division updated",
        data: result,
    });
});
const deleteDivision = catchAsync(async (req: Request, res: Response) => {
    const result = await DivisionServices.deleteDivision(req.params.id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted",
        data: result,
    });
});

export const DivisionControllers = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision
}