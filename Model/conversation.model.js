const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: [],
        },
    ],
}, { timestamps: true });

const ConversationModel = mongoose.model("Conversation", conversationSchema);
module.exports = { ConversationModel }; 
