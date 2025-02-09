
import nodemailer from 'nodemailer'
import { EventEmitter } from 'node:events';
import { Resend } from 'resend';

import { emailTemplate } from '../utils/email-template.utils.js';

export const sendEmailService = async({
    subject,
    html,
    to,
    cc,
    attachments=[]
}) => {
    try {
        console.log('Send mail credentials',{
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        
        const resend = new Resend(process.env.RESEND_API_KEY);


        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: process.env.USER_EMAIL,
        //         pass: process.env.EMAIL_PASSWORD
        //     },
        //     tls:{
        //         rejectUnauthorized:false
        //     }
        // })

        // const info = await transporter.sendMail({
        //     from:`"Email from Social APP 👻" <${process.env.USER_EMAIL}>`,
        //     to,
        //     cc,
        //     subject,
        //     // html: emailTemplate({message , subject }),
        //     html,
        //     attachments
        // })

        const response = await resend.emails.send({
            from:`"Email from Social APP 👻" <${process.env.USER_EMAIL}>`,
            to,
            subject,
            html
        });
        console.log('Mail sent successfully', response);    
        
       return response
    } catch (error) {
        console.log(error);
        return error
    }
}  
     



export const EmailEvent = new EventEmitter();

EmailEvent.on('sendEmail', async(...args)=>{
    const {subject , html , email , cc  , attachments=[]} = args[0]
    
    await sendEmailService({
        subject,
        html,
        to:email,
        cc,
        attachments
    })
})