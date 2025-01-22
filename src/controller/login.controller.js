import User from "../model/user.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export default async function login(req, res){
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid credentials"});
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        generateToken(user._id,res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
          });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    
    }
}