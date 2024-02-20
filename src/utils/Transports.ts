import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service:"hotmail",
    port: 587,
    secure:false,
    auth:{
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
    }
})

export const sendMail=(emails:string[],subject:string,message:string)=>{
    const emailsFormat = emails.join(";")
     return transporter.sendMail({
        from: `'Notifications SNOW QUEUE' <${process.env.EMAIL_SENDER}>`,
        to: "jonathan.hernandez.oliva@gmail.com",
        subject:subject,
        text:message
    })
}