const express = require("express")
const  mongoose  = require("mongoose") 
const multer = require("multer")
const productSchema = require("../model/productSchema")
const cartSchema = require("../model/CartSchema")
const sharp = require("sharp")
const productRouter = express.Router()
const auth  = require("../config/auth")


productRouter.get("/new", auth, async(req, res) =>{
    let cart = await cartSchema.findOne({userId:req.user.id}, (err, data)=>{
        if(err)console.log(err);
     }).populate("userCart.productId userId")
     if(cart){
         let myCart = cart.userCart.map(c => c.quantity)
         let totalQty = myCart.reduce((a, b) => a + b, 0)

         res.render("add-product", {
            title: "Upload new product",
            user:req.user,
            cart,
            totalQty,
            layout: "./layouts/dashboard-layout"
            
         
        })
     }else{
        res.render("add-product", {
            title: "Upload new product",
            user:req.user,
            cart,
            layout: "./layouts/dashboard-layout"

         
        })
     }
   

    
})


const storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, Date.now() + "--"+ file.originalname )
    },

    destination:function(req, file, cb){
        cb(null, "./public/img/upload/")
    }
})
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload an image.', 400), false);
    }
  };

const upload = multer({storage:storage,fileFilter:multerFilter}).array("myfiles", 5)


productRouter.post("/new", upload, async (req, res) =>{
    let error = []
    let {productName, amount, brand, description, categories, sizes, color} = req.body
    let myfiles = req.files
    // let {filename:myfiles} = req.files
    console.log(sizes);

    if(!productName || !amount || !brand || !description || !categories || !sizes || !color || !myfiles){

        error.push({msg: "all field are important"})
       res.redirect("/product/new")
    }
    
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


      if(error.length > 0){
          error.push({msg: "error"})
          res.redirect("/product/new")
      }else{

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
    
      }
    } catch (error) {
        console.log(error);
    }

})

productRouter.get("/shoe", auth, async (req, res) =>{
    let products = await productSchema.find({categories:"shoe"})

    console.log(products);
    let cart =  await cartSchema.findOne({userId:req.user.id},(err, data) =>{
        if(err)throw err
      }).populate("postedBy product")
     
      if(cart){
        let myCart = cart.userCart.map(c => c.quantity)
        let totalQty = myCart.reduce((a, b) => a + b, 0)

     res.render("shoe", {
         title : "myshoe",
         user:req.user,
         cart,
         products,
         totalQty,
         layout: "./layouts/sidebar"
     })

      }else{
        res.render("shoe", {
            title : "myshoe",
            user:req.user,
            cart,
            products,
            layout: "./layouts/sidebar"
        })
      }

})
// get single product

productRouter.get("/:slug", auth, async(req, res) =>{
    let single = await productSchema.findOne({slug:req.params.slug})

    let cart =  await cartSchema.findOne({userId:req.user.id},(err, data) =>{
        if(err)throw err
      }).populate("postedBy product")
     
      if(cart){
        let myCart = cart.userCart.map(c => c.quantity)
        let totalQty = myCart.reduce((a, b) => a + b, 0)

        res.render("singleProduct", {
            title: single.productName.slug,

            single,
            user:req.user,
            cart,
            totalQty,
            layout: "./layouts/sidebar"

             
        
        })

      }else{
        res.render("singleProduct", {
            title: single.productName.slug,
            single,
            user:req.user,
            cart,
            layout: "./layouts/sidebar"

              })
      }

    })
    


// get user product

productRouter.get("/myproduct/:id", auth, async (req, res) =>{
    let products = await productSchema.find({postedBy:req.params.id})
    let cart = await cartSchema.findOne({userId:req.user.id}, (err, data)=>{
        if(err)console.log(err);
     }).populate("userCart.productId userId")
     if(cart){
         let myCart = cart.userCart.map(c => c.quantity)
         let totalQty = myCart.reduce((a, b) => a + b, 0)


            res.render("myProduct", {
                title:"my product",
                user:req.user,
                cart,
                totalQty,
                products,
                layout: "./layouts/dashboard-layout"
               

            })

        }else{
            res.render("myProduct", {
                title:"my product",
                user:req.user,
                cart,
                 products,
                 layout: "./layouts/dashboard-layout"

                

            })
        }
     
    

})



productRouter.get("/edit/:id", auth, async (req, res) =>{
    let products = await productSchema.findOne({_id:req.params.id})
    let cart = await cartSchema.findOne({userId:req.user.id}, (err, data)=>{
        if(err)console.log(err);
     }).populate("userCart.productId userId")
     if(cart){
         let myCart = cart.userCart.map(c => c.quantity)
         let totalQty = myCart.reduce((a, b) => a + b, 0)


            res.render("editMyProduct", {
                title:"edit product",
                user:req.user,
                cart,
                totalQty,
                products,
               

            })

        }else{
            res.render("editMyProduct", {
                title:"edit product",
                user:req.user,
                cart,
                totalQty,
                products
            })
        }
        
    

})

// edit products by rightful owner




// edit product by user
productRouter.put("/edit/:id", auth, async(req, res) =>{
    let {productName, amount, brand, categories, color, sizes, description} = req.body
    let myfiles = req.files
    try {
        let myfileArray = [];
        

           productSchema.findOneAndUpdate({"_id":req.params.id}, {
             $set:{
                productName:productName,
                amount: amount,
                description: description,
                categories : categories,
                sizes: sizes,
                color: color,
                brand : brand,
                // "myfiles.$": myfileArray,
                "postedBy":req.user.id,
          }
        
        
        
        }, (err, data) =>{
            if(err)console.log(err);
            if(data){
                res.redirect(`/product/myproduct/${req.user.id}`)
            }
      }, {new:true});
    } catch (error) {
        console.log(error);
    }

})

         
// delete product by user
productRouter.delete("/del/:id", async(req, res) =>{
    await productSchema.findOneAndDelete({_id:req.params.id}, (err, data) =>{
        if(err)console.log(err);
        if(data){
            req.flash("success", "product deleted successfully")
            res.redirect(`/product/myproduct/${req.user.id}`)
        }
    })
})


module.exports = productRouter

