const jwt = require("jsonwebtoken");
require("dotenv").config();


//auth

exports.auth = async (req,res,next) => {
   
    try{

        //extract token

        const token = req.cookies.token || req.body.token || req.header['authorization'].replace("Bearer","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }
        

        // verify the token

        try{

            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        } catch(error){
          //verification issue;

          return res.status(401).json({
            success:false,
            message:"Token is invalid"
          })
        }

        next();
        

    } catch(error){

        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the token"
        })

    }
}


//isStudent

exports.isStudent = async(req,res,next)=>{
    try{

        //now validating the user

        if(req.user.role !== "Student"){
             return res.json(403).json({
                success:false,
                message:"You are not a student",
             });
        }

        // once the verification is done call the next middleware

        next();

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while checking if the account type is student",
        })
    }
}

//isInstructor

exports.isInstructor = async (req,res,next) => {
    try{

      

        //now validating the user

        if(req.user.role !== "Instructor"){
             return res.json(403).json({
                success:false,
                message:"You are not an Instructor",
             })
        }

        // once the verification is done call the next middleware

        next();

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while checking if the account type is Instrcutor",
        });

    }
}



//isAdmin

exports.isInstructor = async (req,res,next) => {
    try{


        //now validating the user

        if(req.user.role !== "Admin"){
             return res.json(403).json({
                success:false,
                message:"You are not an Admin",
             })
        }

        // once the verification is done call the next middleware

        next();

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while checking if the account type is Admint",
        });
        
    }
}

