const mongoose  = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
    },
    otp:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{
      type:Date,
      default:date.now,
      expires: 5*60,
    }
});


// function that sends veification email

async function verificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,'verifiction email ',otp);
        console.log("Email sent sucessfully");
        console.log(mailResponse);

    } catch(error){
        console.log(error);
        throw error;
    }
};


//pre save hook
// will send the mail to the user with the otp before making an entry in the databse
OTPSchema.pre('save',async function(next){
    await verificationEmail(this.email,this.otp);
    next(); //call the next middleware
});


module.exports = mongoose.model("OTP",OTPSchema);