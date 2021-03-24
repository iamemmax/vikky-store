const mongoose = require("mongoose")
const cartSchema = new mongoose.Schema({
    

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },

    userCart:[
        {
         productId:{
             type: mongoose.Schema.Types.ObjectId,
         ref:"products",
        
    },

        quantity:{
        type:Number,
        default: 1,
    },

    price:{
        type:Number,
        require:true
    },
     
addedAt:{
    type : Date,
    default:Date.now
},

        }

    ],

    totalPrice: {
        type:Number,
        default: "0",

    }
    

    
        

   

})

module.exports = mongoose.model("cart", cartSchema)