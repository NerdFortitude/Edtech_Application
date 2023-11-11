const nodemailer = require('nodemailer');
require("dotenv").config();


const mailSender  = async (email,subject,otp) => {

    try{
        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        const transporterResponse = await transporter.sendMail({
            from:'Nishant',
            to:`${email}`,
            subject:`${subject}`,
            html:`<h2>This is the verification email</h2> <p>${otp}</p>`
        });

        //only for testing the below two lines
        console.log("This is the response from teh transporter");
        console.log(transporterResponse);

        return transporterResponse;


    } catch(error){
        console.log("Something went wrong while sending the verification email");
        console.log(error.message);
    }
            
}

module.exports = mailSender;