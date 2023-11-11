const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async() => {
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then((res)=>{
        console.log("The connection to the database was successfull");
    })
    .catch((error)=>{
        console.log("Something went wrong while connecting to the databse");
        console.log(error.message);
        process.env.exit(1);
    });
}

module.exports = connectDb;