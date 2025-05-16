import User from "../../model/user.model.js";
import cloudinary from "../../lib/cloudinary.js";

export default async function updateProfilePic(req, res){
   
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic) 
            return res.status(400).json({message: "Profile pic is required"});
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfilePic controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    
    }
}