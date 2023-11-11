const User = require("../models/Users");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


//Generate reset Password token

exports.resetPasswordToken = async (req, res) => {

    try {
        //get the email from req body
        const { email } = req.body;

        //check user for this email, email validation
        if (!email) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check if the user exists or not

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status().json({
                success: false,
                message: "Your email is not registered with us"
            })
        }


        //generate token

        const token = crypto.randomUUID();



        //update the user entry with  token and expiry time

        const updatedUser = await User.findOneAndUpdate({ email }, { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, { new: true })

        //create a url and send mail containing the url and 

        const url = `http://localhost:3000/passwordreset/${token}`

        await mailSender(email, "Reset Password", `Inorder to reset the password click on this link: http://localhost:3000/passwordreset/${token}`)

        //return a response

        return res.status(200).json({
            success: true,
            message: "The reset password link has been mailed to the user"
        });

    } catch (error) {

        return res.status(500).json({
            success: true,
            message: "Something went wrong while generating the url to reset the password",
        })
    }

}



//resetPassword

exports.resetPassword = async (req, res) => {
    try {

        //we fetch the token, newPassword and confirmPassword  from the request body 
        const { token, newPassword, confirmPassword } = req.body;

        // validate the password

        if (!newPassword || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All the fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Both the passwords don't match"
            });
        }

        //validate the token

        const user = await User.findOne({ token });

        //check is the token is expired

        if (user.resetPasswordExpires <= Date.now()) {

            return res.status(403).json({
                success: true,
                message: "The token has expired"
            })
        }

        //hash the new password

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update the password in the database

        const userWithUpdatedPassword = await User.findOneAndUpdate({ token }, { password: hashedPassword }, { new: true })

        // return the response

        return res.status(403).json({
            success: false,
            message: "the password has been successfully updated",
        })

    } catch (error) {
        return res.status(500).json({
            success: true,
            message: "Something went wrong while reseting the password",
        })
    }
};

