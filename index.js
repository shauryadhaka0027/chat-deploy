const express=require("express")
const { connection } = require("./Config/db")
const { authRouter } = require("./Router/authRouter")
const cookieParser=require("cookie-parser")
const { messageRouter } = require("./Router/messageRouter")
const { userRouter } = require("./Router/userRouter")
const {app, server}=require("./Socket/socket")
var path = require('path');

require("dotenv").config()
const PORT=process.env.PORT
const cors= require("cors")
// const app= express()
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
    methods: ["GET", "POST","PATCH"],
}))
app.use(express.json())
app.use(cookieParser())
app.use("/auth",authRouter)
app.use("/msg",messageRouter)
app.use("/users",userRouter)
app.use("/",express.static(path.join(__dirname,'public')));

app.get("/",(req,res)=>{
    res.send("Chart app")
})






server.listen(PORT,async()=>{
    try {
        await connection
        console.log(`Server is start ${PORT} and db is also connected`)
    } catch (error) {
        
    }
})
