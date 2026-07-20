/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/appError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslcommerz/sslcommerz.interface";
import { SSLService } from "../sslcommerz/sslcommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes"

/* eslint-disable @typescript-eslint/no-unused-vars */
const initPayment = async (bookingId: string) => {
   const payment = await Payment.findOne({booking: bookingId})
   if(!payment){
    throw new AppError(httpStatus.NOT_FOUND,"Payment Not Found. You have no booked this tour.")
   }
  const booking = await Booking.findById(payment.booking)
    // ssl api st
    
         const userAddress = (booking?.user as any).address
         const userEmail = (booking?.user as any).email
         const userPhone = (booking?.user as any).phone
         const userName = (booking?.user as any).name
      
       const sslPayload: ISSLCommerz = {
           address : userAddress,
           email: userEmail,
           phoneNumber: userPhone,
           name: userName,
           amount: payment?.amount,
           transactionId: payment?.transactionId
       }
   
       const sslPayment = await SSLService.sslPaymentInit(sslPayload)
         return {
        paymentUrl: sslPayment.GatewayPageURL
    }
     
        // ssl api end

};
const successPayment = async (query: Record<string, string>) => {
    // update booking status to confirm and update payment status to paid
    const session = await Booking.startSession();
    session.startTransaction()
    try{
        //  const [booking] = await Booking.findByIdAndUpdate(
        //   [
        //     {
        //       user: userId,
        //       status: BOOKING_STATUS.PENDING,
        //       ...payload,
        //     },
        //   ],
        //   { session }
        // );
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:query.transactionId},
               {
                status: PAYMENT_STATUS.PAID
               }
            ,{new:true,runValidators:true,session})

            await Booking.findByIdAndUpdate(
                    updatedPayment?.booking, 
                    {status: BOOKING_STATUS.COMPLETE}, 
                    {runValidators:true,session}
                )
                
            
                await session.commitTransaction();
                session.endSession()
               
                return { success: true, message:"Payment Completed Successfully"  }
            
        
        

    }catch(error){
        console.log(error)
    }
};
const failPayment = async (query: Record<string, string>) => {
    // update booking status to fail and update payment status to fail

     const session = await Booking.startSession();
    session.startTransaction()
    try{
       
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:query.transactionId},
               {
                status: PAYMENT_STATUS.FAILED
               }
            ,{new:true,runValidators:true,session})

            await Booking.findByIdAndUpdate(
                    updatedPayment?.booking, 
                    {status: BOOKING_STATUS.FAILED}, 
                    {runValidators:true,session}
                )
                
            
                await session.commitTransaction();
                session.endSession()
               
                return { success: false, message:"Payment failed"  }
            
        
        

    }catch(error){
        console.log(error)
    }
};

const cancelPayment = async (query: Record<string, string>) => {
    // update booking status to cancel and update payment status to cancel
     const session = await Booking.startSession();
    session.startTransaction()
    try{
      
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:query.transactionId},
               {
                status: PAYMENT_STATUS.CANCELLED
               }
            ,{new:true,runValidators:true,session})

            await Booking.findByIdAndUpdate(
                    updatedPayment?.booking, 
                    {status: BOOKING_STATUS.CANCEL}, 
                    {runValidators:true,session}
                )
                
            
                await session.commitTransaction();
                session.endSession()
               
                return { success: false, message:"Payment Canceled"  }
            
        
        

    }catch(error){
        console.log(error)
    }
};


export const PaymentService = {
   initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};