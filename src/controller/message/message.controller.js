import User from "../../model/user.model.js";
import Room from "../../model/room.model.js"
import Message from "../../model/message.model.js"
export const getMessagesByRoom = async (req, res) => {
  try {
    const {roomId}=req.params;
    const receiverId = req.user._id;
    //access messages stored on redis
    const messages = Message.find({roomId:roomId,receiverId:receiverId});
    //send json object list of all the message in that group for that user
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export const getRoomList=async (req,res)=>{
  try{
    const memberId = req.user._id;
    const rooms=Room.find({members:{$in:[memberId]}});
    res.status(200).json(rooms)
  }
  catch(error){
    console.log("Error in getMessages Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
}


export const createRoom = async (req, res) => {
  try {
      const  userId = req.user._id; // Assuming authenticated user's ID is available
      const { memberIds, groupName } = req.body;

      // Validate input
      if (!Array.isArray(memberIds) ){
          return res.status(400).json({ error: "memberIds must be an array" });
      }

      // Remove duplicates and ensure the creator isn't in members list
      const uniqueMemberIds = [...new Set(memberIds)];
      const filteredMemberIds = uniqueMemberIds.filter(id => id.toString() !== userId.toString());

      // Determine room name
      let finalRoomName = groupName;

      // If no groupName provided and only one member, use that member's name
      if (!groupName && filteredMemberIds.length === 1) {
          const otherUser = await User.findById(filteredMemberIds[0]);
          finalRoomName = otherUser?.name || `User ${filteredMemberIds[0]}`;
      }

      // Create the room with owner and members (including owner)
      const newRoom = await Room.create({
          name: finalRoomName,
          members: [...filteredMemberIds, userId], // Include creator in members
          owner: userId
      });

      // Populate the room data for response
      const populatedRoom = await Room.findById(newRoom._id)
          .populate('members', 'name email') // Only include name and email
          .populate('owner', 'name email');

      res.status(201).json({
          success: true,
          room: populatedRoom,
          message: "Group created successfully"
      });

  } catch (error) {
      console.error("Error creating group room:", error);
      res.status(500).json({ 
          success: false,
          error: "Internal server error",
          details: error.message 
      });
  }
};


export const postMessages = async (req, res) => {
  try {
    const {text,receiverId} = req.body;
    const {roomId} = req.params;
    const senderId = req.user._id;
    //code to store message in mongoDB
    const newMessage = await Message.create({
      text,
      senderId,
      receiverId,
      roomId
    });

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in getMessages Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
}