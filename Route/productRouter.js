const express = require("express")
const  mongose  = require("mongoose") 
const multer = require("multer")
const productSchema = require("../model/productSchema")
const sharp = require("sharp")
const productRouter = express.Router()
const Auth  = require("../config/auth")


productRouter.get("/new", Auth,(req, res) =>{
    res.render("newProduct", {
        title: "Upload new product",
        user:req.user
    })
})


const storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, Date.now() + "--"+ file.originalname )
    },

    destination:function(req, file, cb){
        cb(null, "./public/img/upload/")
    }
})

const upload = multer({storage:storage}).array("myfiles", 5)


productRouter.post("/new", upload, async (req, res) =>{
    let {productName, amount} = req.body
    let myfiles = req.files
    // console.log(myfiles);
   
    
    try {
        let myfileArray = [];
         myfiles.forEach(element => {
             
             const dbFile ={
                 filename : element.filename,
                 size : element.size
             }
             myfileArray.push( dbFile)
      });


            let product = new productSchema({
                productName,
                amount,
                myfiles: myfileArray,
                postedBy:req.user.id,
               


               
            })

            await product.save((err, data) =>{
                if(err)throw err
                if(data){
                   console.log( req.files);
                    console.log(data);
                    res.redirect("/")
                }
            })
    
        
    } catch (error) {
        console.log(error);
    }

})


// get single product

productRouter.get("/:slug", async(req, res) =>{
    let single = await productSchema.findOne({slug:req.params.slug})
    res.render("singleProduct", {
        title: single.productName.slug,
        single,
          })
})
module.exports = productRouter
