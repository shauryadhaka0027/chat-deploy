const express=require('express')
const { login, signup, logout, user, update, imageUpdate, userdata } = require('../Controller/auth.controller')
const { upload } = require('../Multer/Multer')
const { protectRoute } = require('../middleware/protectRoute')


const authRouter=express.Router()

authRouter.post("/register",signup)
authRouter.post("/login",login)
authRouter.post('/logout',logout)
authRouter.get('/data',user)
authRouter.get("/userData/:_id",userdata)
authRouter.patch("/update/:_id",protectRoute,update)
authRouter.patch("/image/:_id",upload.single("image"),protectRoute,imageUpdate)



module.exports={authRouter}