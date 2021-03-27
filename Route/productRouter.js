const express = require("express")
const  mongoose  = require("mongoose") 
const multer = require("multer")
const productSchema = require("../model/productSchema")
const cartSchema = require("../model/CartSchema")
const sharp = require("sharp")
const productRouter = express.Router()
const auth  = require("../config/auth")


productRouter.get("/new", auth, async(req, res) =>{
    let cart = await cartSchema.findOne({userId:req.user.id}).populate("productId")
    let mycart = await cart.userCart.map(c => c.quantity)

    res.render("newProduct", {
        title: "Upload new product",
        user:req.user,
        cart,
        mycart
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
    let {productName, amount, brand, description, categories, sizes, color} = req.body
    let myfiles = req.files
    // let {filename:myfiles} = req.files
    
    
    try {
        let myfileArray = [];
        myfiles.forEach(element => {
             sharp(element.path)
             .resize(200, 300, {
                kernel: sharp.kernel.nearest,
                fit: 'contain',
                position: 'right top',
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
              })
              .toFile('e-shop.png')
             
             const dbFile ={
                 filename : element.filename,
                 size : element.size
             }
             myfileArray.push( dbFile)
      });


            let product = new productSchema({
                productName,
                amount,
                description,
                categories,
                sizes,
                color,
                brand,
                myfiles: myfileArray,
                postedBy:req.user.id,
               


               
            })

            await product.save((err, data) =>{
                if(err)throw err
                if(data){
                //    console.log( req.files);
                    // console.log(data);
                    res.redirect("/")
                }
            })
    
        
    } catch (error) {
        console.log(error);
    }

})


// get single product

productRouter.get("/:slug", auth, async(req, res) =>{
    let single = await productSchema.findOne({slug:req.params.slug})

    let cart =  await cartSchema.findOne({userId:req.user.id},(err, data) =>{
        if(err)throw err
      }).populate("postedBy product")
     
      let mycart = cart.userCart.map(da =>da.quantity);
    
    res.render("singleProduct", {
        title: single.productName.slug,
        single,
        user:req.user,
        cart,
        
          })

        // console.log(single);
})



         
module.exports = productRouter

