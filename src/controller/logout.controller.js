export default function logout(req, res){
    try {
        console.log("logging out user");
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}