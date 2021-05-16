const express = require("express")
const  mongoose  = require("mongoose") 
const multer = require("multer")
const productSchema = require("../model/productSchema")
const cartSchema = require("../model/CartSchema")
const sharp = require("sharp")
const productRouter = express.Router()
const auth  = require("../config/auth")


productRouter.get("/new", auth, async(req, res) =>{
    
        res.render("add-product", {
            title: "Upload new product",
            user:req.user,
        
            layout: "./layouts/dashboard-layout"

        
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

productRouter.get("/categories/shoe", async (req, res) =>{
    let products = await productSchema.find({categories:"shoe"})

   
     res.render("categories/shoe", {
         title : "freaky-store || shoes category",
         user:req.user,
         products,
         
         layout: "././layouts/search-category"
     })

      
})

productRouter.get("/categories/fashion",  async (req, res) =>{
    let products = await productSchema.find({categories:"wares"})

    

        res.render("categories/fashion", {
            title : "freaky-store || fashion category",
            user:req.user,
            products,
            layout: "././layouts/search-category"
        })
      

})
productRouter.get("/categories/phone",  async (req, res) =>{
    let products = await productSchema.find({categories:"phone"})

   
        res.render("categories/phone", {
            title : "freaky-store || phone category",
            user:req.user,
            
            products,
            layout: "././layouts/search-category"
        })
      

})
productRouter.get("/categories/computer", async (req, res) =>{
    let products = await productSchema.find({categories:"computer"})

  
        res.render("categories/computer", {
            title : "freaky-store || computer category",
            user:req.user,
        
            products,
            layout: "././layouts/search-category"
        })
      

})
productRouter.get("/categories/electronic",  async (req, res) =>{
    let products = await productSchema.find({categories:"electronic"})

    
        res.render("categories/electronic", {
            title : "freaky-store || electronics category",
            user:req.user,
            products,
            layout: "././layouts/search-category"
        })
      

})

productRouter.get("/categories/small",  async (req, res) =>{
    let products = await productSchema.find({sizes:"s"})

    
        res.render("sizes/small", {
            title : "freaky-store || small search",
            user:req.user,
            products,
            layout: "././layouts/search-category"
        })
      

})

productRouter.get("/categories/medium",  async (req, res) =>{
    let products = await productSchema.find({sizes:"m"})

    
        res.render("sizes/medium", {
            title : "freaky-store || medium search",
            user:req.user,
            products,
            layout: "././layouts/search-category"
        })
      

})
productRouter.get("/categories/large",  async (req, res) =>{
    let products = await productSchema.find({sizes:"l"})

    
        res.render("sizes/large", {
            title : "freaky-store || large search",
            user:req.user,
            products,
            layout: "././layouts/search-category"
        })
      

})
productRouter.get("/categories/xl",  async (req, res) =>{
    let products = await productSchema.find({sizes:"xl"})

    
        res.render("sizes/xl", {
            title : "freaky-store || xl search",
            user:req.user,
            products,
            layout: "././layouts/search-category"
        })
      

})
productRouter.get("/categories/xxl",  async (req, res) =>{
    let products = await productSchema.find({sizes:"xxl"})

    
        res.render("sizes/xxl", {
            title : "freaky-store || xxl search",
            user:req.user,
            products,
            layout: "././layouts/search-category"
        })
      

})
productRouter.get("/categories/xxxl",  async (req, res) =>{
    let products = await productSchema.find({sizes:"xxxl"})

    
        res.render("sizes/xxxl", {
            title : "freaky-store || xxxl search",
            user:req.user,
            products,
            layout: "././layouts/search-category"
        })
      

})
// get single product

productRouter.get("/:slug",  async(req, res) =>{
    let single = await productSchema.findOne({slug:req.params.slug})

 
        res.render("singleProduct", {
            title: single.productName.slug,
            single,
            user:req.user,
            
            layout: "./layouts/sidebar"

              })
      

    })
    


// get user product

productRouter.get("/myproduct/:id", auth, async (req, res) =>{
    let products = await productSchema.find({postedBy:req.params.id})
   
            res.render("myProduct", {
                title:"my product",
                user:req.user,
                products,
                 layout: "./layouts/dashboard-layout"

                

            })
        
     
    

})



productRouter.get("/edit/:id", auth, async (req, res) =>{
    let products = await productSchema.findOne({_id:req.params.id})
   


            res.render("editMyProduct", {
                title:"edit product",
                user:req.user,
                products
            })
        
        
    

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

