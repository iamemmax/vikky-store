const express = require("express")
const mongoose = require("mongoose")
const productSchema = require("../model/productSchema")
const CartSchema = require("../model/CartSchema")
const UserSchema = require("../model/UserSchema")
const cartRouter = express.Router()
const auth = require("../config/auth")


// get cart items
cartRouter.get("/:id", auth, async(req, res)=>{
    let cart = await CartSchema.find({userId:req.user.id}).populate("userCart.productId userId")
   

    res.render("mycart", {
        title : "my Cart",
        user: req.user,
        cart,
       
    })
    
})

// remove items from cart

cartRouter.put("/delete/:id", auth,  async (req, res) =>{

    let cart = await CartSchema.findOne({userId:req.user.id}, (err, data)=>{
        if(err)console.log(err);
        if(data){
            let removeproduct = data.userCart.find(c => c.id == req.params.id)
            if(removeproduct){
               CartSchema.findOneAndUpdate({userId:req.user.id}, {$pull:{
                "userCart":removeproduct
               }
            }).exec((err, _cart)=>{
                if(err){
                    console.log(err);
                }
                if(_cart){
                    res.redirect(`/users/cart/${req.user.id}`)
                    req.flash("deleted", "item deleted successfully")

                }
            })
            }else{
                console.log("not found");
            }
        }
    })
   
   
})
cartRouter.put("/edit/:id/",  async(req, res) =>{
  
      const  productId = req.params.id
    const price = parseInt(req.body.price)
       const quantity = req.body.quantity
    
    let cart = await CartSchema.findOne({userId:req.user.id}, (err, data)=>{
        if(err)console.log(err);
        if(data){
            let editproduct = data.userCart.find(c => c.id == req.params.id)
            if(editproduct){
                
                CartSchema.findOneAndUpdate({userId:req.user.id, "userCart.productId":editproduct.productId}, {
                    "$set":{
                        "userCart.$":{
                            quantity:quantity,
                            productId:editproduct.productId,
                            price:parseInt(quantity * price)
                            

                        }
                }
            }).exec((err, _cart)=>{
                if(err)console.log(err);
                if(_cart){
                    res.redirect(`/users/cart/${req.user.id}`)
                }
            })
                
            }else{
                console.log("not found");
            }
        }
    })
    
})






cartRouter.post("/:id", auth,(req, res)=>{
    
    const createCart = {
        productId:req.params.id,
        price:parseInt(req.body.price),
        quantity:req.body.quantity
    }

CartSchema.findOne({userId:req.user._id}).exec((err, cart)=>{
    if(err){
        console.log(err)
    }
    if(cart){
        let product = req.params.id
        let existingProduct = cart.userCart.find(c => c.productId == product)
        
        if(existingProduct){
            // if product is dsame with the product ind the database
            CartSchema.findOneAndUpdate({"userId":req.user._id, "userCart.productId":product}, {
                "$set":{ 
                    "userCart.$":{
                        ...createCart,
                        quantity:existingProduct.quantity +1,
                        price:existingProduct.quantity * existingProduct.price,
                        totalPrice:existingProduct.price + existingProduct.price
                    },
              },
              }, (err, _cart)=>{
                if(err){
                    console.log(err);
                }
                if(_cart){
                    res.redirect("/")
                }
              })
        }else{
            // if  user with d same userId exist but  item not exist
            CartSchema.findOneAndUpdate({userId:req.user._id}, {
                "$push":{ 
                    "userCart":createCart
         }
              }).exec((err, _cart)=>{
                  if(err){
                      console.log(err);
                  }
                  if(_cart){
                      res.redirect("/")
                  }
              })
            
        }
    }else{

        // if  item is nt exist add cart
        const myCart = new CartSchema({
            userId:req.user._id,
            userCart:[createCart]

        })

        myCart.save((err, cart)=>{
            if(err){
                console.log(err);
            }
            if(cart){
                res.redirect("/")
            }
        })
        
    }
})

})

   




    
       





module.exports = cartRouter