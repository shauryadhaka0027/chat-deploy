const express=require("express")
const { protectRoute } = require("../middleware/protectRoute")
const { message, getmessage} = require("../Controller/message.controller")
const { upload } = require("../Multer/Multer")
const messageRouter=express.Router()

messageRouter.post("/send/:id",upload.single("image"),protectRoute,message)
messageRouter.get("/get/:id",protectRoute,getmessage)
// messageRouter.post("/image/:id",upload.single("image"),protectRoute,sendImage)
// messageRouter.get("/getimage/:id",protectRoute,getimage)

module.exports={messageRouter}