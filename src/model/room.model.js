import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        name:{
            type:String,
        },
        members:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        isPersonal:{
            type:Boolean,
            default:false,
        },
    }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;