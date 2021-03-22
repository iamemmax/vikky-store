const mongoose = require("mongoose")
// const passportLocalMongoose = require("passport-local-mongoose")
const User = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true,
        
    },

    password:{
        type:String,
        require:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    },

    userImg:{
        type: String,
        default: "default.png"
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"products"
    },

})


// User.plugin(passportLocalMongoose);

module.exports = mongoose.model("users", User)