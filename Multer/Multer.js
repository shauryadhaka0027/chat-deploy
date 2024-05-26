const multer = require("multer");
const path = require("path");
const uuid = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/upload");
    },
    filename: function (req, file, cb) {
        const uniqueFilename = uuid.v4();
        const fileExtension = path.extname(file.originalname)
        console.log("file",fileExtension)
        const finalFilename = uniqueFilename + fileExtension; 
        cb(null, finalFilename);
    }
});

const upload = multer({ 
    storage,  
    limits: {
        fileSize: 1024 * 1024 * 10
    },
 
});

module.exports = { upload };
