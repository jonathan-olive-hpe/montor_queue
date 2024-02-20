/*
const client = require('twilio')(process.env.ACCOUNTSID||"", process.env.AUTHTOKENTWILIO||"");

export const sendSMS= async(phoneNumber:string,bodyMessage:string)=>{
    try {
        client.messages.create({
            body: bodyMessage,
            from: process.env.SENDER_PHONE_NUMBER || "",
            to: `+${phoneNumber}`
        })
        .then((message: { sid: any; }) => console.log("message sent ",message))
    } catch (error) {
        console.log(error);
    }
}
export const phoneNumbers =[{name:"jonathan",number:"524491879188"},{name:"gustavo",number:"525639288507"}]

export const sendWhats= async(phoneNumber:string,bodyMessage:string)=>{
    try {
        const messageResponse = await client.messages.create({
            body: bodyMessage,
            from: `whatsapp:+${process.env.SENDER_WHATSAPP_NUMBER || ""}`,
            to: `whatsapp:+${phoneNumber}`
        })
        console.log(messageResponse)
    } catch (error) {
        console.log(error);
    }
}
*/