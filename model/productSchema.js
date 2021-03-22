const mongoose = require("mongoose")
const slugify = require("slugify")
const productSchema = new mongoose.Schema({

    productName:{
        type: String,
        require:true
    },

    amount:{
        type: Number,
        require:true
    },

    myfiles:[],
        
    
    
           createdAt:{
            type:Date,
            default:Date.now()
        },
    

        postedBy:{
            type:mongoose.Schema.Types.ObjectId,
             ref:"users"
         },

         slug:{
             type:String,
             require:true

         }

         
        })

         productSchema.pre("validate", function(next){
            this.slug = slugify(this.productName, {
                lower:true,
                // strict:true
            })
        
            next()
        })
module.exports = mongoose.model("products", productSchema)

