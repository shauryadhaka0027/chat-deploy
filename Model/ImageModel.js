const mongoose=require("mongoose")

const imageSchema = new mongoose.Schema({
    name: String,
     id: String,
     senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    
  });
  

  const ImageModel = mongoose.model('Image', imageSchema);

  module.exports={ImageModel}