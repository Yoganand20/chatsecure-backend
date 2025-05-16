import User from "../../model/user.model.js";
import ContactList from "../../model/contactList.model.js";
import mongoose from "mongoose";
import Room from "../../model/room.model.js";

export const getContactsList = async (req, res) => {
  try {
    
    const contactList = await ContactList.find({ owner: req.user._id }).populate("contacts.user", "fullName email profilePic").populate("contacts.personalRoomId", "name users");
    if(contactList || contactList.length != 0) {
     // console.log(contactList[0].owner+" : "+contactList[0].contacts);
    }
    else{
      console.log("Empty contact list for user:", req.user._id);
    }
    res.status(200).json(contactList[0].contacts);
  }
  catch (error) {
    console.log("Error in getContactsList Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
}
export const getUsersList = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsersList Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const {id}=req.params;
    const users = await User.findOne({ _id: { id } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUser Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const {email}=req.params;
    const users = await User.findOne({ email:  email  }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUser Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


export const addToContactsList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.body; // personalRoomId is no longer from req.body.

    // Validate contactId
    if (!contactId) {
      return res.status(400).json({ error: "contactId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ error: "Invalid contactId format" });
    }

    // Verify user exists
    const contactUser = await User.findById(contactId);
    if (!contactUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent adding yourself as a contact
    if (userId.toString() === contactId.toString()) {
      return res.status(400).json({ error: "Cannot add yourself as a contact" });
    }

    // Create a new room for the contact
    const newRoom = new Room({
      owner: userId, // The user creating the room
      members: [userId, contactId], // Both users are in the room
      name: `${contactUser.fullName}`, // Unique room name
      isPersonal: true, // Indicate that this is a private room.
    });

    await newRoom.save();

    // Find or create the contact list
    let contactList = await ContactList.findOne({ owner: userId });

    if (!contactList) {
      contactList = new ContactList({
        owner: userId,
        contacts: [{ user: contactId, personalRoomId: newRoom._id }],
      });
    } else {
      // Check if contact already exists
      if (contactList.contacts.some((contact) => contact.user.toString() === contactId.toString())) {
        return res.status(409).json({ error: "Contact already exists in your list" });
      }

      // Add new contact
      contactList.contacts.push({ user: contactId, personalRoomId: newRoom._id });
    }
    await contactList.save();
    

    contactList = await ContactList.findOne({ owner: contactId });

    if (!contactList) {
      contactList = new ContactList({
        owner: contactId,
        contacts: [{ user: userId, personalRoomId: newRoom._id }],
      });
    } else {
      // Check if contact already exists
      if (contactList.contacts.some((contact) => contact.user.toString() === userId.toString())) {
        return res.status(409).json({ error: "Contact already exists in your list" });
      }

      // Add new contact
      contactList.contacts.push({ user: userId, personalRoomId: newRoom._id });
    }


    // Save the contact list
    await contactList.save();

    // Populate the contact information for the response
    const populatedContactList = await ContactList.findById(contactList._id)
      .populate("contacts.user", "name email avatar")
      .populate("contacts.personalRoomId", "name users")
      .populate("owner", "name email");

    res.status(200).json({
      success: true,
      message: "Contact added successfully, and a new room was created.",
      contactList: populatedContactList,
    });
  } catch (error) {
    console.error("Error adding to contact list:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};