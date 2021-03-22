const express = require("express")
const mongoose = require("mongoose")
const productSchema = require("../model/productSchema")
const CartSchema = require("../model/CartSchema")
const UserSchema = require("../model/UserSchema")
const cartRouter = express.Router()
const auth = require("../config/auth")


cartRouter.get("/:id", auth, async(req, res)=>{
    let cart = await CartSchema.find({userId:req.user.id}).populate("userCart.productId userId")
   

    res.render("mycart", {
        title : "my Cart",
        user: req.user,
        cart,
       
    })
    console.log(cart);
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
            CartSchema.findOneAndUpdate({"userId":req.user._id, "userCart.productId":product}, {
                "$set":{ 
                    "userCart.$":{
                        ...createCart,
                        quantity:existingProduct.quantity +1,
                        price:existingProduct.price * existingProduct.quantity 
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