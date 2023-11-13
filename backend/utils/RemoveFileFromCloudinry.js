const cloudinary = require("cloudinary").v2;


exports.destroyFiles = async (public_id)=>{
    try{

        const response = await cloudinary.uploader.destroy(public_id);
        console.log("Item deleted successfully from cloudinary");
        console.log(response);

    } catch(error){
        console.log("Something went wrong while delering the file from cloudinary");
    }
}