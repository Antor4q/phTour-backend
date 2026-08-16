/* eslint-disable @typescript-eslint/no-explicit-any */
// import PDFDocument, { text } from "pdfkit"
// import AppError from "../errorHelpers/appError";


// export interface IInvoiceData {
//    transactionId: string;
//    bookingDate: Date;
//    userName : string;
//    tourTitle: string;
//    guestCount: string;
//    totalAmount: number
// }

// const generatePdf = async(invoiceData: IInvoiceData)=> {
//     try {
//         return new Promise((resolve, reject) => {
//             const doc = new PDFDocument({size: "A4", margin: 50})
//             const buffer : Uint8Array[]= [];

//             doc.on("data", (chunk)=> buffer.push(chunk))
//             doc.on("end",()=> resolve(Buffer.concat(buffer)))
//             doc.on("error", (err)=> reject(err))

//             // pdf content
//             doc.fontSize(20).text("Invoice", {align: "center"})
//             doc.moveDown()
//             doc.fontSize(14).text(`Transaction ID: ${invoiceData.transactionId}`)
//             doc.text(`Booking Date ${invoiceData.bookingDate}`)
//             doc.text(`Customer ${invoiceData.userName}`)
//             doc.moveDown()
//             doc.text(`Tour: ${invoiceData.tourTitle}`)
//             doc.text(`Tour: ${invoiceData.guestCount}`)
          
//             doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)}`)
//             doc.moveDown();

//             doc.text("Thank you for booking with us!", {align:"center"})
//             doc.end()
//         })
//     } catch (error:any) {
//         console.log(error);
//         throw new AppError(401, `Pdf creation error ${error.message}`)
//     }
// }

import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/appError";

export interface IInvoiceData {
   transactionId: string;
   bookingDate: Date;
   userName: string;
   tourTitle: string;
   guestCount: number;
   totalAmount: number;
}

const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer> => {
   try {
      return await new Promise<Buffer>((resolve, reject) => {
         const doc = new PDFDocument({
            size: "A4",
            margin: 50,
         });

         const chunks: Buffer[] = [];

         // =========================
         // PDF EVENTS
         // =========================

         doc.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
         });

         doc.on("end", () => {
            resolve(Buffer.concat(chunks));
         });

         doc.on("error", (error) => {
            reject(error);
         });

         // =========================
         // COLORS
         // =========================

         const primaryColor = "#111827";
         const secondaryColor = "#6B7280";
         const lightColor = "#F3F4F6";
         const borderColor = "#E5E7EB";
         const successColor = "#16A34A";

         // =========================
         // PAGE HEADER
         // =========================

         doc
            .fontSize(26)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text("INVOICE", 50, 50);

         doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text(
               "Tour Booking Invoice",
               50,
               82
            );

         // Company information
         doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text("TOURGO", 400, 50, {
               width: 145,
               align: "right",
            });

         doc
            .fontSize(9)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text(
               "Your trusted travel partner",
               350,
               68,
               {
                  width: 195,
                  align: "right",
               }
            );

         // Header divider
         doc
            .moveTo(50, 105)
            .lineTo(545, 105)
            .lineWidth(1)
            .strokeColor(borderColor)
            .stroke();

         // =========================
         // INVOICE INFORMATION
         // =========================

         doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text("Invoice Details", 50, 130);

         doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text(
               `Transaction ID: ${invoiceData.transactionId}`,
               50,
               150
            );

         doc.text(
            `Booking Date: ${invoiceData.bookingDate.toLocaleDateString(
               "en-GB"
            )}`,
            50,
            168
         );

         // =========================
         // CUSTOMER
         // =========================

         doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text("Billed To", 330, 130);

         doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text(invoiceData.userName, 330, 150);

         doc
            .fontSize(9)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text("Tour Booking Customer", 330, 168);

         // =========================
         // TOUR DETAILS TITLE
         // =========================

         doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text("Booking Summary", 50, 215);

         // =========================
         // TABLE HEADER
         // =========================

         const tableTop = 240;

         doc
            .rect(50, tableTop, 495, 35)
            .fill(lightColor);

         doc
            .fontSize(9)
            .font("Helvetica-Bold")
            .fillColor(primaryColor);

         doc.text("TOUR", 65, tableTop + 12);

         doc.text("GUESTS", 350, tableTop + 12);

         doc.text("AMOUNT", 450, tableTop + 12);

         // =========================
         // TABLE CONTENT
         // =========================

         const rowTop = tableTop + 35;

         doc
            .rect(50, rowTop, 495, 55)
            .lineWidth(1)
            .strokeColor(borderColor)
            .stroke();

         doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text(
               invoiceData.tourTitle,
               65,
               rowTop + 20,
               {
                  width: 250,
               }
            );

         doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(primaryColor)
            .text(
               `${invoiceData.guestCount}`,
               350,
               rowTop + 20
            );

         doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text(
               `৳${invoiceData.totalAmount.toFixed(2)}`,
               450,
               rowTop + 20
            );

         // =========================
         // PAYMENT SUMMARY
         // =========================

         const summaryTop = 370;

         doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text("Payment Summary", 350, summaryTop);

         doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text("Subtotal", 350, summaryTop + 30);

         doc
            .fillColor(primaryColor)
            .text(
               `৳${invoiceData.totalAmount.toFixed(2)}`,
               455,
               summaryTop + 30,
               {
                  width: 90,
                  align: "right",
               }
            );

         doc
            .moveTo(350, summaryTop + 55)
            .lineTo(545, summaryTop + 55)
            .lineWidth(1)
            .strokeColor(borderColor)
            .stroke();

         doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text("Total", 350, summaryTop + 72);

         doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .fillColor(successColor)
            .text(
               `৳${invoiceData.totalAmount.toFixed(2)}`,
               430,
               summaryTop + 70,
               {
                  width: 115,
                  align: "right",
               }
            );

         // =========================
         // PAYMENT STATUS
         // =========================

         doc
            .roundedRect(50, 370, 130, 30, 6)
            .fill("#DCFCE7");

         doc
            .fontSize(9)
            .font("Helvetica-Bold")
            .fillColor(successColor)
            .text(
               "✓  PAYMENT CONFIRMED",
               60,
               381
            );

         // =========================
         // THANK YOU SECTION
         // =========================

         doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .fillColor(primaryColor)
            .text(
               "Thank you for booking with us!",
               50,
               500,
               {
                  width: 495,
                  align: "center",
               }
            );

         doc
            .fontSize(9)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text(
               "We hope you have a wonderful journey.",
               50,
               522,
               {
                  width: 495,
                  align: "center",
               }
            );

         // =========================
         // FOOTER
         // =========================

         doc
            .moveTo(50, 750)
            .lineTo(545, 750)
            .lineWidth(1)
            .strokeColor(borderColor)
            .stroke();

         doc
            .fontSize(8)
            .font("Helvetica")
            .fillColor(secondaryColor)
            .text(
               "This is a computer-generated invoice and does not require a signature.",
               50,
               765,
               {
                  width: 495,
                  align: "center",
               }
            );

         doc
            .fontSize(8)
            .text(
               "© 2026 TOURGO. All rights reserved.",
               50,
               780,
               {
                  width: 495,
                  align: "center",
               }
            );

         // Finish PDF
         doc.end();
      });
   } catch (error: any) {
      console.error("PDF creation error:", error);

      throw new AppError(
         500,
         `PDF creation error: ${error.message}`
      );
   }
};

export default generatePdf;