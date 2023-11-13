const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
      try{

        const options = {folder};

        if(height){
            options.height = height
        }

        if(quality){
            options.quality = quality
        }

        options.resource_type = "auto";

        return await cloudinary.uploader.upload(file.tempFilePath,options).then(()=>{console.log("File Uploaded successfully")});

      } catch(error){
        console.log("Something went wrong while uploading the image to cloudinary")
        console.log(error.message);
      }

}

// sabse pehle express-file upload use karo
// usse req object mein ek files object aajata hai
// usko .upload mein pass karna padta hai 


//options: - 
// resource_type:auto
// height:
// quality:
// width:
// folder: ye saare options
// cloudinary uploader.upload(file.tempath,options,(error,result)=>{
//
// })
// this returns a promise

