// here we will config out cloudinary for uploading media using the cloudinary.config() method it will take 
// an object with cloud_name api_key api_secret


const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const connectCloudinary = async (req,res) => {

    try{
        
        cloudinary.config({
            api_key:process.env.API_KEY,
            cloud_name:process.env.CLOUD_NAME,
            api_secret:processenv.API_SECRET,
        });

        console.log("Successfully connected to the cloudinary");


    } catch(error){
       console.log("Something went Wrong while connecting to cloudinary");
       console.log(error.message);
       process.exit(1)
    }
}


module.exports = connectCloudinary;