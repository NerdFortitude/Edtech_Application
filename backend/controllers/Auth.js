const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.sendOTP = async (req, res) => {
    try {

        //fetch the email
        const { email } = req.body;
        //check if the email is already registered

        const userAlreadyRegistered = await User.findOne({ email });

        if (userAlreadyRegistered) {
            return res.status(409).json({
                success: false,
                message: "User Already exists(Occurred while sending the otp)"
            })
        }
        // now generate otp

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // the below way to verify the uniqueness of the otp is not very efficient here in production 
        // we generally use some third party services to do the sane


        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            result = await OTP.findOne({ otp: otp });
        }


        // after generatign the otp create a entry in the databse
        // in the OTP model

        const otpDBentryCreationResponse = await OTP.create({ email: email, otp: otp });


        //now as we have used the pre('save',async fucntion(next){}); it will send the email to the user with the otp

        return res.status(200).json({
            success: true,
            message: "Otp send to you email",
        });


    } catch (error) {

        console.log(error.message);
        console.log("Error while sending the otp");
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};


exports.signUp = async (req, res) => {
    try {

        //data fetching

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        //validate the data

        if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "All the fields are required",
            })
        }

        //match both the password

        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Both the passwords must be same",
            })
        }

        //check if the user already exists

        const userAlreadyRegistered = await OTP.findOne({ email });

        if (userAlreadyRegistered) {
            return res.status(409).json({
                success: false,
                message: "User already registered",
            })
        }

        //find the most recent otp stored for the user

        const mostRecentOtpUser = await OTP.find({ email: email }).sort({ createdAt: -1 }).limit(1);


        //validate the otp

        if (mostRecentOtpUser.otp.length == 0) {
            return res.status(409).json({
                success: false,
                message: "Otp not found on the server please generate a new otp",
            })
        } else if (otp !== mostRecentOtpUser.otp) {
            return res.status(400).json({
                success: false,
                message: "You entered a wrong otp",
            })
        }

        //hash the password

        const hashedPassword = await bcrypt.hash(password, 10);


        //also create a corresponding profile

        const profileDetailsUser = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });


        //create and entry in the Database

        const createdUser = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetailsUser._id,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`
        });


        //return a response

        return res.status(200).json({
            success: true,
            message: "User was registered successfully",
            createdUser,
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}



exports.login = async (req, res) => {
    try {

        //fetch the email and pass
        const { email, password } = req.body;

        //validate the email and password

        if (!email || !password) {
            return res.status(409).json({
                success: true,
                meessage: "All the fields are required",
            })
        }

        //check if the user exists 

        let userInDB = await User.findOne({ email });

        if (!userInDB) {
            return res.status(403).json({
                success: false,
                message: "The user does not exists"
            })
        }

        //now compare the password in the request bodu with the password in the Database

        if (!await bcrypt.compare(password, userInDB.password)) {
            return res.status(402).json({
                success: false,
                message: "The password is incorrect",
            });
        }

        //if matches then generate the jwt token

        const payload = {
            email: email,
            accountType: userInDB.accountType,

        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2hr',
        });


        userInDB = userInDB.toObject();
        userInDB.token = token;
        userInDB.password = undefined;


        // returning the response as a cookie

        return res
            .cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
            })
            .status(200).json({
                userInDB,
                success: true,
                message: "User successfully logged in",
            })


    } catch (error) {

        console.log("Something went wrong while logging you in");
        console.log(error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}


