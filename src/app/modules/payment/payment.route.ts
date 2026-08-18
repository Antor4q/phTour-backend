import express from "express"
import { PaymentController } from "./payment.controler";


const router = express.Router()

router.post("/init-payment/:bookingId", PaymentController.initPayment);
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.post("/invoice/:paymentId", PaymentController.getInvoiceDownloadUrl);


export const PaymentRouts = router;