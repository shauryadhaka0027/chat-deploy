const jwt = require("jsonwebtoken");
require("dotenv").config();

const protectRoute = (req, res, next) => {
    const token = req.cookies["token"] ||req.headers.authorization;
    // console.log("token",token)
    
    try {
        if (!token) {
            return res.status(400).send({ "msg": "Unauthorized, Token is not provided" });
        }
        jwt.verify(token, process.env.token_key, (err, decode) => {
            if (err) {
                res.status(200).send({ "msg": "Token is invalid" });
            } else {
                req.userId = decode.userId;
                console.log(decode, req.body);
                next();
            }
        });
    } catch (error) {
        res.status(400).send({ "msg": error });
    }
};

module.exports = { protectRoute };
