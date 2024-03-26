const express=require('express')
const { login, signup, logout, user } = require('../Controller/auth.controller')


const authRouter=express.Router()

authRouter.post("/register",signup)
authRouter.post("/login",login)
authRouter.post('/logout',logout)
authRouter.get('/data',user)



module.exports={authRouter}