import User from "../../model/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken.js";
import ContactList from "../../model/contactList.model.js";
import mongoose from "mongoose";

export default async function signup(req, res) {
  console.log("Crating a new user");
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    //hashPassword
    const salt = await bcrypt.genSalt(10); //add salt to password
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();
      console.log("User created successfully");

      const newContactList = new ContactList({
        owner: newUser._id,
        contacts: [],
      });
  
      await newContactList.save();
      console.log("Created empty contact list for user:", newUser._id);

      
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
