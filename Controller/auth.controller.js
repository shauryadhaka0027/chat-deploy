const { AuthModel } = require("../Model/authmodel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret_key = process.env.token_key;

const signup = async (req, res) => {
    const { fullname, username, password, gender, profilePic, confirm } = req.body;
    try {
        if (password !== confirm) {
            return res.status(200).send({ "msg": "Passwords do not match" });
        }

        const user = await AuthModel.findOne({ username });
        if (user) {
            return res.status(200).send({ "msg": "Username already exists" });
        }

        const hash = await bcrypt.hash(password, 5);
        const boyPic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlPic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new AuthModel({ fullname, username, password: hash, confirm, gender, profilePic: gender === "male" ? boyPic : girlPic });


        await newUser.save();


        const token = jwt.sign({ userId: newUser._id, fullname: newUser.fullname, username: newUser.username, profilePic: newUser.profilePic }, secret_key, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 10 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ "msg": { _id: newUser._id, fullname: newUser.fullname, username: newUser.username, profilePic: newUser.profilePic } });
    } catch (error) {
        res.status(400).send({ "msg": error });
    }
};

const update = async (req, res) => {
    try {
        const { _id } = req.params;

        const { username, fullname } = req.body
        const user = await AuthModel.findOne({ _id })
        const userdata=await AuthModel.findOne({username})
        
        if (user.username === username) {

            const data = await AuthModel.findByIdAndUpdate(_id, { fullname });
            res.status(200).send({ msg: 'User updated', });

        }
        else if (userdata) {
            res.status(200).json({ "msg": "user name already exits"})
        }
        // else if (req.file) {
        //     const { filename } = req.file
        //     const data = await AuthModel.findByIdAndUpdate(_id, { profilePic: filename })
        //     res.status(200).send({ msg: 'User pic  updated' });

        // }
        else {

            const data = await AuthModel.findByIdAndUpdate(_id, req.body);
            if (!data) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).send({ msg: 'User updated', });
        }

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const imageUpdate=async(req,res)=>{
    const {_id}=req.params
   try {
    if(req.file){
        const {filename}=req.file
        const findUser= await AuthModel.findOne({_id:_id})
        const data = await AuthModel.findByIdAndUpdate(_id,{profilePic:filename})
        res.status(200).send({"msg":"profile pic update",filename,findUser})
    }else{
        res.status(200).send({"msg":"filename is not find"})
    }

   } catch (error) {
    console.error("Error updating profile user:", error);
        res.status(500).json({ error: 'Internal server error' });
   }
}


const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await AuthModel.findOne({ username });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id, fullname: user.fullname, username: user.username, profilePic: user.profilePic }, secret_key, { expiresIn: "1d" });
                    res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 10 * 24 * 60 * 60 * 1000 });
                    return res.status(200).send({ "msg": { _id: user._id, fullname: user.fullname, username: user.username, profilePic: user.profilePic }, token });
                } else {
                    return res.status(200).send({ "msg": "Password is incorrect" });
                }
            });
        } else {
            return res.status(200).send({ "msg": "User not found" });
        }
    } catch (error) {
        res.status(400).send({ "msg": error });
    }
};
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const user = async (req, res) => {
    const { username } = req.body
    try {
        const data = await AuthModel.findOne({ username })
        res.status(200).send({ "data": data })
    } catch (error) {
        res.status(400).send({ "msg": error })
    }
}


const userdata=async(req,res)=>{
    const {_id}=req.params
    try {
        const ress= await AuthModel.findOne({_id:_id})
        res.status(200).send({"msg":ress})
    } catch (error) {
        console.log("Error in userdata controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = { signup, login, logout, user, update,imageUpdate,userdata };
