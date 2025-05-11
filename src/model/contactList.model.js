import mongoose from "mongoose";

const contactListSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contacts: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            personalRoomId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
                required: true,
            },
        },
        ,
    ],
});

const ContactList = mongoose.model("ContactList", contactListSchema);

export default ContactList;
