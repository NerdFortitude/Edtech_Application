const Section  = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req,res) => {
    try{
        //data fetch
        const {sectionName,courseId} = req.body;
        //data validation

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //create section

        const newSection = await Section.create({sectionName});

        //update course with section objectID

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true}).populate('courseContent').exec();

        // HW:use populate to replace section/sub-sections both in the updatedCourseDetails

        // return response

        return res.status(200).json({
            success:true,
            message:"section Created successfully",
            updatedCourseDetails,
        })

    } catch(error){

       return res.status(500).json({
        success:false,
        message:"Something went wrong while creating section",
        error:error.message,
       })

    }
}

exports.updateSection = async (req,res) => {
    try{
        //data fetch

        const {sectionName, sectionId} = req.body;

        //data validtion

        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success:true,
                message:'Missing properties',
            });
        }

        //update the section in db 

        const updatedSection = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});


        //return response

        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
        });




    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update..Sections please try again later",
            error:error.message,
        })
    }
};


exports.deleteSection = async (req,res) => {
    try{

        // fetching

        const {sectionId, courseId} = req.params;

        //validate

        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        //find and delete

        const deletedSection = await Section.findByIdAndDelete(sectionId);

        //if the section user wants to delete does not exists
        if(!deletedSection){
            return res.status(404).json({
                success:false,
                message:"Section not found",
            });
        }


        //if it exists
        return res.status(200).json({
            success:true,
            message:"The section was deleted successfully",
        });


    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while deleting the section",
            error:error.message
        })
    }
}

