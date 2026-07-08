/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import { sendResponse } from "../../utils/rendResponse";
import httpStatus from "http-status-codes"


const createDivision = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
   
    const division = await DivisionServices.createDivision(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Division Created Successfully",
        data: division,
    })
})

export const DivisionControllers = {
    createDivision
}