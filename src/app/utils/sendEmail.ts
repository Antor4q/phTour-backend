/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import { envVar } from "../config/env"
import path from "path"
import ejs from "ejs"
import AppError from "../errorHelpers/appError"

const transporter = nodemailer.createTransport({
    // host: Number(envVar.EMAIL_SENDER.SMTP_HOST),
    // port: envVar.EMAIL_SENDER.SMTP_PORT,
    secure: true,
    auth:{
        user: envVar.EMAIL_SENDER.SMTP_USER,
        pass: envVar.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(envVar.EMAIL_SENDER.SMTP_PORT),
    host: envVar.EMAIL_SENDER.SMTP_HOST
})

interface SendEmailOptions {
    to: string, 
    subject:string,
    templateName: string,
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[] 
}

export const sendEmail = async({
    to,
    subject,
    templateName,
    templateData,
    attachments
}:SendEmailOptions) => {
   try {
      const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
    const html = await ejs.renderFile(templatePath, templateData)
    const info = await transporter.sendMail({
        from: envVar.EMAIL_SENDER.SMTP_FORM,
        to: to,
        subject: subject,
        html:html,
        attachments: attachments?.map(attachment => ({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType
        }))
    })
    console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
    
   } catch (error:any) {
    console.log("email sending error", error.message)
    throw new AppError(401, "Email error")
   }
}