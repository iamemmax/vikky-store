const mongoose = require("mongoose")
// const passportLocalMongoose = require("passport-local-mongoose")
const User = new mongoose.Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    username:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true,
        
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