const express=require("express")
const { protectRoute } = require("../middleware/protectRoute")
const { getUserForSidebar } = require("../Controller/user.controller")
const userRouter=express.Router()


userRouter.get("/" ,protectRoute,getUserForSidebar)


module.exports={userRouter}