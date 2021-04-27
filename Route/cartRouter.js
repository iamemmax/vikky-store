const express = require("express")
const mongoose = require("mongoose")
const productSchema = require("../model/productSchema")
const CartSchema = require("../model/CartSchema")
const UserSchema = require("../model/UserSchema")
const cartRouter = express.Router()
const auth = require("../config/auth")


const Publishable = process.env.Publishable
const Secret_key = process.env.Secret

const stripe = require("stripe")(Secret_key)




// get cart items
cartRouter.get("/:id", auth, async(req, res)=>{
    let error = []
    let cart = await CartSchema.find({userId:req.user.id}, (err)=>{
        console.log(err);
    }).populate("userCart.productId userId")
    if(cart){
        let myCart = cart[0].userCart.map(c => c.quantity)
        let totalQty = myCart.reduce((a, b) => a + b, 0)

        res.render("mycart", {
            title : "my Cart",
            user: req.user,
            cart,
            key:Publishable,
            layout: false,
            totalQty
           
        })
    }else{
        error.push({msg: "cart empty"})
        res.render("/")
        // res.render("index", {
        //     title : "Homepage",
        //     user: req.user,
        //     cart,
            
            
            
        // })
        
    }
    
   

})


// purchase




// remove items from cart

cartRouter.put("/delete/:id", auth,  async (req, res) =>{

     await CartSchema.findOne({userId:req.user.id}, (err, data)=>{
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
cartRouter.put("/update/:id",  async(req, res) =>{
  
      let  productId = req.params.id
    let price = req.body.price
       let quantity = req.body.quantity
       let color = req.body.color
       let sizes = req.body.sizes

   
    
    let cart = await CartSchema.findOne({userId:req.user.id}, (err, data)=>{
        if(err)console.log(err);
        if(data){
            let editproduct = data.userCart.find(c => c.id == productId)
            if(editproduct){
                
                CartSchema.findOneAndUpdate({userId:req.user.id, "userCart.productId":editproduct.productId}, {
                    "$set":{
                        "userCart.$":{
                            quantity:quantity,
                            sizes:sizes,
                            color:color,
                            productId:editproduct.productId,
                            price:parseInt(price * quantity),
                            totalPrice: price += price

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





// add to cart
cartRouter.post("/:id", auth,(req, res)=>{
    
    const createCart = {
        productId:req.params.id,
        price:parseInt(req.body.price),
        quantity:req.body.quantity,
        sizes:req.body.sizes,
        color:req.body.color
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
                        price:createCart.price * (existingProduct.quantity +1),
                    }
                   
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

   




    
cartRouter.post("/:id/payment",   (req, res) =>{
    let amount = req.body.amount
   
    stripe.customers.create({
        email: req.body.stripeEmail,
        source:req.body.stripeToken
    })
   
    .then(customer =>{
        stripe.charges.create({
            amount,
            description:"freaky store",
            currency: "usd",
            customer:customer.id
        })
    })
   .then(charge =>{
       console.log(charge);
      res.render("payment",{
          title:"success",
          layout:false,
          user:req.user,
          id:charge.id
      })
   })
   
   
})






module.exports = cartRouter