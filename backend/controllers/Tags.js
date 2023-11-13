const Tag = require("../models/Tag");

// createTag 

exports.createTag = async (req, res) => {
    try {

        //fetching data
        const { name, description } = req.body;

        //validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //create entry in DB

        const tagDetails = await Tag.create({ name, description });

        console.log(tagDetails);
        //return a response

        return res.status(200).json({
            success: false,
            message: "Tag created successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// getAllTags

exports.showAlltags = async (req, res) => {
    try {

        const allTags = await Tag.find({}, { name: true, description: true });

        res.status(200).json({
            success: true,
            message: "All tags fetched",
            allTags
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

