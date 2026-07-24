const uploadToCloudinary = require("../utils/uploadToCloudinary");
const {complaintSchema} = require("../validators/complaintValidation")

const createComplaint = async(req,res)=>{
    const {title,description,location}=req.body;
    try{
    
    if(!req.file){
        return res.status(400).json({
            message:"no image provided by user"
        })
    }
    const result= await uploadToCloudinary(req.file.buffer);
    const imageUrl = await result.secure_url;
 
    const complaint = await Complaint.create({
        title,
        description,
        location,
        imageUrl
    })

    res.status(201).json({
        message:"complaint created successfully",
        complaint
    })


}catch(err){
    res.status(500).json({
            message:err.message
    })
    
}
}