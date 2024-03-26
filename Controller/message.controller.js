const { ConversationModel } = require("../Model/conversation.model");
const { MessageModel } = require("../Model/message.model");
const {  io, getReceiverSocketId } = require("../Socket/socket");

const message = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { message: content } = req.body;
        const senderId = req.userId;
        const newMessage = new MessageModel({
            senderId,
            receiverId,
            message: content
        })

        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }

        });

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }


        conversation.messages.push(newMessage._id);

        await conversation.save();
        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId); // Assuming getReceiverSocketId is a function that returns the socket ID for a given receiver ID
        // console.log("receiver", receiverSocketId, senderId); // Corrected spelling of "receiver"

        if (receiverSocketId !== null && receiverSocketId !== undefined) {
            io.to(receiverSocketId).emit("newMessage", newMessage); 
        }

        res.status(200).send({ "msg": newMessage });
    } catch (error) {
        res.status(400).send({ "msg": error });
    }
};
const getmessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const { id: userToChatId } = req.params;
        const conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages");

        if (conversation == null) {
            return res.status(200).send({ "msg": '' });
        }

        // console.log("conversation", conversation);
        return res.status(200).send({ "msg": conversation.messages });
    } catch (error) {
        console.log("error in getMessage controller", error);
        return res.status(400).send({ "msg": error });
    }
};

module.exports = { message, getmessage };