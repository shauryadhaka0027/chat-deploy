const { AuthModel } = require("../Model/authmodel")

const getUserForSidebar=async(req,res)=>{
    const loggedInUserId = req.userId;
    // console.log("logg",loggedInUserId)
        try {
           
           
    const filterUserId = await AuthModel.find({ _id: { $ne: loggedInUserId } }).select("-password");
    // console.log("filterUserId ",filterUserId )
    res.status(200).send({ msg: filterUserId });
        } catch (error) {
            console.log("error in getuserforsidebar",error.msg)
            res.status(400).send({"msg":error})
        }
}

module.exports={getUserForSidebar}