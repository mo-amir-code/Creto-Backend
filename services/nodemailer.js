const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      },
})

exports.sendEmailOTP = async ({to, subject, html}) => {
    await transporter.sendMail({
        from: '"OTP for you 👻" <care@creto.com>',
        to: to,
        subject: subject,        
        html: html
    }) 
    
    console.log("OTP sent successfully")
}