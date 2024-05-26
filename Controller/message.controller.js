const { ImageModel } = require("../Model/ImageModel");
const { ConversationModel } = require("../Model/conversation.model");
const { MessageModel } = require("../Model/message.model");
const { io, getReceiverSocketId } = require("../Socket/socket");
const path = require("path");




const message = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const { message: content } = req.body;
        const senderId = req.userId;

        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        if (req.file) {
            const { originalname, filename } = req.file;
            const fileExtension = path.extname(originalname); 
            let type = ""; 

            if (fileExtension === ".png" || fileExtension === ".jpg" || fileExtension === ".jpeg") {
                type = "image";
            }else if(fileExtension===".mp3"){
                 type="audio"
            }else if(fileExtension===".pdf"){
                type="pdf"
            }
            
            else {
                type = "video";
            }

            const newMessage = new MessageModel({
                senderId,
                receiverId,
                name: originalname,
                id: filename,
                messageType: type
            });

            await newMessage.save();

            conversation.messages.push(newMessage._id);
            await conversation.save();

            const receiverSocketId = getReceiverSocketId(receiverId);

            if (receiverSocketId !== null && receiverSocketId !== undefined) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            return res.status(200).send({ msg: newMessage });
        } else {
            const newMessage = new MessageModel({
                senderId,
                receiverId,
                message: content,
            });

            await newMessage.save();

            conversation.messages.push(newMessage._id);
            await conversation.save();

            const receiverSocketId = getReceiverSocketId(receiverId);

            if (receiverSocketId !== null && receiverSocketId !== undefined) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            return res.status(200).send({ msg: newMessage });
        }
    } catch (error) {
        return res.status(400).send({ msg: error });
    }
};












// const sendImage = async (req, res) => {

//     try {
//         const { originalname, filename } = req.file;
//         const { id: receiverId } = req.params;
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         const senderId = req.userId;


//         const newImage = new ImageModel({
//             name: originalname,
//             id: filename,
//             receiverId,
//             senderId,
            

//         });
//         let conversation = await ConversationModel.findOne({
//             participants: { $all: [senderId, receiverId] }

//         });

//         if (!conversation) {
//             conversation = await ConversationModel.create({
//                 participants: [senderId, receiverId],
//                 messages: []
//             });
//         }
//         conversation.messages.push(newImage._id);

//         await conversation.save();
//         const data = await newImage.save();
//         res.status(200).json({ "msg": "image upload" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// const getimage = async (req, res) => {
//     try {
//         const senderId = req.userId;
//         const { id: userToChatId } = req.params;
//         console.log('Sender ID:', senderId);
//         console.log('User to Chat ID:', userToChatId);
//         //  const image= await ImageModel.find({$and:[{senderId},{userToChatId}]})
//         const image = await ImageModel.findOne({ senderId });

//         if (image == null) {
//             return res.status(200).send({ "msg": '' });
//         }
//         return res.status(200).send({ "msg": image });
//     } catch (error) {
//         console.log("error in getImage controller", error);
//         return res.status(400).send({ "msg": error });
//     }
// }

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

       
        return res.status(200).send({ "msg": conversation.messages });
    } catch (error) {
        console.log("error in getMessage controller", error);
        return res.status(400).send({ "msg": error });
    }
};

module.exports = { message, getmessage};