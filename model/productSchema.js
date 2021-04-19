const mongoose = require("mongoose")
const slugify = require("slugify")
const productSchema = new mongoose.Schema({

    productName:{
        type: String,
        require:true
    },
    categories:{
        type: String,
        require:true
    },
    color:{
        type: String,
        require:true
    },
    brand:{
        type: String,
        require:true
    },
    sizes:{
        type: String,
        require:true
    },
    description:{
        type: String,
        require:true
    },
    quantity:{
        type:Number,
        default: "1"
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

