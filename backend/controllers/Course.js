const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create a course 
exports.createCourse = async (req, res) => {

    try {

        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        const { thumbnailImage } = req.files;

        //validation

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnailImage) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check for instructor (ek course ke andar uska instructor bhi store karna padta hai )

        const userId = req.user.id;

        const instructorDetails = await User.findById(userId);

        // for testing purpose only
        console.log(instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }

        //check given tag is valid or not

        const tagDetails = Tag.findById(tag);

        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: "Tag Details not found",
            })
        }


        //upload image to cloudinary
        const thumbnailImageInfo = uploadImageToCloudinary(thumbnailImage, process.env.FOLDER_NAME);


        //create an entry for a new course

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImageInfo.secure_url,
        });


        //update the instructor's course list

        await User.findByIdAndUpdate(instructorDetails._id, { $push: { courses: newCourse._id } }, { new: true });



        //update the tag schema 

        await Tag.findByIdAndUpdate(tagDetails._id, { $push: { courses: newCourse._id } }, { new: true });

        // return response

        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        });




    } catch (error) {

        console.log(error);
        return res.staus(500).json({
            success: false,
            message: "Failed to create a course",
            error: error.message,
        });


    }
}



// getAllCourses


exports.showAllCourses = async (req, res) => {
    try {

        const allCourses = await Course.find({}, { courseName: true, price: true, thumbnail: true, instructor: true, ratingAndReview: true, studentsEnrolled: true })
            .populate('instructor')
            .exec();
        // students enrolled is debatable may give an error;

        return res.status(200).json({
            success: true,
            message: 'Data for all courses fetched successfully',
            data: allCourses,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot Fetch course data',
            error: error.message,
        });
    }
}


