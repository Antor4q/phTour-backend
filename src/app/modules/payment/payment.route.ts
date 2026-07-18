import express from "express"
import { PaymentController } from "./payment.controler";


const router = express.Router()

router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);


export const PaymentRouts = router;