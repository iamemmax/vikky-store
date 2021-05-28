const mongoose = require("mongoose")
// const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require("mongoose-findorcreate")
const User = new mongoose.Schema({
    googleId:{
        type:String
    },
    facebookId:{
        type:String
    },

    firstname:{
        type:String,
        trim:true
    },
    lastname:{
        type:String
    },
    username:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        trim:true
        
    },

    phone:{
        type: Number
    },
    gender:{
        type: String
    },
    dob:{
        type: String
    },

    address:{
        type: String

    },
    direction:{
        type: String

    },
    country:{
        type: String

    },
    zip:{
        type: String

    },
    facebook:{
        type: String

    },
    state:{
        type: String

    },
    lg:{
        type: String

    },
    city:{
        type: String

    },
    password:{
        type:String,
        required:[true, "password must not less than 2"],
        trim:true
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
User.plugin(findOrCreate);

// User.plugin(passportLocalMongoose);

module.exports = mongoose.model("users", User)