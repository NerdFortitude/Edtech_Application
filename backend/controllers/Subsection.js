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



// deleteSubSection

