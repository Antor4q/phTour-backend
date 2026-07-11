/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import { sendResponse } from "../../utils/rendResponse";
import httpStatus from "http-status-codes"


const createDivision = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
   
    const result = await DivisionServices.createDivision(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Division Created Successfully",
        data: result,
    })
})

const getAllDivisions = catchAsync(async(req:Request, res:Response) => {
    const result = await DivisionServices.getAllDivisions();
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

    const result = await DivisionServices.updateDivision(id as string, req.body);
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
    updateDivision,
    deleteDivision
}