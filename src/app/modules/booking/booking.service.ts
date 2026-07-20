/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";

import {BOOKING_STATUS, IBooking } from "./booking.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/appError";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslcommerz/sslcommerz.service";
import { ISSLCommerz } from "../sslcommerz/sslcommerz.interface";



/**
 * Duplicate DB Collections / replica
 * 
 * Relica DB -> [ Create Booking -> Create Payment ->  Update Booking -> Error] -> Real DB
 */

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

/**
 * Duplicate DB collections / relics
 * Reflica DB -> [create booking -> create payment -> update booking -> Error] -> Real DB
 * **/ 

const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    const session = await Booking.startSession();
    session.startTransaction()
    try{
        const transactionId = getTransactionId();
    const user = await User.findById(userId);
    if(!user?.phone || !user.address){
        throw new AppError(httpStatus.BAD_REQUEST,"Please Update Your Profile to Book a Tour")
    }

    const tour = await Tour.findById(payload.tour).select("costFrom")

    if(!tour?.costFrom){
        throw new AppError(httpStatus.BAD_REQUEST,"No Tour Cost Found!")
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount= Number(tour.costFrom) * Number(payload.guestCount!)


    const [booking] = await Booking.create(
  [
    {
      user: userId,
      status: BOOKING_STATUS.PENDING,
      ...payload,
    },
  ],
  { session }
);

    const [payment] = await Payment.create(
        [{
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId : transactionId,
        amount: amount
    }]
    ,{session})

    const updatedBooking = await Booking.findByIdAndUpdate(
        booking._id, 
        {payment: payment._id}, 
        {new:true,runValidators:true,session}
    )
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment")

      // ssl api st
      const userAddress = (updatedBooking?.user as any).address
      const userEmail = (updatedBooking?.user as any).email
      const userPhone = (updatedBooking?.user as any).phone
      const userName = (updatedBooking?.user as any).name
   
    const sslPayload: ISSLCommerz = {
        address : userAddress,
        email: userEmail,
        phoneNumber: userPhone,
        name: userName,
        amount: amount,
        transactionId: transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)
  
     // ssl api end

    await session.commitTransaction();
    session.endSession()
   
    return {
        paymentUrl: sslPayment?.GatewayPageURL,
        booking:updatedBooking
    }

    }catch(error:any){
// 
 await session.abortTransaction()
 session.endSession()
  throw error
    }
};

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)

const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {

    return {}
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};