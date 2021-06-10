const express = require("express")
const mongoose = require("mongoose")
const productSchema = require("../model/productSchema")
const CartSchema = require("../model/CartSchema")
const UserSchema = require("../model/UserSchema")
const axios = require("axios").default

const cartRouter = express.Router()
const auth  = require("../config/auth")



cartRouter.post("/mycart", auth, (req, res) =>{
 const info = req.body
 res.render("./checkout/checkOut_edit_form", {
   title:"update checkout info",
   user:req.user,
   info,
   layout: false
 })
})



    

cartRouter.post("/payment", async(req, res) =>{
    
    const url ="https://api.paystack.co/transaction/initialize"

  const config = {
    headers: {
      "Content-Type": "application/json",

    },
  }
  // Add Your Key Here!!!
  axios.defaults.headers.common = {
    "Authorization":`Bearer ${process.env.payStackKey}`,
  };

  const checkout = await axios({
    method: "post",
    url: url,
    data :{
        email:req.user.email,
        amount: req.body.grand.slice(1),
        currency:"NGN",
        phone:req.body.phone,
        channels:["card"],
        callback_url:"https://checkout.paystack.com/30sohnybslit8cr",
       

        "metadata":{
            
            "custom_fields":[
              
              {
                "display_name":req.user.username,
                "phone":req.body.phone
                
              },
              
            ]
          },
    

    },
    config,
  })
    
    
if(checkout){
    console.log(checkout);

    res.redirect(`/cart/payment/${checkout.data.data.reference}`)
}else{
    console.log(data.message);
}



  
})


cartRouter.get("/payment/:id", auth, async(req, res) =>{
    const url =`https://api.paystack.co/transaction/verify/${req.params.id}`

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization":`Bearer ${process.env.payStackKey}`,
      },
    }
  
    // Add Your Key Here!!!
    // axios.defaults.headers.common = {
    // };


    let smsD = await axios({
        method: "get",
        url: url,
        config,
      })
        
        
    if(smsD){
      console.log(smsD.data.data.amount);
      res.render("./checkout/payment", {
        title:"payment",
        user:req.user,
        layout:false,
        checkout:smsD.data.data,
        id:req.params.id
      })
        // res.redirect(`/cart/payment/${smsD.data.data.reference}`)
    }else{
        console.log("error");
    }
    
   
})




// charge customer

cartRouter.post("/payment/:id", auth,(req, res) =>{

console.log(req.body);
  const url ="https://api.paystack.co/charge"

  const config = {
    headers: {
      "Content-Type": "application/json",

    },
  }
  // Add Your Key Here!!!
  axios.defaults.headers.common = {
    "Authorization":`Bearer ${process.env.payStackKey}`,
  };

   axios({
    method: "post",
    url: url,
    data :{
        email:req.user.email,
        amount: req.body.amount,
        currency:"NGN",
        
        
       

        "metadata":{
            
            "custom_fields":[
              
              {
                "display_name":"product payment",  
              },
              
            ]
          },
          "card":{
            "cvv":req.body.cvv,
            "number":req.body.cardNumbar,
            "expiry_month":req.body.exp_month,
            "expiry_year":req.body.exp_year
          },
          "pin":req.body.pin
          
        

    },
    config,
  
  })
  .then(resp =>{
    console.log(resp.data.data);
    res.render("./checkout/otp",{
      title:"enter pin",
      otp:resp.data.data,
      layout:false,
      user:req.user
    })
    
  })
  .catch(err => console.log(err))
  
})



// sumbmit PIN
// cartRouter.post("/payment/pin/:id", auth, (req, res) =>{
//   console.log(req.body);
//   const url ="https://api.paystack.co/charge/submit_pin"

//   const config = {
//     headers: {
//       "Content-Type": "application/json",

//     },
//   }
//   // Add Your Key Here!!!
//   axios.defaults.headers.common = {
//     "Authorization":`Bearer ${process.env.payStackKey}`,
//   };

//    axios({
//     method: "post",
//     url: url,
//     data :{
//       pin:req.body.pin,
//       reference:req.body.reference
//     },
//     config,
  
//   })
//   .then(resp =>{
//     console.log(resp.data.data);
//     res.render("otp",{
//       title:"enter otp",
//       otp:resp.data.data,
//       layout:false,
//       user:req.user
//     })
    
//   })
//   .catch(err => {
//     console.log(err);
    
//   })
// })





// sumbmit otp
cartRouter.post("/payment/otp/:id", auth, async(req, res) =>{
  console.log(req.body);
  const url ="https://api.paystack.co/charge/submit_otp"

  const config = {
    headers: {
      "Content-Type": "application/json",

    },
  }
  // Add Your Key Here!!!
  axios.defaults.headers.common = {
    "Authorization":`Bearer ${process.env.payStackKey}`,
  };

  try {
    let setOpt = await axios({
      method: "post",
      url: url,
      data :{
        otp:req.body.otp,
        reference:req.body.reference
      },
      config,
    
    })
    if(setOpt){
      console.log(setOpt);
      res.render("./checkout/message",{
        title:"freaky",
        data:setOpt.data.data,
        layout:false,
        user:req.user
      })
    }
    
  } catch (error) {
    console.log(error);
  }
})

















// get cart items
// cartRouter.get("/",  async(req, res)=>{
    
    
//         res.render("mycart", {
//             title : "my Cart",
//             user: req.user,
        
    
//             layout: false,
           
//             success:req.flash("success")

           
//         })
 
      
    
    
   

// })


// cartRouter.post("/", async(req, res) =>{
//     let {userId, productId, myfiles, price, color, quantity, sizes, totalPrice} = req.body
//     console.log(req.body);
// })

// purchase




// remove items from cart

// cartRouter.put("/delete/:id", auth,  async (req, res) =>{

//      await CartSchema.findOne({userId:req.user.id}, (err, data)=>{
//         if(err)console.log(err);
//         if(data){
//             let removeproduct = data.userCart.find(c => c.id == req.params.id)
//             if(removeproduct){
//                CartSchema.findOneAndUpdate({userId:req.user.id}, {$pull:{
//                 "userCart":removeproduct
//                }
//             }).exec((err, _cart)=>{
//                 if(err){
//                     console.log(err);
//                 }
//                 if(_cart){
//                     res.redirect(`/users/cart/${req.user.id}`)
//                     req.flash("deleted", "item deleted successfully")

//                 }
//             })
//             }else{
//                 console.log("not found");
//             }
//         }
//     })
   
   
// })
// cartRouter.put("/update/:id",  async(req, res) =>{
  
//       let  productId = req.params.id
//     let price = req.body.price
//        let quantity = req.body.quantity
//        let color = req.body.color
//        let sizes = req.body.sizes

   
    
//     let cart = await CartSchema.findOne({userId:req.user.id}, (err, data)=>{
//         if(err)console.log(err);
//         if(data){
//             let editproduct = data.userCart.find(c => c.id == productId)
//             if(editproduct){
                
//                 CartSchema.findOneAndUpdate({userId:req.user.id, "userCart.productId":editproduct.productId}, {
//                     "$set":{
//                         "userCart.$":{
//                             quantity:quantity,
//                             sizes:sizes,
//                             color:color,
//                             productId:editproduct.productId,
//                             price:parseInt(price * quantity),
//                             totalPrice: price += price

//                         }
//                 }
//             }).exec((err, _cart)=>{
//                 if(err)console.log(err);
//                 if(_cart){
//                     res.redirect(`/users/cart/${req.user.id}`)
//                 }
//             })
                
//             }else{
//                 console.log("not found");
//             }
//         }
//     })
    
// })





// // add to cart
// cartRouter.post("/:id", auth,(req, res)=>{
    
//     const createCart = {
//         productId:req.params.id,
//         price:parseInt(req.body.price),
//         quantity:req.body.quantity,
//         sizes:req.body.sizes,
//         color:req.body.color
//     }

// CartSchema.findOne({userId:req.user._id}).exec((err, cart)=>{
//     if(err){
//         console.log(err)
//     }
//     if(cart){
//         let product = req.params.id
//         let existingProduct = cart.userCart.find(c => c.productId == product)
        
//         if(existingProduct){
//             // if product is dsame with the product ind the database
//             CartSchema.findOneAndUpdate({"userId":req.user._id, "userCart.productId":product}, {
//                 "$set":{ 
//                     "userCart.$":{
//                         ...createCart,
//                         quantity:existingProduct.quantity +1,
//                         price:createCart.price * (existingProduct.quantity +1),
//                     }
                   
//               },
//               }, (err, _cart)=>{
//                 if(err){
//                     console.log(err);
//                 }
//                 if(_cart){
//                     console.log(_cart);
//                     req.flash("success", `product already added exists in the cart`)
//                     console.log(`product already exist added in the cart`);
//                     console.log(req.user);
//                     res.redirect("/")
//                 }
//               })
//         }else{
//             // if  user with d same userId exist but  item not exist
//             CartSchema.findOneAndUpdate({userId:req.user._id}, {
//                 "$push":{ 
//                     "userCart":createCart
//          }
//               }).exec((err, _cart)=>{
//                   if(err){
//                       console.log(err);
//                   }
//                   if(_cart){
//                     req.flash("success", `product added successfully`)
//                     console.log(`product added successfully`);

//                       res.redirect("/")
//                   }
//               })
            
//         }
//     }else{

//         // if  item is nt exist add cart
//         const myCart = new CartSchema({
//             userId:req.user._id,
//             userCart:[createCart]

//         })

//         myCart.save((err, cart)=>{
//             if(err){
//                 console.log(err);
//             }
//             if(cart){
//                 req.flash("success", `product added successfully`)
//                 console.log(`product added successfully`);
//                 res.redirect("/")
//             }
//         })
        
//     }
// })

// })

   




    
// cartRouter.post("/:id/payment",   (req, res) =>{
//     let amount = req.body.amount
   
//     stripe.customers.create({
//         email: req.body.stripeEmail,
//         source:req.body.stripeToken
//     })
   
//     .then(customer =>{
//         stripe.charges.create({
//             amount,
//             description:"freaky store",
//             currency: "usd",
//             customer:customer.id
//         })
//     })
//    .then(charge =>{
//        console.log(charge);
//       res.render("payment",{
//           title:"success",
//           layout:false,
//           user:req.user,
//           id:charge.id
//       })
//    })
   
   
// })






module.exports = cartRouter