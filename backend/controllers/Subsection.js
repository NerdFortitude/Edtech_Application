const SubSection = require("../models/SubSection");
const Section = require("../models/Section");


//create SubSection


exports.createSubSection = async (req, res) => {
    try {

        //fetch data from request
        const { sectionId, title, timeDuration, description } = req.body;
        //fetch video from req.file

        const video = req.files.videoFile;
        //validation

        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //upload video on cloudinary 

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);


        //get the secure url 

        //create the subsection now

        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl:uploadDetails.secure_url,
        });

        
        //add the subsection id to the section 

        const updatedSection = await Section.findByIdAndUpdate(sectionId,{$push:{subSection:subSectionDetails._id}}).populate('subSection').exec();

        // log updated section here after adding populate query 

        
        return res.status(200).json({
            success:false,
            message:"Sub Section created successfully",
            subSectionDetails,
        })



    } catch (error) {

        return res.status(200).json({
            success:true,
            message:"Something went wrong while creating sub-section",
            error:error.message,
        });

    }
}


// updateSubSection

exports.updateSubSection = async (req,res) => {
    try{

        const toUpdate = {}
        //fetch data
        const {subSectionId, title, timeDuration, description } = req.body

       //fetch video from req.files.videoFile;

       const video = req.files.videoFile;


       //validate the data and add them  to toUpdate

       const subSectionToUpdate = await SubSection.findById(subSectionId);

       if(!subSectionId){
        return res.status(404).json({
            success:false,
            message:"The sub section not found"
        });
       }


       if(title){
        toUpdate.title = title;
       }

       if(timeDuration){
        toUpdate.timeDuration = timeDuration;
       }

       if(description){
        toUpdate.description = description;
       }

       if(video){
        const previousVideoId = subSectionToUpdate.videoUrl.split("/")[str.split("/").length-1].split('.')[0];
        
        //    then upload the video to cloudinary and then add te secure url to the 
        //    subSection 
       }

        

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while updating a subSection"
        });
    }
}





// deleteSubSection

