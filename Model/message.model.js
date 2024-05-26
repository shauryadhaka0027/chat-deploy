const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String
    }, 
    name: String, 
    id: String ,
    messageType:String
}, { timestamps: true });

const MessageModel = mongoose.model("Message", messageSchema);
module.exports = { MessageModel }; 
